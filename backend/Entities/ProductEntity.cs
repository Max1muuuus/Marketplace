using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class ProductEntity
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public int CategoryId { get; set; }
        public CategoryEntity? Category { get; set; }

        public int SellerId { get; set; }
        public SellerEntity? Seller { get; set; }

        public decimal Price { get; set; }
        public decimal? OldPrice { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public int Stock { get; set; }

        [MaxLength(50)]
        public string Condition { get; set; } = "New";

        [MaxLength(500)]
        public string Image { get; set; } = string.Empty;

        public string Gallery { get; set; } = "[]";

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public string Specs { get; set; } = "{}";   

        [MaxLength(50)]
        public string Status { get; set; } = "in-stock";

        [MaxLength(50)]
        public string Tag { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ReviewEntity> Reviews { get; set; } = new List<ReviewEntity>();
        public ICollection<FavoriteEntity> Favorites { get; set; } = new List<FavoriteEntity>();
    }
}
