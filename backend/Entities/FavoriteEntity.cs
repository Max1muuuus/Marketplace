using System.ComponentModel.DataAnnotations;
        
namespace backend.Entities
{
    public class FavoriteEntity
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        public int ProductId { get; set; }
        public ProductEntity Product { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
