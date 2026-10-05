using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class ReviewEntity
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public ProductEntity? Product { get; set; }

        public int? UserId { get; set; }
        public UserEntity? User { get; set; }

        [Required]
        [MaxLength(150)]
        public string UserName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [MaxLength(1000)]
        public string Text { get; set; } = string.Empty;
    }
}

