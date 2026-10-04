using backend.DTOs;
using backend.Entities;
using backend.Repositories;

namespace backend.Services
{
    public class SellerService : ISellerService
    {
        private readonly ISellerRepository _sellerRepository;

        public SellerService(ISellerRepository sellerRepository)
        {
            _sellerRepository = sellerRepository;
        }

        public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
        {
            var sellers = await _sellerRepository.GetAllAsync();
            return sellers.Select(s => MapToDto(s));
        }

        public async Task<SellerDto?> GetSellerByIdAsync(int id)
        {
            var seller = await _sellerRepository.GetByIdAsync(id);
            return seller == null ? null : MapToDto(seller);
        }

        public async Task<SellerDto> CreateSellerAsync(SellerDto sellerDto)
        {
            var entity = new SellerEntity
            {
                Name = sellerDto.Name,
                Logo = sellerDto.Logo,
                Rating = sellerDto.Rating,
                Sales = sellerDto.Sales,
                Location = sellerDto.Location,
                Description = sellerDto.Description
            };

            await _sellerRepository.AddAsync(entity);
            sellerDto.Id = entity.Id;
            return sellerDto;
        }

        private static SellerDto MapToDto(SellerEntity entity) => new()
        {
            Id = entity.Id,
            Name = entity.Name,
            Logo = entity.Logo,
            Rating = entity.Rating,
            Sales = entity.Sales,
            Location = entity.Location,
            Description = entity.Description
        };
    }
}
