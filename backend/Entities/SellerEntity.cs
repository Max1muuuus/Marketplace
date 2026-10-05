using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class SellerEntity
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Logo { get; set; } = string.Empty;

        public double Rating { get; set; }
        public int Sales { get; set; }

        [MaxLength(150)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
    }
}
