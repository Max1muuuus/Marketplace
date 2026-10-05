using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface IOrderService
{
    Task<List<OrderDto>> GetOrdersAsync(int? userId = null);
    Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderRequest request);
}

public class OrderService : IOrderService
{
    private const decimal ShippingFee = 299m;
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderDto>> GetOrdersAsync(int? userId = null)
    {
        var query = _context.Orders
            .Include(x => x.Items)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId.Value);

        var orders = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        return orders.Select(MapOrder).ToList();
    }

    public async Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderRequest request)
    {
        if (request.Items == null || !request.Items.Any())
            return null;

        var requestedItems = request.Items
            .GroupBy(item => item.ProductId)
            .Select(group => new CreateOrderItemRequest { ProductId = group.Key, Quantity = group.Sum(item => item.Quantity) })
            .ToList();
        if (requestedItems.Any(item => item.ProductId <= 0 || item.Quantity <= 0))
            return null;

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var order = new Order
        {
            UserId = userId,
            CustomerName = $"{request.FirstName} {request.LastName}".Trim(),
            Email = request.Email,
            Phone = request.Phone,
            City = request.City,
            Address = request.Address,
            DeliveryMethod = request.Delivery,
            PaymentMethod = request.Payment,
            TotalAmount = 0,
            Status = "Pending"
        };

        foreach (var item in requestedItems)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null || product.Stock < item.Quantity)
                return null;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ProductImage = product.Image,
                Price = product.Price,
                Quantity = item.Quantity
            });

            order.TotalAmount += product.Price * item.Quantity;
            product.Stock -= item.Quantity;
            if (product.Stock == 0)
                product.Status = "out-of-stock";
        }

        if (!order.Items.Any())
            return null;

        order.TotalAmount += ShippingFee;
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return MapOrder(order);
    }

    private static OrderDto MapOrder(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            CreatedAt = order.CreatedAt,
            CustomerName = order.CustomerName,
            Email = order.Email,
            Phone = order.Phone,
            City = order.City,
            Address = order.Address,
            DeliveryMethod = order.DeliveryMethod,
            PaymentMethod = order.PaymentMethod,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            Items = order.Items.Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList()
        };
    }
}
