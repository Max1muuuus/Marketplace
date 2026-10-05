namespace backend.DTOs
{
    public class ProductDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string Brand { get; init; } = string.Empty;
        public string CategorySlug { get; init; } = string.Empty;
        public string CategoryName { get; init; } = string.Empty;
        public int SellerId { get; init; }
        public string SellerName { get; init; } = string.Empty;

        public decimal Price { get; init; }
        public decimal? OldPrice { get; init; }
        public double Rating { get; init; }
        public int ReviewCount { get; init; }
        public int Stock { get; init; }

        public string Condition { get; init; } = string.Empty;
        public string Image { get; init; } = string.Empty;
        public string Status { get; init; } = string.Empty;
        public string Tag { get; init; } = string.Empty;
    }
}
