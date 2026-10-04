using backend.Entities;

namespace backend.Repositories
{
    public interface ICartRepository
    {
        Task<List<CartItemEntity>> GetCartByUserIdAsync(int userId);
        Task<CartItemEntity?> GetCartItemAsync(int userId, int productId);
        Task AddItemAsync(CartItemEntity cartItem);
        Task UpdateItemAsync(CartItemEntity cartItem);
        Task RemoveItemAsync(CartItemEntity cartItem);
        Task ClearCartAsync(int userId);
    }
}
