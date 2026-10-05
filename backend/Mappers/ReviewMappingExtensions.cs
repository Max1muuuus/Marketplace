using backend.DTOs;
using backend.Entities;

namespace backend.Mappers
{
    public static class ReviewMappingExtensions
    {
        public static ReviewDto ToDto(this ReviewEntity r)
        {
            return new ReviewDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                User = r.UserName,
                Rating = r.Rating,
                Date = r.Date.ToString("yyyy-MM-dd"),
                Text = r.Text
            };
        }
    }
}
