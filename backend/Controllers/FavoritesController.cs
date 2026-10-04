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
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = User.GetUserId() ?? throw new UnauthorizedAccessException();
            var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavorite([FromBody] ToggleFavoriteDto dto)
        {
            var userId = User.GetUserId() ?? throw new UnauthorizedAccessException();
            var isAdded = await _favoriteService.ToggleFavoriteAsync(userId, dto.ProductId);
            return Ok(new { isFavorite = isAdded });
        }

        [HttpGet("check/{productId:int}")]
        public async Task<IActionResult> CheckFavorite(int productId)
        {
            var userId = User.GetUserId() ?? throw new UnauthorizedAccessException();
            var isFavorite = await _favoriteService.IsFavoriteAsync(userId, productId);
            return Ok(new { isFavorite });
        }
    }
}