using backend.DTOs;
using backend.Data;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogService _catalogService;
    private readonly AppDbContext _context;

    public CatalogController(ICatalogService catalogService, AppDbContext context)
    {
        _catalogService = catalogService;
        _context = context;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        => Ok(await _catalogService.GetCategoriesAsync());

    [HttpGet("sellers")]
    public async Task<ActionResult<List<SellerDto>>> GetSellers()
    {
        var sellers = await _context.Sellers.AsNoTracking().OrderBy(seller => seller.Name).Select(seller => new SellerDto
        {
            Id = seller.Id,
            Name = seller.Name,
            Logo = seller.Logo,
            Rating = seller.Rating,
            Sales = seller.Sales,
            Location = seller.Location,
            Description = seller.Description
        }).ToListAsync();
        return Ok(sellers);
    }

    [HttpGet("ratings")]
    public async Task<ActionResult<List<MarketplaceRatingDto>>> GetMarketplaceRatings()
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

    [HttpGet("products")]
    public async Task<ActionResult<List<ProductDto>>> GetProducts(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? brand,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] double? rating,
        [FromQuery] string? sort)
    {
        var result = await _catalogService.GetProductsAsync(search, category, brand, minPrice, maxPrice, rating, sort);
        return Ok(result);
    }

    [HttpGet("products/{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id)
    {
        var product = await _catalogService.GetProductByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpGet("my-products")]
    [Authorize]
    public async Task<ActionResult<List<ProductDto>>> GetMyProducts()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var products = await _context.Products
            .Include(product => product.Category)
            .Include(product => product.Seller)
            .AsNoTracking()
            .Where(product => product.OwnerUserId == userId)
            .OrderByDescending(product => product.CreatedAt)
            .ToListAsync();

        return Ok(products.Select(CatalogService.MapProduct).ToList());
    }

    [HttpPost("my-products")]
    [Authorize]
    public async Task<ActionResult<ProductDto>> CreateMyProduct([FromBody] ProductRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();
        if (!IsValidProduct(request))
            return BadRequest(new { message = "Product name, brand, category, image, valid price, and stock are required." });

        var categoryExists = await _context.Categories.AnyAsync(category => category.Id == request.Category);
        var sellerId = await _context.Products.Where(product => product.OwnerUserId == userId).Select(product => (int?)product.SellerId).FirstOrDefaultAsync()
            ?? await _context.Sellers.Select(seller => (int?)seller.Id).FirstOrDefaultAsync();
        if (!categoryExists || sellerId == null)
            return BadRequest(new { message = "The selected category or seller is unavailable." });

        var product = new backend.Entities.Product
        {
            OwnerUserId = userId,
            SellerId = sellerId.Value,
            CategoryId = request.Category,
        };
        ApplyProductRequest(product, request);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        await PromoteToSellerAsync(userId.Value);
        return Ok(CatalogService.MapProduct(await _context.Products.Include(item => item.Category).Include(item => item.Seller).AsNoTracking().SingleAsync(item => item.Id == product.Id)));
    }

    [HttpPut("my-products/{id:int}")]
    [Authorize]
    public async Task<ActionResult<ProductDto>> UpdateMyProduct(int id, [FromBody] ProductRequest request)
    {
        var userId = GetCurrentUserId();
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();
        if (!User.IsInRole("Admin") && product.OwnerUserId != userId)
            return Forbid();
        if (!IsValidProduct(request) || !await _context.Categories.AnyAsync(category => category.Id == request.Category))
            return BadRequest(new { message = "Product details or category are invalid." });

        ApplyProductRequest(product, request);
        await _context.SaveChangesAsync();
        var updated = await _context.Products.Include(item => item.Category).Include(item => item.Seller).AsNoTracking().SingleAsync(item => item.Id == id);
        return Ok(CatalogService.MapProduct(updated));
    }

    [HttpDelete("my-products/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteMyProduct(int id)
    {
        var userId = GetCurrentUserId();
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();
        if (!User.IsInRole("Admin") && product.OwnerUserId != userId)
            return Forbid();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("products/{id:int}/reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetReviews(int id)
        => Ok(await _catalogService.GetReviewsByProductIdAsync(id));

    [HttpPost("products/{id:int}/reviews")]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> SaveReview(int id, [FromBody] CreateReviewRequest request)
    {
        if (request.Rating is < 1 or > 5 || string.IsNullOrWhiteSpace(request.Text))
            return BadRequest(new { message = "A rating from 1 to 5 and review text are required." });

        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        var review = await _context.Reviews.SingleOrDefaultAsync(item => item.ProductId == id && item.UserId == userId);
        if (review == null)
        {
            review = new Review { ProductId = id, UserId = userId };
            await _context.Reviews.AddAsync(review);
        }

        review.UserName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Customer";
        review.Rating = request.Rating;
        review.Text = request.Text.Trim();
        review.Date = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var productReviews = await _context.Reviews.Where(item => item.ProductId == id).ToListAsync();
        product.ReviewCount = productReviews.Count;
        product.Rating = productReviews.Average(item => item.Rating);
        await _context.SaveChangesAsync();

        return Ok(new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            User = review.UserName,
            Rating = review.Rating,
            Date = review.Date.ToString("yyyy-MM-dd"),
            Text = review.Text
        });
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProductDto>>> GetFeatured()
        => Ok(await _catalogService.GetFeaturedAsync());

    [HttpGet("newest")]
    public async Task<ActionResult<List<ProductDto>>> GetNewest()
        => Ok(await _catalogService.GetNewestAsync());

    [HttpGet("popular")]
    public async Task<ActionResult<List<ProductDto>>> GetPopular()
        => Ok(await _catalogService.GetPopularAsync());

    private static bool IsValidProduct(ProductRequest request)
        => !string.IsNullOrWhiteSpace(request.Name)
           && !string.IsNullOrWhiteSpace(request.Brand)
           && !string.IsNullOrWhiteSpace(request.Category)
           && !string.IsNullOrWhiteSpace(request.Image)
           && request.Price > 0
           && request.Stock >= 0;

    private static void ApplyProductRequest(backend.Entities.Product product, ProductRequest request)
    {
        product.Name = request.Name.Trim();
        product.Brand = request.Brand.Trim();
        product.CategoryId = request.Category;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.Condition = request.Condition;
        product.Image = request.Image.Trim();
        product.Gallery = JsonSerializer.Serialize(request.Gallery.Length > 0 ? request.Gallery : new[] { request.Image });
        product.Description = request.Description.Trim();
        product.Specs = JsonSerializer.Serialize(request.Specs);
        product.Status = request.Stock > 0 ? request.Status : "out-of-stock";
        product.Tag = request.Tag;
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : null;
    }

    private async Task PromoteToSellerAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null && user.Role == "Customer")
        {
            user.Role = "Seller";
            await _context.SaveChangesAsync();
        }
    }
}
