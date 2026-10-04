using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using backend.Repositories;
using backend.Mappers;
namespace backend.Services;

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
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : ProductMappingExtensions.ToDto(product);
    }

    public async Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId)
    {
        var reviews = await _reviewRepository.GetByProductIdAsync(productId);
        return reviews.Select(ReviewMappingExtensions.ToDto).ToList();
    }

    public async Task<List<ProductDto>> GetFeaturedAsync(int n)
    {
        var products = await _productRepository.GetAllAsync();
        return products.OrderByDescending(x => x.Rating).Take(n).Select(ProductMappingExtensions.ToDto).ToList();
    }
}
