using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // ================= REGISTER ====================
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto model)
        {
            var validRoles = new[] { "Admin", "BranchManager", "Customer", "Barber" };
            if (!validRoles.Contains(model.Role))
                return new AuthResponseDto { Message = "Invalid Role!" };

            var currentUser = _httpContextAccessor.HttpContext?.User;

            if (model.Role == "Admin")
            {
                if (currentUser == null || !currentUser.IsInRole("Admin"))
                    return new AuthResponseDto { Message = "Only Admin can create another Admin." };
            }

            if (model.Role == "BranchManager")
            {
                if (currentUser == null || !currentUser.IsInRole("Admin"))
                    return new AuthResponseDto { Message = "Only Admin can create Branch Managers" };
            }

            if (model.Role == "Barber")
            {
                if (currentUser == null || !currentUser.IsInRole("BranchManager"))
                    return new AuthResponseDto { Message = "Only Branch Manager can create barbers." };

                var managerBranchId = currentUser.FindFirst("BranchId")?.Value;
                if (managerBranchId == null)
                    return new AuthResponseDto { Message = "Branch Manager has no branch assigned." };

                if (model.BranchId.ToString() != managerBranchId)
                    return new AuthResponseDto { Message = "You cannot create barbers for another branch." };
            }

            var exists = await _userManager.FindByEmailAsync(model.Email);
            if (exists != null)
                return new AuthResponseDto { Message = "User already exists!" };

            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                BranchId = model.BranchId
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return new AuthResponseDto
                {
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            await _userManager.AddToRoleAsync(user, model.Role);

            // Generate tokens and save refresh token + expiry
            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles);
            var refresh = GenerateRefreshToken();

            user.RefreshToken = refresh;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Token = token,
                RefreshToken = refresh,
                RefreshTokenExpiration = user.RefreshTokenExpiryTime,
                UserId = user.Id,
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                ManagedBranchId = user.BranchId,
                Message = "User created and logged in successfully"
            };
        }

        // ================= LOGIN ====================
        public async Task<AuthResponseDto> LoginAsync(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return new AuthResponseDto { Message = "Invalid email or password" };

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateJwtToken(user, roles);
            var refresh = GenerateRefreshToken();

            user.RefreshToken = refresh;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Token = token,
                RefreshToken = refresh,
                UserId = user.Id,
                RefreshTokenExpiration = user.RefreshTokenExpiryTime.Value,
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                ManagedBranchId = user.BranchId,
                Message = "Success"
            };
        }

        // ================= REFRESH TOKEN ====================
        public async Task<AuthResponseDto> RefreshTokenAsync(TokenRequestDto model)
        {
            var principal = GetPrincipalFromExpiredToken(model.Token);
            if (principal == null)
                return new AuthResponseDto { Message = "Invalid token" };

            var email = principal.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return new AuthResponseDto { Message = "Invalid token" };

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null ||
                user.RefreshToken != model.RefreshToken ||
                user.RefreshTokenExpiryTime == null ||
                user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return new AuthResponseDto { Message = "Invalid refresh token" };
            }

            var roles = await _userManager.GetRolesAsync(user);

            var newJwt = GenerateJwtToken(user, roles);
            var newRefresh = GenerateRefreshToken();

            // update refresh token + expiry
            user.RefreshToken = newRefresh;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Token = newJwt,
                RefreshToken = newRefresh,
                RefreshTokenExpiration = user.RefreshTokenExpiryTime.Value,
                UserId = user.Id,
                Email = user.Email!,
                FullName = $"{user.FirstName} {user.LastName}",
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                ManagedBranchId = user.BranchId,
                Message = "Success"
            };
        }

        // ================= LOGOUT ====================
        public async Task<AuthResponseDto> LogoutAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return new AuthResponseDto { Message = "User not found" };

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                IsAuthenticated = false,
                Message = "Logged out successfully"
            };
        }

        // ================= CHANGE PASSWORD ====================
        public async Task<AuthResponseDto> ChangePasswordAsync(ChangePasswordDto model)
        {
            var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext!.User);
            if (user == null)
                return new AuthResponseDto { Message = "User not found" };

            var result = await _userManager.ChangePasswordAsync(
                user,
                model.CurrentPassword,
                model.NewPassword
            );

            if (!result.Succeeded)
                return new AuthResponseDto
                {
                    Message = string.Join(" | ", result.Errors.Select(e => e.Description))
                };

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Message = "Password changed successfully"
            };
        }

        // ================ CHANGE PASSWORD FOR USER (admin or owner) ================
        public async Task<AuthResponseDto> ChangePasswordForUserAsync(string userId, ChangePasswordDto model)
        {
            var target = await _userManager.FindByIdAsync(userId);
            if (target == null) return new AuthResponseDto { Message = "User not found" };

            var httpUser = _httpContextAccessor.HttpContext?.User;
            var callerId = httpUser?.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = httpUser?.IsInRole("Admin") == true;

            if (!isAdmin && callerId != userId)
                return new AuthResponseDto { Message = "Forbidden" };

            if (!isAdmin)
            {
                var change = await _userManager.ChangePasswordAsync(target, model.CurrentPassword, model.NewPassword);
                if (!change.Succeeded)
                    return new AuthResponseDto { Message = string.Join(" | ", change.Errors.Select(e => e.Description)) };

                return new AuthResponseDto { IsAuthenticated = true, Message = "Password changed successfully" };
            }
            else
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(target);
                var reset = await _userManager.ResetPasswordAsync(target, token, model.NewPassword);
                if (!reset.Succeeded)
                    return new AuthResponseDto { Message = string.Join(" | ", reset.Errors.Select(e => e.Description)) };

                return new AuthResponseDto { IsAuthenticated = true, Message = "Password reset by admin" };
            }
        }

        // ================= UPDATE USER PROFILE ====================
        public async Task<AuthResponseDto> UpdateUserAsync(string userId, UpdateUserDto model)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return new AuthResponseDto { Message = "User not found" };

            var httpUser = _httpContextAccessor.HttpContext?.User;
            var callerId = httpUser?.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = httpUser?.IsInRole("Admin") == true;

            if (!isAdmin && callerId != userId)
                return new AuthResponseDto { Message = "Forbidden" };

            if (!string.IsNullOrWhiteSpace(model.FirstName)) user.FirstName = model.FirstName;
            if (!string.IsNullOrWhiteSpace(model.LastName)) user.LastName = model.LastName;

            if (!string.IsNullOrWhiteSpace(model.PhoneNumber))
            {
                var phoneRes = await _userManager.SetPhoneNumberAsync(user, model.PhoneNumber);
                if (!phoneRes.Succeeded)
                    return new AuthResponseDto { Message = string.Join(" | ", phoneRes.Errors.Select(e => e.Description)) };
            }

            if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
            {
                var emailRes = await _userManager.SetEmailAsync(user, model.Email);
                if (!emailRes.Succeeded)
                    return new AuthResponseDto { Message = string.Join(" | ", emailRes.Errors.Select(e => e.Description)) };

                user.UserName = model.Email;
            }

            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponseDto
            {
                IsAuthenticated = true,
                Message = "User updated",
                UserId = user.Id,
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                Roles = roles.ToList(),
                ManagedBranchId = user.BranchId
            };
        }

        // ================= DELETE / ANONYMIZE USER ====================
        public async Task<AuthResponseDto> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return new AuthResponseDto { Message = "User not found" };

            var httpUser = _httpContextAccessor.HttpContext?.User;
            var callerId = httpUser?.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = httpUser?.IsInRole("Admin") == true;

            if (!isAdmin && callerId != userId)
                return new AuthResponseDto { Message = "Forbidden" };

            // Anonymize instead of hard delete to preserve relations
            user.Email = $"deleted+{Guid.NewGuid():N}@local.invalid";
            user.UserName = user.Email;
            user.FirstName = string.Empty;
            user.LastName = string.Empty;
            user.PhoneNumber = null;
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            user.LockoutEnabled = true;
            user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);

            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Any()) await _userManager.RemoveFromRolesAsync(user, roles);

            return new AuthResponseDto { IsAuthenticated = false, Message = "Account deleted (anonymized)" };
        }

        // ================= VALIDATE TOKEN ====================
        public async Task<AuthResponseDto> ValidateTokenAsync(string token)
        {
            try
            {
                var principal = GetPrincipalFromExpiredToken(token);
                if (principal == null)
                    return new AuthResponseDto { Message = "Invalid token" };

                return new AuthResponseDto
                {
                    IsAuthenticated = true,
                    Message = "Valid token"
                };
            }
            catch
            {
                return new AuthResponseDto { Message = "Invalid token" };
            }
        }

        // ================= HELPERS ====================
        private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            var jwt = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName)
            };

            if (user.BranchId != null)
                claims.Add(new Claim("BranchId", user.BranchId.ToString()));

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256);

            // Use same keys as token validation (ValidIssuer/ValidAudience with fallback)
            var issuer = jwt["ValidIssuer"] ?? jwt["Issuer"];
            var audience = jwt["ValidAudience"] ?? jwt["Audience"];

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddMinutes(30),
                claims: claims,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var random = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(random);
            return Convert.ToBase64String(random);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var jwt = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

            var parameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            return new JwtSecurityTokenHandler()
                .ValidateToken(token, parameters, out _);
        }
    }
}
