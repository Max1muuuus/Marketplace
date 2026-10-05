using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellersController : ControllerBase
    {
        private readonly ISellerService _sellerService;

        public SellersController(ISellerService sellerService)
        {
            _sellerService = sellerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SellerDto>>> GetSellers()
        {
            var sellers = await _sellerService.GetAllSellersAsync();
            return Ok(sellers);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SellerDto>> GetSellerById(int id)
        {
            var seller = await _sellerService.GetSellerByIdAsync(id);
            if (seller == null)
            {
                return NotFound(new { message = $"Seller with ID {id} not found" });
            }

            return Ok(seller);
        }

        [HttpPost]
        public async Task<ActionResult<SellerDto>> CreateSeller([FromBody] SellerDto sellerDto)
        {
            var created = await _sellerService.CreateSellerAsync(sellerDto);
            return CreatedAtAction(nameof(GetSellerById), new { id = created.Id }, created);
        }
    }
}