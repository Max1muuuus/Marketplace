using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductEntity>> GetAllAsync()
            => await _context.Products
                .Include(x => x.Category)
                .Include(x => x.Seller)
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .ToListAsync();

        public async Task<ProductEntity?> GetByIdAsync(int id)
            => await _context.Products
                .Include(x => x.Category)
                .Include(x => x.Seller)
                .Include(x => x.Reviews)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

        public async Task<List<ProductEntity>> GetFilteredAsync(GetProductsDto request)
        {
            var query = _context.Products
                .Include(x => x.Category)
                .Include(x => x.Seller)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.search))
            {
                var lower = request.search.Trim();
                query = query.Where(x => x.Name.Contains(lower) || x.Brand.Contains(lower) || x.Description.Contains(lower));
            }

            if (!string.IsNullOrWhiteSpace(request.category))
            {
                query = query.Where(x => x.Category != null &&
                    x.Category.Name.Contains(request.category));
            }

            if (!string.IsNullOrWhiteSpace(request.brand))
            {
                query = query.Where(x => x.Brand.Contains(request.brand));
            }

            if (request.minPrice.HasValue)
            {
                query = query.Where(x => x.Price >= request.minPrice.Value);
            }

            if (request.maxPrice.HasValue)
            {
                query = query.Where(x => x.Price <= request.maxPrice.Value);
            }

            if (request.rating.HasValue)
            {
                query = query.Where(x => x.Rating >= request.rating.Value);
            }

            bool isDescending = request.sortOrder?.ToLower() == "desc";

            query = request.sortBy?.ToLower() switch
            {
                "price" => isDescending
            ? query.OrderByDescending(x => x.Price)
            : query.OrderBy(x => x.Price),

                "rating" => isDescending
                    ? query.OrderByDescending(x => x.Rating)
                    : query.OrderBy(x => x.Rating),

                "name" => isDescending
                    ? query.OrderByDescending(x => x.Name)
                    : query.OrderBy(x => x.Name),

                "brand" => isDescending
                    ? query.OrderByDescending(x => x.Brand)
                    : query.OrderBy(x => x.Brand),

                _ => isDescending
                    ? query.OrderByDescending(x => x.Id)
                    : query.OrderBy(x => x.Id)
            };

            return await query.ToListAsync();
        }
    }

}
