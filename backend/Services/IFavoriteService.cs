using backend.DTOs;

namespace backend.Services
{
    public interface IFavoriteService
    {
        Task<IEnumerable<ProductDto>> GetUserFavoritesAsync(int userId);
        Task<bool> ToggleFavoriteAsync(int userId, int productId);
        Task<bool> IsFavoriteAsync(int userId, int productId);
    }
}