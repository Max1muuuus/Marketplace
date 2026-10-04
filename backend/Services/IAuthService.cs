using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthDto?> RegisterAsync(RegisterDto request);
        Task<AuthDto?> LoginAsync(LoginDto request);
        Task<UserDto?> GetUserAsync(string email);
    }
}
