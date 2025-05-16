using Application.DTOs;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse> RegisterAsync(RegisterDTO model);
        Task<ApiResponse> LoginAsync(LoginDTO model);
        Task<ApiResponse> RefreshTokenAsync(RefreshTokenDTO model);
        Task<ApiResponse> ForgotPasswordAsync(ForgotPasswordDTO model);
        Task<ApiResponse> ResetPasswordAsync(ResetPasswordDTO model);
        Task<ApiResponse> GetCurrentUserAsync(string userId);
        Task<ApiResponse> LogoutAsync(string userId);
    }
} 