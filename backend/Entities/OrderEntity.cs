using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class OrderEntity
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public UserEntity? User { get; set; }

        [Required]
        [MaxLength(150)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string DeliveryMethod { get; set; } = "courier";

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "card";

        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItemEntity> Items { get; set; } = new List<OrderItemEntity>();
    }
}
