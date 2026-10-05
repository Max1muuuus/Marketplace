namespace backend.DTOs
{
    public class UpdateCartItemQuantityDto
    {
        public int ProductId { get; set; }
        public int Delta { get; set; }
    }
}
