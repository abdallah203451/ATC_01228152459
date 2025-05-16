using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Core.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            IMapper mapper,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _mapper = mapper;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<ApiResponse> RegisterAsync(RegisterDTO model)
        {
            try
            {
                // Check if user exists
                var userExists = await _userManager.FindByEmailAsync(model.Email);
                if (userExists != null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User with this email already exists"
                    };
                }

                // Check if username is taken
                var usernameExists = await _userManager.FindByNameAsync(model.UserName);
                if (usernameExists != null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Username is already taken"
                    };
                }

                // Create new user
                var user = new ApplicationUser
                {
                    Email = model.Email,
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User creation failed",
                        Errors = result.Errors.Select(e => e.Description)
                    };
                }

                // Assign default role
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }

                await _userManager.AddToRoleAsync(user, "User");

                // Send welcome email
                //await _emailService.SendWelcomeEmailAsync(user.Email, $"{user.FirstName} {user.LastName}");

                return new ApiResponse
                {
                    Success = true,
                    Message = "User registered successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error during registration",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> LoginAsync(LoginDTO model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                if (!await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = _tokenService.GenerateAccessToken(authClaims);
                var refreshToken = _tokenService.GenerateRefreshToken();

                // Save refresh token
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
                    Convert.ToDouble(_configuration["JWT:RefreshTokenValidityInDays"]));

                await _userManager.UpdateAsync(user);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new AuthResponseDTO
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Roles = userRoles.ToList(),
                        Token = token,
                        RefreshToken = refreshToken,
                        RefreshTokenExpiryTime = user.RefreshTokenExpiryTime.Value
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error during login",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> RefreshTokenAsync(RefreshTokenDTO model)
        {
            try
            {
                var principal = _tokenService.GetPrincipalFromExpiredToken(model.Token);
                if (principal == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid token"
                    };
                }

                var userName = principal.Identity?.Name;
                var user = await _userManager.FindByNameAsync(userName);
                if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid or expired refresh token"
                    };
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var newToken = _tokenService.GenerateAccessToken(authClaims);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(
                    Convert.ToDouble(_configuration["JWT:RefreshTokenValidityInDays"]));

                await _userManager.UpdateAsync(user);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Token refreshed successfully",
                    Data = new AuthResponseDTO
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Roles = userRoles.ToList(),
                        Token = newToken,
                        RefreshToken = newRefreshToken,
                        RefreshTokenExpiryTime = user.RefreshTokenExpiryTime.Value
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error refreshing token",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> ForgotPasswordAsync(ForgotPasswordDTO model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    // Return success to prevent email enumeration
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "If your email is registered, you will receive a password reset link."
                    };
                }

                var token = await _tokenService.GeneratePasswordResetTokenAsync(user);
                await _emailService.SendPasswordResetEmailAsync(user.Email, token);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Password reset link has been sent to your email"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error processing password reset request",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> ResetPasswordAsync(ResetPasswordDTO model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
                if (!result.Succeeded)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Error resetting password",
                        Errors = result.Errors.Select(e => e.Description)
                    };
                }

                // Invalidate any existing refresh tokens
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userManager.UpdateAsync(user);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Password has been reset successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error resetting password",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetCurrentUserAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                var userDto = _mapper.Map<UserDTO>(user);
                var roles = await _userManager.GetRolesAsync(user);
                userDto.Roles = roles.ToList();

                return new ApiResponse
                {
                    Success = true,
                    Message = "User retrieved successfully",
                    Data = userDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving user information",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> LogoutAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Invalidate refresh token
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userManager.UpdateAsync(user);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Logout successful"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error during logout",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
} 