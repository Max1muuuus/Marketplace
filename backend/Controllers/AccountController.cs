using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Authorize]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly AppDbContext _context;

    public AccountController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("cart")]
    public async Task<ActionResult<List<CartProductDto>>> GetCart()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();

        var items = await _context.CartItems
            .Where(item => item.UserId == userId)
            .Include(item => item.Product)
            .OrderBy(item => item.Product!.Name)
            .Select(item => new CartProductDto
            {
                Id = item.ProductId,
                Name = item.Product!.Name,
                Image = item.Product.Image,
                Price = item.Product.Price,
                Stock = item.Product.Stock,
                Quantity = item.Quantity
            })
            .ToListAsync();
        return Ok(items);
    }

    [HttpPut("cart")]
    public async Task<IActionResult> ReplaceCart([FromBody] ReplaceCartRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();
        if (request.Items.Any(item => item.ProductId <= 0 || item.Quantity <= 0))
            return BadRequest(new { message = "Cart product IDs and quantities must be positive." });

        var items = request.Items.GroupBy(item => item.ProductId)
            .Select(group => new CartItemRequest { ProductId = group.Key, Quantity = group.Sum(item => item.Quantity) })
            .ToList();
        var productIds = items.Select(item => item.ProductId).ToList();
        var products = await _context.Products.Where(product => productIds.Contains(product.Id)).ToListAsync();
        if (products.Count != productIds.Count)
            return BadRequest(new { message = "One or more cart products no longer exist." });
        var productsById = products.ToDictionary(product => product.Id);
        if (items.Any(item => item.Quantity > productsById[item.ProductId].Stock))
            return BadRequest(new { message = "Cart quantity cannot exceed current stock." });

        await _context.CartItems.Where(item => item.UserId == userId).ExecuteDeleteAsync();
        await _context.CartItems.AddRangeAsync(items.Select(item => new CartItem
        {
            UserId = userId.Value,
            ProductId = item.ProductId,
            Quantity = item.Quantity
        }));
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("favorites")]
    public async Task<ActionResult<List<int>>> GetFavorites()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();
        return Ok(await _context.Favorites.Where(item => item.UserId == userId).Select(item => item.ProductId).ToListAsync());
    }

    [HttpPut("favorites")]
    public async Task<IActionResult> ReplaceFavorites([FromBody] ReplaceFavoritesRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();

        var productIds = request.ProductIds.Distinct().ToList();
        if (productIds.Any(id => id <= 0))
            return BadRequest(new { message = "Favorite product IDs must be positive." });
        if (await _context.Products.CountAsync(product => productIds.Contains(product.Id)) != productIds.Count)
            return BadRequest(new { message = "One or more favorite products no longer exist." });

        await _context.Favorites.Where(item => item.UserId == userId).ExecuteDeleteAsync();
        await _context.Favorites.AddRangeAsync(productIds.Select(productId => new Favorite
        {
            UserId = userId.Value,
            ProductId = productId
        }));
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("rating")]
    public async Task<ActionResult<MarketplaceRatingDto>> GetRating()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();
        var rating = await _context.MarketplaceRatings.Include(item => item.User).SingleOrDefaultAsync(item => item.UserId == userId);
        return rating == null ? NotFound() : Ok(MapRating(rating));
    }

    [HttpPut("rating")]
    public async Task<ActionResult<MarketplaceRatingDto>> SaveRating([FromBody] SaveMarketplaceRatingRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null)
            return Unauthorized();
        var text = request.Text?.Trim() ?? string.Empty;
        if (request.Rating is < 1 or > 5 || text.Length > 500)
            return BadRequest(new { message = "Rating must be from 1 to 5 and comments may not exceed 500 characters." });

        var rating = await _context.MarketplaceRatings.Include(item => item.User).SingleOrDefaultAsync(item => item.UserId == userId);
        if (rating == null)
        {
            rating = new MarketplaceRating { UserId = userId.Value };
            await _context.MarketplaceRatings.AddAsync(rating);
        }
        rating.Rating = request.Rating;
        rating.Text = text;
        rating.Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        await _context.Entry(rating).Reference(item => item.User).LoadAsync();
        return Ok(MapRating(rating));
    }

    private static MarketplaceRatingDto MapRating(MarketplaceRating rating) => new()
    {
        Id = rating.Id,
        UserId = rating.UserId,
        UserName = $"{rating.User?.FirstName} {rating.User?.LastName}".Trim(),
        Rating = rating.Rating,
        Text = rating.Text,
        Date = rating.Date.ToString("yyyy-MM-dd")
    };

    private async Task<int?> GetCurrentUserIdAsync()
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return null;
        return await _context.Users.AnyAsync(user => user.Id == userId) ? userId : null;
    }
}