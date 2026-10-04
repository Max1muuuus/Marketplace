using backend.DTOs;
using backend.Entities;
using backend.Repositories;

namespace backend.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<List<CartItemDto>> GetCartAsync(int userId)
        {
            var items = await _cartRepository.GetCartByUserIdAsync(userId);
            return items.Select(MapToDto).ToList();
        }

        public async Task<List<CartItemDto>> AddToCartAsync(int userId, AddToCartDto dto)
        {
            var product = await _productRepository.GetByIdAsync(dto.ProductId);
            if (product == null) return await GetCartAsync(userId);

            var existingItem = await _cartRepository.GetCartItemAsync(userId, dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                await _cartRepository.UpdateItemAsync(existingItem);
            }
            else
            {
                var newItem = new CartItemEntity
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                await _cartRepository.AddItemAsync(newItem);
            }

            return await GetCartAsync(userId);
        }

        public async Task<List<CartItemDto>> UpdateQuantityAsync(int userId, UpdateCartItemQuantityDto dto)
        {
            var existingItem = await _cartRepository.GetCartItemAsync(userId, dto.ProductId);
            if (existingItem == null) return await GetCartAsync(userId);

            existingItem.Quantity += dto.Delta;

            if (existingItem.Quantity <= 0)
            {
                await _cartRepository.RemoveItemAsync(existingItem);
            }
            else
            {
                await _cartRepository.UpdateItemAsync(existingItem);
            }

            return await GetCartAsync(userId);
        }

        public async Task<List<CartItemDto>> RemoveFromCartAsync(int userId, int productId)
        {
            var existingItem = await _cartRepository.GetCartItemAsync(userId, productId);
            if (existingItem != null)
            {
                await _cartRepository.RemoveItemAsync(existingItem);
            }

            return await GetCartAsync(userId);
        }

        public async Task ClearCartAsync(int userId)
        {
            await _cartRepository.ClearCartAsync(userId);
        }

        private static CartItemDto MapToDto(CartItemEntity entity) => new()
        {
            Id = entity.Id,
            ProductId = entity.ProductId,
            Name = entity.Product?.Name ?? string.Empty,
            Image = entity.Product?.Image ?? string.Empty,
            Price = entity.Product?.Price ?? 0,
            Quantity = entity.Quantity
        };
    }
}
