using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
        => await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

    public async Task<User?> GetByIdAsync(int id)
        => await _context.Users.FindAsync(id);

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync()
        => await _context.Categories.AsNoTracking().OrderBy(x => x.Name).ToListAsync();

    public async Task<Category?> GetByIdAsync(string id)
        => await _context.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

    public async Task<Category?> GetBySlugAsync(string slug)
        => await _context.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Slug == slug);
}

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
        => await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Seller)
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ToListAsync();

    public async Task<List<Product>> GetNewestAsync()
        => await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Seller)
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .ThenByDescending(x => x.Id)
            .Take(6)
            .ToListAsync();

    public async Task<Product?> GetByIdAsync(int id)
        => await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Seller)
            .Include(x => x.Reviews)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

    public async Task<List<Product>> GetFilteredAsync(string? search, string? category, string? brand, decimal? minPrice, decimal? maxPrice, double? rating, string? sort)
    {
        var query = _context.Products
            .Include(x => x.Category)
            .Include(x => x.Seller)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lower = search.Trim();
            query = query.Where(x => x.Name.Contains(lower) || x.Brand.Contains(lower) || x.Description.Contains(lower));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(x => x.CategoryId == category);
        }

        if (!string.IsNullOrWhiteSpace(brand))
        {
            query = query.Where(x => x.Brand == brand);
        }

        if (minPrice.HasValue)
        {
            query = query.Where(x => x.Price >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(x => x.Price <= maxPrice.Value);
        }

        if (rating.HasValue)
        {
            query = query.Where(x => x.Rating >= rating.Value);
        }

        query = sort switch
        {
            "price-asc" => query.OrderBy(x => x.Price),
            "price-desc" => query.OrderByDescending(x => x.Price),
            "rating" => query.OrderByDescending(x => x.Rating),
            _ => query.OrderByDescending(x => x.Id)
        };

        return await query.ToListAsync();
    }
}

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Review>> GetByProductIdAsync(int productId)
        => await _context.Reviews
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.Date)
            .ToListAsync();

    public async Task AddAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
