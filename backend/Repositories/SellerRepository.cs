using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SellerRepository : ISellerRepository
    {
        private readonly AppDbContext _context; // замініть на назву вашого DbContext

        public SellerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SellerEntity>> GetAllAsync()
        {
            return await _context.Sellers.AsNoTracking().ToListAsync();
        }

        public async Task<SellerEntity?> GetByIdAsync(int id)
        {
            return await _context.Sellers.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task AddAsync(SellerEntity seller)
        {
            await _context.Sellers.AddAsync(seller);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SellerEntity seller)
        {
            _context.Sellers.Update(seller);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var seller = await _context.Sellers.FindAsync(id);
            if (seller != null)
            {
                _context.Sellers.Remove(seller);
                await _context.SaveChangesAsync();
            }
        }
    }
}
