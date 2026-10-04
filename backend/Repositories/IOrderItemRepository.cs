using backend.Entities;

namespace backend.Repositories
{
    public interface IOrderItemRepository
    {
        Task<OrderItemEntity?> GetOrderItemAsync(int id);
        Task AddAsync(OrderItemEntity orderItem);
    }
}
