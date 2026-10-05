using backend.DTOs;

namespace backend.Services
{
    public interface ICatalogService
    {
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<List<ProductDto>> GetProductsAsync(GetProductsDto request);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<List<ReviewDto>> GetReviewsByProductIdAsync(int productId);
        Task<List<ProductDto>> GetFeaturedAsync(int n);
    }
}
