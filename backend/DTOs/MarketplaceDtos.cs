namespace backend.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer";
}

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class SellerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int Sales { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ReviewDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int? UserId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string User { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
}

public class CreateReviewRequest
{
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public int Stock { get; set; }
    public string Condition { get; set; } = string.Empty;
    public int SellerId { get; set; }
    public int? OwnerUserId { get; set; }
    public string Image { get; set; } = string.Empty;
    public string[] Gallery { get; set; } = Array.Empty<string>();
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Specs { get; set; } = new();
    public string Status { get; set; } = string.Empty;
    public string Tag { get; set; } = string.Empty;
    public SellerDto? Seller { get; set; }
}

public class ProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string Condition { get; set; } = "New";
    public string Image { get; set; } = string.Empty;
    public string[] Gallery { get; set; } = Array.Empty<string>();
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, string> Specs { get; set; } = new();
    public string Status { get; set; } = "in-stock";
    public string Tag { get; set; } = string.Empty;
}

public class CartProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int Quantity { get; set; }
}

public class CartItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class ReplaceCartRequest
{
    public List<CartItemRequest> Items { get; set; } = new();
}

public class ReplaceFavoritesRequest
{
    public List<int> ProductIds { get; set; } = new();
}

public class SaveMarketplaceRatingRequest
{
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class MarketplaceRatingDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
}

public class CategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class SellerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AdminUserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class CreateOrderRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Delivery { get; set; } = "courier";
    public string Payment { get; set; } = "card";
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string DeliveryMethod { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int? ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}
