using backend.DTOs;
using backend.Extensions;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CartItemDto>>> GetCart()
        {
            int userId = ClaimsPrincipalExtensions.GetUserId(User) ?? throw new UnauthorizedAccessException();
            return Ok(await _cartService.GetCartAsync(userId));
        }

        [HttpPost("add")]
        public async Task<ActionResult<List<CartItemDto>>> AddToCart([FromBody] AddToCartDto dto)
        {
            int userId = ClaimsPrincipalExtensions.GetUserId(User) ?? throw new UnauthorizedAccessException();
            return Ok(await _cartService.AddToCartAsync(userId, dto));
        }

        [HttpPut("quantity")]
        public async Task<ActionResult<List<CartItemDto>>> UpdateQuantity([FromBody] UpdateCartItemQuantityDto dto)
        {
            int userId = ClaimsPrincipalExtensions.GetUserId(User) ?? throw new UnauthorizedAccessException();
            return Ok(await _cartService.UpdateQuantityAsync(userId, dto));
        }

        [HttpDelete("remove/{productId:int}")]
        public async Task<ActionResult<List<CartItemDto>>> RemoveFromCart(int productId)
        {
            int userId = ClaimsPrincipalExtensions.GetUserId(User) ?? throw new UnauthorizedAccessException();
            return Ok(await _cartService.RemoveFromCartAsync(userId, productId));
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            int userId = ClaimsPrincipalExtensions.GetUserId(User) ?? throw new UnauthorizedAccessException();
            await _cartService.ClearCartAsync(userId);
            return Ok();
        }
    }
}