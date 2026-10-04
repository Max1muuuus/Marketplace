using backend.DTOs;
using backend.Extensions;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("getorders")]
    [Authorize]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        int? userId = ClaimsPrincipalExtensions.GetUserId(User);

        return Ok(await _orderService.GetOrdersAsync(userId));
    }

    [HttpPost("postorders")]
    [Authorize]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto request)
    {
        int? userId = ClaimsPrincipalExtensions.GetUserId(User);

        var result = await _orderService.CreateOrderAsync(userId, request);
        if (result == null)
            return BadRequest(new { message = "Order cannot be created without valid products." });

        return Ok(result);
    }
}
