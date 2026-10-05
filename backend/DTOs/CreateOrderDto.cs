namespace backend.DTOs
{
    public class CreateOrderDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Delivery { get; set; } = "courier";
        public string Payment { get; set; } = "card";
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}
