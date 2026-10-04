using backend.DTOs;
using backend.Entities;

namespace backend.Mappers
{
    public static class ProductMappingExtensions
    {
        public static ProductDto ToDto(this ProductEntity entity)
        {
            return new ProductDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Brand = entity.Brand,
                Price = entity.Price,
                OldPrice = entity.OldPrice,
                Rating = entity.Rating,
                ReviewCount = entity.ReviewCount,
                Stock = entity.Stock,
                Condition = entity.Condition,
                Image = entity.Image,
                Status = entity.Status,
                Tag = entity.Tag,


                CategorySlug = entity.Category?.Slug ?? string.Empty,
                CategoryName = entity.Category?.Name ?? string.Empty,

                SellerId = entity.SellerId,
                SellerName = entity.Seller?.Name ?? string.Empty
            };
        }
    }
}
