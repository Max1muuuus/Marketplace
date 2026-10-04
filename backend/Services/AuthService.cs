using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;


public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration, AppDbContext context)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthDto?> RegisterAsync(RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
            return null;

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var email = request.Email.Trim();
        if (await _userRepository.IsUserExistsAsync(email))
            return null;

        var user = new UserEntity
        {
            Email = email,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Role = "Customer",
            PasswordHash = string.Empty
        };

        var passwordHasher = new PasswordHasher<UserEntity>();
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        await _userRepository.AddAsync(user);

        return CreateAuthResponse(user);
    }

    public async Task<UserDto?> GetUserAsync(string email)
    {
        var ue = await _userRepository.GetUserAsync(email);
        if (ue == null) return null;

        return new UserDto()
        {
            Email = ue.Email,
            FirstName = ue.FirstName,
            LastName = ue.LastName,
            Role = ue.Role
        };
    }



    public async Task<AuthDto?> LoginAsync(LoginDto request)
    {
        var email = request.Email.Trim();
        UserEntity user = await _userRepository.GetUserAsync(email);
        if (user == null) return null;
        if (!await _userRepository.IsUserExistsAsync(email))
            return null;



        var passwordHasher = new PasswordHasher<UserEntity>();
        var verification = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (verification == PasswordVerificationResult.Failed)
            return null;

        return CreateAuthResponse(user);
    }

    private AuthDto CreateAuthResponse(UserEntity user)
    {
        var token = GenerateJwtToken(user);
        return new AuthDto
        {
            Token = token,
            User = new UserDto
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role
            }
        };
    }

    private string GenerateJwtToken(UserEntity user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "marketplace-secret-key-should-be-changed"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
