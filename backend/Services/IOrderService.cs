using backend.DTOs;

namespace backend.Services
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetOrdersAsync(int? userId = null);
        Task<OrderDto?> CreateOrderAsync(int? userId, CreateOrderDto request);
    }
}
