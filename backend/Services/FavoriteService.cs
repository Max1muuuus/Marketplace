using backend.DTOs;
using backend.Entities;
using backend.Mappers; // Припускаємо, що екстеншн ToDto() лежить тут
using backend.Repositories;

namespace backend.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;

        public FavoriteService(IFavoriteRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetUserFavoritesAsync(int userId)
        {
            var productEntities = await _favoriteRepository.GetFavoritesByUserIdAsync(userId);

            return productEntities.Select(p => p.ToDto());
        }

        public async Task<bool> ToggleFavoriteAsync(int userId, int productId)
        {
            var existingFavorite = await _favoriteRepository.GetFavoriteAsync(userId, productId);

            if (existingFavorite != null)
            {
                _favoriteRepository.Remove(existingFavorite);
                await _favoriteRepository.SaveChangesAsync();
                return false;
            }

            var productExists = await _favoriteRepository.ProductExistsAsync(productId);
            if (!productExists)
            {
                throw new KeyNotFoundException("Product not found");
            }

            var newFavoriteEntity = new FavoriteEntity
            {
                UserId = userId,
                ProductId = productId,
                CreatedAt = DateTime.UtcNow
            };

            await _favoriteRepository.AddAsync(newFavoriteEntity);
            await _favoriteRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsFavoriteAsync(int userId, int productId)
        {
            var favorite = await _favoriteRepository.GetFavoriteAsync(userId, productId);
            return favorite != null;
        }
    }
}