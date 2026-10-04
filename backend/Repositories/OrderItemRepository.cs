using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly AppDbContext _context;

        public OrderItemRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<OrderItemEntity?> GetOrderItemAsync(int id)
        {
            return await _context.OrderItems.FirstOrDefaultAsync(oi => oi.Id == id);
        }

        public async Task AddAsync(OrderItemEntity orderItem)
        {
            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();
        }
    }
}
