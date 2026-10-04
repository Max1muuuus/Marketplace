using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public CatalogController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        => Ok(await _catalogService.GetCategoriesAsync());

    [HttpGet("products")]
    public async Task<ActionResult<List<ProductDto>>> GetProducts([FromQuery] GetProductsDto request)
    {
        var result = await _catalogService.GetProductsAsync(request);
        return Ok(result);
    }

    [HttpGet("products/{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id)
    {
        var product = await _catalogService.GetProductByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpGet("products/{id:int}/reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetReviews(int id)
        => Ok(await _catalogService.GetReviewsByProductIdAsync(id));

    [HttpGet("featured/{n:int}")]
    public async Task<ActionResult<List<ProductDto>>> GetFeatured(int n)
        => Ok(await _catalogService.GetFeaturedAsync(n));

    [HttpGet("popular")]
    public async Task<ActionResult<List<ProductDto>>> GetPopular()
        => Ok(await _catalogService.GetPopularAsync());
}
