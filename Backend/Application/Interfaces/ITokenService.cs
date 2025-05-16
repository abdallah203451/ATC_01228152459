using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(IEnumerable<Claim> claims);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
        Task<string> GenerateEmailConfirmationTokenAsync(ApplicationUser user);
        Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user);
    }
} 