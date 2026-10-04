namespace backend.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string User { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }
}
