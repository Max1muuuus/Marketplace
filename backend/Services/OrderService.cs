using backend.Data;
using backend.DTOs;
using backend.Entities;
<<<<<<< HEAD
using backend.Mappers;
using backend.Repositories;
=======
>>>>>>> origin/main
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

<<<<<<< HEAD

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;
    private readonly IProductRepository _productRepository;

    public OrderService(IOrderRepository orderRepository, IOrderItemRepository orderItemRepository, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _productRepository = productRepository;
=======
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
>>>>>>> origin/main
    }

    public async Task<List<OrderDto>> GetOrdersAsync(int? userId = null)
    {
<<<<<<< HEAD
        var orders = await _orderRepository.GetAllAsync(userId);
        return orders.Select(OrderMappingExtensions.ToDto).ToList();
    }

    public async Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderDto request)
=======
        var query = _context.Orders
            .Include(x => x.Items)
            .AsQueryable();

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId.Value);

        var orders = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        return orders.Select(MapOrder).ToList();
    }

    public async Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderRequest request)
>>>>>>> origin/main
    {
        if (request.Items == null || !request.Items.Any())
            return null;

<<<<<<< HEAD
        var order = new OrderEntity
=======
        var order = new Order
>>>>>>> origin/main
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
<<<<<<< HEAD
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null || item.Quantity <= 0)
                continue;

            order.Items.Add(new OrderItemEntity
=======
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null || item.Quantity <= 0)
                continue;

            order.Items.Add(new OrderItem
>>>>>>> origin/main
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

<<<<<<< HEAD

        await _orderRepository.AddAsync(order);

        return OrderMappingExtensions.ToDto(order);
=======
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
>>>>>>> origin/main
    }
}
