using backend.Entities;

namespace backend.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(int id);
    Task AddAsync(User user);
    Task SaveChangesAsync();
}

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(string id);
    Task<Category?> GetBySlugAsync(string slug);
}

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> GetNewestAsync();
    Task<Product?> GetByIdAsync(int id);
    Task<List<Product>> GetFilteredAsync(string? search, string? category, string? brand, decimal? minPrice, decimal? maxPrice, double? rating, string? sort);
}

public interface IReviewRepository
{
    Task<List<Review>> GetByProductIdAsync(int productId);
    Task AddAsync(Review review);
    Task SaveChangesAsync();
}
