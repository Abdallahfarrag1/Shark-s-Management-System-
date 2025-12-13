using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto model);
        Task<AuthResponseDto> LoginAsync(LoginDto model);
        Task<AuthResponseDto> RefreshTokenAsync(TokenRequestDto model);
        Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordDto model);
        Task<AuthResponseDto> ChangePasswordForUserAsync(string userId, ChangePasswordDto model);

        Task<AuthResponseDto> LogoutAsync(string email);
        Task<AuthResponseDto> ValidateTokenAsync(string token);
        Task<AuthResponseDto> UpdateUserAsync(string userId, UpdateUserDto model);
        Task<AuthResponseDto> DeleteUserAsync(string userId);
    }
}