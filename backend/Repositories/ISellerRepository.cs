using backend.Entities;

namespace backend.Repositories
{
    public interface ISellerRepository
    {
        Task<IEnumerable<SellerEntity>> GetAllAsync();
        Task<SellerEntity?> GetByIdAsync(int id);
        Task AddAsync(SellerEntity seller);
        Task UpdateAsync(SellerEntity seller);
        Task DeleteAsync(int id);
    }
}
