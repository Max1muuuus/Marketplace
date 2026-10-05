using backend.Data;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewEntity>> GetByProductIdAsync(int productId)
        => await _context.Reviews
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.Date)
            .ToListAsync();

    public async Task AddAsync(ReviewEntity review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
