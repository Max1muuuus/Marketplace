using backend.Entities;

namespace backend.Repositories
{
    public interface IFavoriteRepository
    {
        Task<IEnumerable<ProductEntity>> GetFavoritesByUserIdAsync(int userId);
        Task<FavoriteEntity?> GetFavoriteAsync(int userId, int productId);
        Task<bool> ProductExistsAsync(int productId);
        Task AddAsync(FavoriteEntity favorite);
        void Remove(FavoriteEntity favorite);
        Task SaveChangesAsync();
    }
}