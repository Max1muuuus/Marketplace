using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Seller> Sellers => Set<Seller>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<MarketplaceRating> MarketplaceRatings => Set<MarketplaceRating>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<FavoriteEntity>()
                .HasIndex(f => new { f.UserId, f.ProductId })
                .IsUnique();

        modelBuilder.Entity<FavoriteEntity>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FavoriteEntity>()
            .HasOne(f => f.Product)
            .WithMany(p => p.Favorites)
            .HasForeignKey(f => f.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Email).HasMaxLength(255);
            entity.Property(x => x.FirstName).HasMaxLength(100);
            entity.Property(x => x.LastName).HasMaxLength(100);
            entity.Property(x => x.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<CategoryEntity>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(100);
            entity.Property(x => x.Name).HasMaxLength(150);
            entity.Property(x => x.Slug).HasMaxLength(100);
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<SellerEntity>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(150);
            entity.Property(x => x.Location).HasMaxLength(150);
            entity.Property(x => x.Logo).HasMaxLength(50);
        });

        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.Property(x => x.Price).HasPrecision(18, 2);
            entity.Property(x => x.OldPrice).HasPrecision(18, 2);
            entity.Property(x => x.Name).HasMaxLength(200);
            entity.Property(x => x.Brand).HasMaxLength(100);
            entity.Property(x => x.Condition).HasMaxLength(50);
            entity.Property(x => x.Tag).HasMaxLength(50);
            entity.Property(x => x.Status).HasMaxLength(50);
            entity.Property(x => x.Image).HasMaxLength(500);
            entity.Property(x => x.Description).HasMaxLength(1000);

            entity.HasOne(x => x.Category)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Seller)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.OwnerUser)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.OwnerUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ReviewEntity>(entity =>
        {
            entity.HasOne(x => x.Product)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.User)
                .WithMany(x => x.Reviews)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.Property(x => x.TotalAmount).HasPrecision(18, 2);
            entity.Property(x => x.CustomerName).HasMaxLength(150);
            entity.Property(x => x.Email).HasMaxLength(255);
            entity.Property(x => x.Phone).HasMaxLength(50);
            entity.Property(x => x.City).HasMaxLength(150);
            entity.Property(x => x.Address).HasMaxLength(255);
            entity.Property(x => x.DeliveryMethod).HasMaxLength(50);
            entity.Property(x => x.PaymentMethod).HasMaxLength(50);
            entity.Property(x => x.Status).HasMaxLength(50);

            entity.HasOne(x => x.User)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<OrderItemEntity>(entity =>
        {
            entity.Property(x => x.Price).HasPrecision(18, 2);
            entity.Property(x => x.ProductName).HasMaxLength(200);
            entity.Property(x => x.ProductImage).HasMaxLength(500);

            entity.HasOne(x => x.Order)
                .WithMany(x => x.Items)
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(x => new { x.UserId, x.ProductId });
            entity.HasOne(x => x.User).WithMany(x => x.CartItems).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(x => new { x.UserId, x.ProductId });
            entity.HasOne(x => x.User).WithMany(x => x.Favorites).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MarketplaceRating>(entity =>
        {
            entity.HasIndex(x => x.UserId).IsUnique();
            entity.Property(x => x.Text).HasMaxLength(500);
            entity.HasOne(x => x.User).WithMany(x => x.MarketplaceRatings).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
