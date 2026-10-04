using backend.Entities;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<UserEntity?> GetUserAsync(string email);
        Task<UserEntity?> GetUserAsync(int id);
        Task AddAsync(UserEntity user);
        Task<bool> IsUserExistsAsync(string email);
        Task<bool> IsUserExistsAsync(int id);
    }
}
