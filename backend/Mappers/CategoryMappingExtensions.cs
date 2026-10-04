using backend.DTOs;
using backend.Entities;

namespace backend.Mappers
{
    public static class CategoryMappingExtensions
    {
        public static CategoryDto ToDto(this CategoryEntity category)
        {
            return new CategoryDto
            {
                Name = category.Name,
                Icon = category.Icon,
                Description = category.Description,
                Slug = category.Slug
            };
        }
    }
}
