using backend.Entities;

namespace backend.Repositories
{
    public interface IOrderRepository
    {
        Task<List<OrderEntity>> GetAllAsync(int? userId = null);
        Task AddAsync(OrderEntity order);
    }
}
