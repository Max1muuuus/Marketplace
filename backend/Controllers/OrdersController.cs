using backend.DTOs;
using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly AppDbContext _context;

    public OrdersController(IOrderService orderService, AppDbContext context)
    {
        _orderService = orderService;
        _context = context;
    }

    [HttpGet("getorders")]
    [Authorize]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        int? userId = ClaimsPrincipalExtensions.GetUserId(User);

        if (!User.IsInRole("Admin") && userIdClaim != null && int.TryParse(userIdClaim.Value, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        return Ok(await _orderService.GetOrdersAsync(userId));
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        int? userId = null;

        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var parsedUserId)
            && await _context.Users.AnyAsync(user => user.Id == parsedUserId))
        {
        int? userId = ClaimsPrincipalExtensions.GetUserId(User);

        var result = await _orderService.CreateOrderAsync(userId, request);
        if (result == null)
            return BadRequest(new { message = "Your cart contains unavailable products or quantities above current stock. Refresh your cart and try again." });

        return Ok(result);
    }
}
