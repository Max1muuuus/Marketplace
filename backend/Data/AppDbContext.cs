//using backend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> db) : base(db) { }

        //public DbSet<UserEntity> Users { get; set; }
    }
}
