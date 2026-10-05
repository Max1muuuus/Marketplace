using System.Text.Json;
using backend.Data;
using backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Seed;

public static class MarketplaceSeed
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Categories.AnyAsync())
        {
            await EnsureAdminAsync(context);
            return;
        }

        var categories = new[]
        {
            new Category { Id = "phones", Name = "Smartphones", Icon = "📱", Description = "Premium mobile devices", Slug = "smartphones" },
            new Category { Id = "laptops", Name = "Laptops", Icon = "💻", Description = "Powerful productivity machines", Slug = "laptops" },
            new Category { Id = "tablets", Name = "Tablets", Icon = "📲", Description = "Creative and mobile devices", Slug = "tablets" },
            new Category { Id = "pcs", Name = "PCs", Icon = "🖥️", Description = "Desktop systems for work and gaming", Slug = "pcs" },
            new Category { Id = "gpu", Name = "GPUs", Icon = "🎮", Description = "Graphics cards for premium performance", Slug = "video-cards" },
            new Category { Id = "headphones", Name = "Headphones", Icon = "🎧", Description = "High-quality audio gear", Slug = "headphones" },
            new Category { Id = "mice", Name = "Mice", Icon = "🖱️", Description = "Precision control devices", Slug = "mice" },
            new Category { Id = "accessories", Name = "Accessories", Icon = "🔌", Description = "Useful tech add-ons", Slug = "accessories" }
        };

        await context.Categories.AddRangeAsync(categories);

        var sellers = new[]
        {
            new Seller { Name = "TechNest", Logo = "TN", Rating = 4.9, Sales = 3650, Location = "Kyiv", Description = "Premium tech and fast shipping" },
            new Seller { Name = "PixelFlow", Logo = "PF", Rating = 4.8, Sales = 2100, Location = "Lviv", Description = "Modern gadgets for work and life" },
            new Seller { Name = "CoreHub", Logo = "CH", Rating = 4.7, Sales = 1290, Location = "Odesa", Description = "Computer equipment from entry to premium" }
        };

        await context.Sellers.AddRangeAsync(sellers);
        await context.SaveChangesAsync();

        var seller1 = sellers[0];
        var seller2 = sellers[1];
        var seller3 = sellers[2];

        var products = new[]
        {
            new Product{ Name = "Apple iPhone 15 Pro", Brand = "Apple", CategoryId = "phones", SellerId = seller1.Id, Price = 42999, OldPrice = 46999, Rating = 4.9, ReviewCount = 241, Stock = 12, Condition = "New", Image = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80"}), Description = "Premium titanium smartphone", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"memory","256 GB"},{"ram","8 GB"},{"display","6.1\" OLED"},{"camera","48 MP"}}), Status = "in-stock", Tag = "Bestseller" },
            new Product{ Name = "Samsung Galaxy S24 Ultra", Brand = "Samsung", CategoryId = "phones", SellerId = seller2.Id, Price = 38999, OldPrice = 42999, Rating = 4.8, ReviewCount = 188, Stock = 8, Condition = "New", Image = "https://images.unsplash.com/photo-1610792516302-30d7edb6d009?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1610792516302-30d7edb6d009?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80"}), Description = "Flagship smartphone with S Pen", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"memory","512 GB"},{"ram","12 GB"},{"display","6.8\" AMOLED"},{"camera","200 MP"}}), Status = "in-stock", Tag = "Popular" },
            new Product{ Name = "ASUS ROG Zephyrus G14", Brand = "ASUS", CategoryId = "laptops", SellerId = seller3.Id, Price = 51999, OldPrice = 58999, Rating = 4.9, ReviewCount = 145, Stock = 5, Condition = "New", Image = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80"}), Description = "Compact gaming laptop", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"cpu","AMD Ryzen 9"},{"ram","32 GB"},{"ssd","1 TB"},{"gpu","RTX 4060"}}), Status = "in-stock", Tag = "Gaming" },
            new Product{ Name = "Dell XPS 13 Plus", Brand = "Dell", CategoryId = "laptops", SellerId = seller1.Id, Price = 45999, OldPrice = 50999, Rating = 4.7, ReviewCount = 102, Stock = 10, Condition = "New", Image = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80"}), Description = "Elegant ultrabook for daily work", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"cpu","Intel Core i7"},{"ram","16 GB"},{"ssd","512 GB"},{"gpu","Intel Iris Xe"}}), Status = "in-stock", Tag = "Business" },
            new Product{ Name = "Apple iPad Pro 12.9", Brand = "Apple", CategoryId = "tablets", SellerId = seller2.Id, Price = 32999, OldPrice = 36999, Rating = 4.9, ReviewCount = 143, Stock = 9, Condition = "New", Image = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1561154464-82e9dca6f4c7?auto=format&fit=crop&w=900&q=80"}), Description = "Creative tablet for work and media", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"memory","256 GB"},{"ram","8 GB"},{"display","12.9\" Liquid Retina"},{"camera","12 MP"}}), Status = "in-stock", Tag = "Creator" },
            new Product{ Name = "MSI GeForce RTX 4070", Brand = "MSI", CategoryId = "gpu", SellerId = seller3.Id, Price = 31999, OldPrice = 34999, Rating = 4.8, ReviewCount = 87, Stock = 4, Condition = "New", Image = "https://images.unsplash.com/photo-1587202372775-98927bfc1a8f?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1587202372775-98927bfc1a8f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1635795297828-9c37c605d01a?auto=format&fit=crop&w=900&q=80"}), Description = "GPU for 4K gaming", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"memory","12 GB"},{"type","GDDR6X"},{"interface","PCIe 4.0"},{"power","220 W"}}), Status = "limited", Tag = "Hot Deal" },
            new Product{ Name = "Sony WH-1000XM5", Brand = "Sony", CategoryId = "headphones", SellerId = seller2.Id, Price = 12999, OldPrice = 14999, Rating = 4.9, ReviewCount = 319, Stock = 16, Condition = "New", Image = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"}), Description = "Premium noise-canceling headphones", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"type","Bluetooth 5.3"},{"battery","30 hours"},{"noise","ANC"},{"weight","250 g"}}), Status = "in-stock", Tag = "Bestseller" },
            new Product{ Name = "Logitech G502 X Plus", Brand = "Logitech", CategoryId = "mice", SellerId = seller3.Id, Price = 4999, OldPrice = 5999, Rating = 4.8, ReviewCount = 124, Stock = 14, Condition = "New", Image = "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80", Gallery = JsonSerializer.Serialize(new[]{"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80"}), Description = "Gaming mouse for precision", Specs = JsonSerializer.Serialize(new Dictionary<string, object>{{"sensor","Hero 25K"},{"buttons","13"},{"wireless","True"},{"weight","106 g"}}), Status = "in-stock", Tag = "Gaming" }
        };

        await context.Products.AddRangeAsync(products);

        var reviews = new[]
        {
            new Review { Product = products[0], UserName = "Serhii", Rating = 5, Date = DateTime.UtcNow.AddDays(-10), Text = "Excellent quality and quick delivery." },
            new Review { Product = products[1], UserName = "Alina", Rating = 4, Date = DateTime.UtcNow.AddDays(-20), Text = "Very convenient and smooth." },
            new Review { Product = products[3], UserName = "Dmytro", Rating = 5, Date = DateTime.UtcNow.AddDays(-5), Text = "Reliable performance and great service." },
            new Review { Product = products[5], UserName = "Olena", Rating = 5, Date = DateTime.UtcNow.AddDays(-15), Text = "Strong value and premium build quality." }
        };

        await context.Reviews.AddRangeAsync(reviews);
        await context.SaveChangesAsync();

        foreach (var product in products)
        {
            var productReviews = reviews.Where(review => review.ProductId == product.Id).ToList();
            product.ReviewCount = productReviews.Count;
            product.Rating = productReviews.Count == 0 ? 0 : productReviews.Average(review => review.Rating);
        }

        await context.SaveChangesAsync();
        await EnsureAdminAsync(context);
    }

    private static async Task EnsureAdminAsync(AppDbContext context)
    {
        const string adminEmail = "admin@marketplace.test";
        var admin = await context.Users.SingleOrDefaultAsync(user => user.Email == adminEmail);
        var passwordHasher = new PasswordHasher<User>();

        if (admin == null)
        {
            admin = new User { Email = adminEmail };
            await context.Users.AddAsync(admin);
        }

        admin.FirstName = "Admin";
        admin.LastName = "User";
        admin.Role = "Admin";
        admin.PasswordHash = passwordHasher.HashPassword(admin, "Admin123!");
        await context.SaveChangesAsync();
    }
}
