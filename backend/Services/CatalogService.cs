using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using backend.Repositories;
<<<<<<< HEAD
using backend.Mappers;
namespace backend.Services;

=======

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

>>>>>>> origin/main
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
<<<<<<< HEAD
        return categories.Select(CategoryMappingExtensions.ToDto).ToList();
    }

    public async Task<List<ProductDto>> GetProductsAsync(GetProductsDto request)
    {
        var products = await _productRepository.GetFilteredAsync(request);
        List<ProductDto> l = new List<ProductDto>();
        foreach (var product in products) { 
            l.Add(ProductMappingExtensions.ToDto(product));
        }
        return l;
=======
        return categories.Select(MapCategory).ToList();
    }

    public async Task<List<ProductDto>> GetProductsAsync(string? search = null, string? category = null, string? brand = null, decimal? minPrice = null, decimal? maxPrice = null, double? rating = null, string? sort = null)
    {
        var products = await _productRepository.GetFilteredAsync(search, category, brand, minPrice, maxPrice, rating, sort);
        return products.Select(MapProduct).ToList();
>>>>>>> origin/main
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
<<<<<<< HEAD
        return product == null ? null : ProductMappingExtensions.ToDto(product);
=======
        return product == null ? null : MapProduct(product);
>>>>>>> origin/main
    }

    public async Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId);
<<<<<<< HEAD
        return reviews.Select(ReviewMappingExtensions.ToDto).ToList();
    }

    public async Task<List<ProductDto>> GetFeaturedAsync(int n)
    {
        var products = await _productRepository.GetAllAsync();
        return products.OrderByDescending(x => x.Rating).Take(n).Select(ProductMappingExtensions.ToDto).ToList();
=======
        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            ProductId = r.ProductId,
            UserId = r.UserId,
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
        var products = await _productRepository.GetNewestAsync();
        return products.Select(MapProduct).ToList();
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

    internal static ProductDto MapProduct(Product product)
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
            OwnerUserId = product.OwnerUserId,
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
>>>>>>> origin/main
    }
}
