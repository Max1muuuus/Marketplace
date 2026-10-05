namespace backend.DTOs
{
    public class GetProductsDto
    {
        public string? search { get; set; } = null;
        public string? category { get; set; } = null;
        public string? brand { get; set; } = null;
        public decimal? minPrice { get; set; } = null;
        public decimal? maxPrice { get; set; } = null;
        public double? rating { get; set; } = null;
        public string? sortBy { get; set; } = "createdat";
        public string? sortOrder { get; set; } = "desc";
    }
}
