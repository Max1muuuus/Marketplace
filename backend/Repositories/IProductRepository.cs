using backend.DTOs;
using backend.Entities;

namespace backend.Repositories
{
    public interface IProductRepository
    {
        Task<List<ProductEntity>> GetAllAsync();
        Task<ProductEntity?> GetByIdAsync(int id);
        Task<List<ProductEntity>> GetFilteredAsync(GetProductsDto request);
    }
}
