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

        foreach (var item in request.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null || item.Quantity <= 0)
                continue;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ProductImage = product.Image,
                Price = product.Price,
                Quantity = item.Quantity
            });

            order.TotalAmount += product.Price * item.Quantity;
        }

        if (!order.Items.Any())
            return null;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return MapOrder(order);
    }

    private static OrderDto MapOrder(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
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
