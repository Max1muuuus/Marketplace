namespace backend.Entities
{
    public class CartItemEntity
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public UserEntity? User { get; set; }

        public int ProductId { get; set; }
        public ProductEntity? Product { get; set; }

        public int Quantity { get; set; }
    }
}
