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

        var order = new OrderEntity
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
        }

        if (!order.Items.Any())
            return null;


        await _orderRepository.AddAsync(order);

        return OrderMappingExtensions.ToDto(order);
    }
}
