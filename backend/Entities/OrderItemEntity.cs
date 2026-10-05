using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public class OrderItemEntity
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public OrderEntity? Order { get; set; }

        public int ProductId { get; set; }
        public ProductEntity? Product { get; set; }

        [Required]
        [MaxLength(200)]
        public string ProductName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string ProductImage { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
