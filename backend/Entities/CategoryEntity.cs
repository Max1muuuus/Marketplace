using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class CategoryEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Icon { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
    }
}
