using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Mappers;
using backend.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;


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
    }

    public async Task<List<OrderDto>> GetOrdersAsync(int? userId = null)
    {
        var orders = await _orderRepository.GetAllAsync(userId);
        return orders.Select(OrderMappingExtensions.ToDto).ToList();
    }

    public async Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderDto request)
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

        var order = new OrderEntity
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
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null || item.Quantity <= 0)
                continue;

            order.Items.Add(new OrderItemEntity
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

        await _orderRepository.AddAsync(order);

        return OrderMappingExtensions.ToDto(order);
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
