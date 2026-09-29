using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using backend.Repositories;

namespace backend.Services;

public interface ICatalogService
{
    Task<List<CategoryDto>> GetCategoriesAsync();
    Task<List<ProductDto>> GetProductsAsync(string? search = null, string? category = null, string? brand = null, decimal? minPrice = null, decimal? maxPrice = null, double? rating = null, string? sort = null);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId);
    Task<List<ProductDto>> GetFeaturedAsync();
    Task<List<ProductDto>> GetNewestAsync();
    Task<List<ProductDto>> GetPopularAsync();
}

public class CatalogService : ICatalogService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly IReviewRepository _reviewRepository;

    public CatalogService(ICategoryRepository categoryRepository, IProductRepository productRepository, IReviewRepository reviewRepository)
    {
        _categoryRepository = categoryRepository;
        _productRepository = productRepository;
        _reviewRepository = reviewRepository;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(MapCategory).ToList();
    }

    public async Task<List<ProductDto>> GetProductsAsync(string? search = null, string? category = null, string? brand = null, decimal? minPrice = null, decimal? maxPrice = null, double? rating = null, string? sort = null)
    {
        var products = await _productRepository.GetFilteredAsync(search, category, brand, minPrice, maxPrice, rating, sort);
        return products.Select(MapProduct).ToList();
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : MapProduct(product);
    }

    public async Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId);
        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            User = r.UserName,
            Rating = r.Rating,
            Date = r.Date.ToString("yyyy-MM-dd"),
            Text = r.Text
        }).ToList();
    }

    public async Task<List<ProductDto>> GetFeaturedAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Take(4).Select(MapProduct).ToList();
    }

    public async Task<List<ProductDto>> GetNewestAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Take(6).Select(MapProduct).ToList();
    }

    public async Task<List<ProductDto>> GetPopularAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.OrderByDescending(x => x.Rating).Take(6).Select(MapProduct).ToList();
    }

    private static CategoryDto MapCategory(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Icon = category.Icon,
        Description = category.Description,
        Slug = category.Slug
    };

    private static ProductDto MapProduct(Product product)
    {
        var gallery = TryParseStringArray(product.Gallery);
        var specs = TryParseDictionary(product.Specs);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Brand = product.Brand,
            Category = product.Category?.Id ?? product.CategoryId,
            Price = product.Price,
            OldPrice = product.OldPrice,
            Rating = product.Rating,
            ReviewCount = product.ReviewCount,
            Stock = product.Stock,
            Condition = product.Condition,
            SellerId = product.SellerId,
            Image = product.Image,
            Gallery = gallery,
            Description = product.Description,
            Specs = specs,
            Status = product.Status,
            Tag = product.Tag,
            Seller = product.Seller == null ? null : new SellerDto
            {
                Id = product.Seller.Id,
                Name = product.Seller.Name,
                Logo = product.Seller.Logo,
                Rating = product.Seller.Rating,
                Sales = product.Seller.Sales,
                Location = product.Seller.Location,
                Description = product.Seller.Description
            }
        };
    }

    private static string[] TryParseStringArray(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return Array.Empty<string>();

        try
        {
            var parsed = JsonSerializer.Deserialize<string[]>(value);
            return parsed ?? Array.Empty<string>();
        }
        catch
        {
            return new[] { value };
        }
    }

    private static Dictionary<string, object> TryParseDictionary(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return new();

        try
        {
            var parsed = JsonSerializer.Deserialize<Dictionary<string, object>>(value);
            return parsed ?? new Dictionary<string, object>();
        }
        catch
        {
            return new();
        }
    }
}
