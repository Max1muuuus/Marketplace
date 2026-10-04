using backend.Entities;

namespace backend.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<CategoryEntity>> GetAllAsync();
        Task<CategoryEntity?> GetCategoryAsync(int id);
        Task<CategoryEntity?> GetCategoryAsync(string slug);
    }
}
