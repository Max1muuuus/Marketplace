using backend.DTOs;

namespace backend.Services
{
    public interface ICartService
    {
        Task<List<CartItemDto>> GetCartAsync(int userId);
        Task<List<CartItemDto>> AddToCartAsync(int userId, AddToCartDto dto);
        Task<List<CartItemDto>> UpdateQuantityAsync(int userId, UpdateCartItemQuantityDto dto);
        Task<List<CartItemDto>> RemoveFromCartAsync(int userId, int productId);
        Task ClearCartAsync(int userId);
    }
}
