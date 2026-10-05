using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserDto>>> GetUsers()
    {
        var users = await _context.Users.AsNoTracking().OrderBy(user => user.Id).Select(user => new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = (user.FirstName + " " + user.LastName).Trim(),
            Role = user.Role
        }).ToListAsync();
        return Ok(users);
    }

    [HttpGet("reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetReviews()
    {
        var reviews = await _context.Reviews.AsNoTracking().Include(review => review.Product).OrderByDescending(review => review.Date)
            .Select(review => new ReviewDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                UserId = review.UserId,
                ProductName = review.Product!.Name,
                User = review.UserName,
                Rating = review.Rating,
                Date = review.Date.ToString("yyyy-MM-dd"),
                Text = review.Text
            }).ToListAsync();
        return Ok(reviews);
    }

    [HttpDelete("reviews/{id:int}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();
        var productId = review.ProductId;
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        await RecalculateProductRatingAsync(productId);
        return NoContent();
    }

    [HttpGet("ratings")]
    public async Task<ActionResult<List<MarketplaceRatingDto>>> GetRatings()
    {
        var ratings = await _context.MarketplaceRatings.Include(rating => rating.User).AsNoTracking()
            .OrderByDescending(rating => rating.Date).Select(rating => new MarketplaceRatingDto
            {
                Id = rating.Id,
                UserId = rating.UserId,
                UserName = $"{rating.User!.FirstName} {rating.User.LastName}".Trim(),
                Rating = rating.Rating,
                Text = rating.Text,
                Date = rating.Date.ToString("yyyy-MM-dd")
            }).ToListAsync();
        return Ok(ratings);
    }

    [HttpDelete("ratings/{id:int}")]
    public async Task<IActionResult> DeleteRating(int id)
    {
        var rating = await _context.MarketplaceRatings.FindAsync(id);
        if (rating == null)
            return NotFound();
        _context.MarketplaceRatings.Remove(rating);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CategoryRequest request)
    {
        var slug = request.Slug.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(slug))
            return BadRequest(new { message = "Category name and slug are required." });
        if (await _context.Categories.AnyAsync(category => category.Slug == slug))
            return Conflict(new { message = "That category slug is already in use." });

        var category = new Category { Id = slug, Name = request.Name.Trim(), Slug = slug, Icon = request.Icon, Description = request.Description };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(new CategoryDto { Id = category.Id, Name = category.Name, Slug = category.Slug, Icon = category.Icon, Description = category.Description });
    }

    [HttpPut("categories/{id}")]
    public async Task<IActionResult> UpdateCategory(string id, [FromBody] CategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();
        var slug = request.Slug.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(slug))
            return BadRequest(new { message = "Category name and slug are required." });
        if (await _context.Categories.AnyAsync(item => item.Slug == slug && item.Id != id))
            return Conflict(new { message = "That category slug is already in use." });
        category.Name = request.Name.Trim();
        category.Slug = slug;
        category.Icon = request.Icon;
        category.Description = request.Description;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("categories/{id}")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();
        if (await _context.Products.AnyAsync(product => product.CategoryId == id))
            return Conflict(new { message = "Categories with products cannot be deleted." });
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("sellers")]
    public async Task<ActionResult<SellerDto>> CreateSeller([FromBody] SellerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Seller name is required." });
        var seller = new Seller
        {
            Name = request.Name.Trim(),
            Logo = string.IsNullOrWhiteSpace(request.Logo) ? request.Name.Trim()[..Math.Min(2, request.Name.Trim().Length)].ToUpperInvariant() : request.Logo,
            Location = request.Location.Trim(),
            Description = request.Description.Trim()
        };
        _context.Sellers.Add(seller);
        await _context.SaveChangesAsync();
        return Ok(new SellerDto { Id = seller.Id, Name = seller.Name, Logo = seller.Logo, Location = seller.Location, Description = seller.Description, Rating = seller.Rating, Sales = seller.Sales });
    }

    [HttpPut("sellers/{id:int}")]
    public async Task<IActionResult> UpdateSeller(int id, [FromBody] SellerRequest request)
    {
        var seller = await _context.Sellers.FindAsync(id);
        if (seller == null)
            return NotFound();
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "Seller name is required." });
        seller.Name = request.Name.Trim();
        seller.Logo = request.Logo;
        seller.Location = request.Location.Trim();
        seller.Description = request.Description.Trim();
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("sellers/{id:int}")]
    public async Task<IActionResult> DeleteSeller(int id)
    {
        var seller = await _context.Sellers.FindAsync(id);
        if (seller == null)
            return NotFound();
        if (await _context.Products.AnyAsync(product => product.SellerId == id))
            return Conflict(new { message = "Sellers with products cannot be deleted." });
        _context.Sellers.Remove(seller);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentUserIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (currentUserIdClaim != null && int.TryParse(currentUserIdClaim.Value, out var currentUserId) && currentUserId == id)
            return BadRequest(new { message = "You cannot delete the currently signed-in administrator." });

        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        if (user.Role == "Admin")
            return BadRequest(new { message = "Administrator accounts cannot be deleted here." });

        var userOrders = await _context.Orders.Where(order => order.UserId == id).ToListAsync();
        foreach (var order in userOrders.Where(order => !IsFinishedOrder(order.Status)))
            order.Status = "Cancelled";

        var ownedProductIds = await _context.Products.Where(product => product.OwnerUserId == id).Select(product => product.Id).ToListAsync();
        var reviews = await _context.Reviews.Where(review => review.UserId == id || ownedProductIds.Contains(review.ProductId)).ToListAsync();
        var cartItems = await _context.CartItems.Where(item => item.UserId == id || ownedProductIds.Contains(item.ProductId)).ToListAsync();
        var favorites = await _context.Favorites.Where(item => item.UserId == id || ownedProductIds.Contains(item.ProductId)).ToListAsync();
        var ratings = await _context.MarketplaceRatings.Where(rating => rating.UserId == id).ToListAsync();

        _context.Reviews.RemoveRange(reviews);
        _context.CartItems.RemoveRange(cartItems);
        _context.Favorites.RemoveRange(favorites);
        _context.MarketplaceRatings.RemoveRange(ratings);
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        foreach (var productId in reviews.Select(review => review.ProductId).Except(ownedProductIds).Distinct())
            await RecalculateProductRatingAsync(productId);
        return NoContent();
    }

    private static bool IsFinishedOrder(string status)
        => status.Equals("Delivered", StringComparison.OrdinalIgnoreCase)
           || status.Equals("Completed", StringComparison.OrdinalIgnoreCase)
           || status.Equals("Canceled", StringComparison.OrdinalIgnoreCase)
           || status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase)
           || status.Equals("Доставлено", StringComparison.OrdinalIgnoreCase)
           || status.Equals("Скасовано", StringComparison.OrdinalIgnoreCase);

    private async Task RecalculateProductRatingAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
            return;
        var ratings = await _context.Reviews.Where(review => review.ProductId == productId).Select(review => review.Rating).ToListAsync();
        product.ReviewCount = ratings.Count;
        product.Rating = ratings.Count == 0 ? 0 : ratings.Average();
        await _context.SaveChangesAsync();
    }
}