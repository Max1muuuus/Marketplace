using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<CategoryEntity>> GetAllAsync()
            => await _context.Categories.AsNoTracking().OrderBy(x => x.Name).ToListAsync();

        public async Task<CategoryEntity?> GetCategoryAsync(int id)
            => await _context.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

        public async Task<CategoryEntity?> GetCategoryAsync(string slug)
            => await _context.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Slug == slug);
    }
}
