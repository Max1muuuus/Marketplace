using backend.DTOs;

namespace backend.Services
{
    public interface ISellerService
    {
        Task<IEnumerable<SellerDto>> GetAllSellersAsync();
        Task<SellerDto?> GetSellerByIdAsync(int id);
        Task<SellerDto> CreateSellerAsync(SellerDto sellerDto);
    }
}
