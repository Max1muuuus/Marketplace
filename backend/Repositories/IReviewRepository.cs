using backend.Entities;

namespace backend.Repositories
{
    public interface IReviewRepository
    {
        Task<List<ReviewEntity>> GetByProductIdAsync(int productId);
        Task AddAsync(ReviewEntity review);
    }

}
