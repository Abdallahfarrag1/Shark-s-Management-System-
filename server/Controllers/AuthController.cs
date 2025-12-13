using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        // ===============================
        // REGISTER
        // ===============================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var result = await _authService.RegisterAsync(model);
            if (!result.IsAuthenticated)
                return BadRequest(result.Message);
            return Ok(result);
        }

        // ===============================
        // LOGIN
        // ===============================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _authService.LoginAsync(model);
            if (!result.IsAuthenticated)
                return BadRequest(result.Message);
            return Ok(result);
        }

        // ===============================
        // REFRESH TOKEN
        // ===============================
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto model)
        {
            var result = await _authService.RefreshTokenAsync(model);
            if (!result.IsAuthenticated)
                return BadRequest(result.Message);
            return Ok(result);
        }

        // ===============================
        // Current user info
        // ===============================
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var firstName = User.FindFirstValue("FirstName");
            var lastName = User.FindFirstValue("LastName");
            var fullName = string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName) ? null : $"{firstName} {lastName}".Trim();

            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            int? managedBranchId = null;
            var branchClaim = User.FindFirst("BranchId")?.Value;
            if (!string.IsNullOrEmpty(branchClaim) && int.TryParse(branchClaim, out var bid))
                managedBranchId = bid;

            return Ok(new
            {
                userId,
                email,
                fullName,
                roles,
                managedBranchId
            });
        }

        // ===============================
        // LOGOUT  (Protected)
        // ===============================
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { message = "Email claim missing" });

            var result = await _authService.LogoutAsync(email);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        // ===============================
        // CHANGE PASSWORD (Protected)
        // ===============================
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(callerId))
            {
                _logger.LogWarning("ChangePassword attempted without NameIdentifier claim");
                return Unauthorized(new { message = "Token missing user id (NameIdentifier claim)" });
            }

            var result = await _authService.ChangePasswordAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        // change password for specific user (admin or owner)
        [Authorize]
        [HttpPost("change-password/{userId}")]
        public async Task<IActionResult> ChangePasswordForUser(string userId, [FromBody] ChangePasswordDto model)
        {
            if (string.IsNullOrEmpty(userId)) return BadRequest(new { message = "userId is required in the URL" });
            if (userId.Contains('@')) return BadRequest(new { message = "Use user id (guid) in URL, not email" });

            var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(callerId))
            {
                _logger.LogWarning("ChangePasswordForUser attempted without NameIdentifier claim. Target={UserId}", userId);
                return Unauthorized(new { message = "Token missing user id (NameIdentifier claim)" });
            }

            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && callerId != userId)
            {
                _logger.LogWarning("Forbidden change-password attempt. Caller={Caller} Target={Target}", callerId, userId);
                return Forbid();
            }

            var result = await _authService.ChangePasswordForUserAsync(userId, model);
            if (!result.IsAuthenticated)
            {
                if (result.Message?.Contains("Forbidden") == true) return Forbid();
                return BadRequest(result.Message);
            }
            return Ok(result);
        }

        // ===============================
        // Update user profile (Protected)
        // ===============================
        [Authorize]
        [HttpPut("user/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto model)
        {
            if (string.IsNullOrEmpty(userId)) return BadRequest(new { message = "userId is required in the URL" });
            if (userId.Contains('@')) return BadRequest(new { message = "Use user id (guid) in URL, not email" });

            var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(callerId))
            {
                _logger.LogWarning("UpdateUser attempted without NameIdentifier claim. Target={UserId}", userId);
                return Unauthorized(new { message = "Token missing user id (NameIdentifier claim)" });
            }

            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && callerId != userId)
            {
                _logger.LogWarning("Forbidden profile update attempt. Caller={Caller} Target={Target}", callerId, userId);
                return Forbid();
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _authService.UpdateUserAsync(userId, model);
            if (!result.IsAuthenticated)
            {
                if (result.Message?.Contains("Forbidden") == true) return Forbid();
                return BadRequest(result.Message);
            }
            return Ok(result);
        }

        // ===============================
        // Delete user (anonymize) (Protected)
        // ===============================
        [Authorize]
        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (string.IsNullOrEmpty(userId)) return BadRequest(new { message = "userId is required in the URL" });
            if (userId.Contains('@')) return BadRequest(new { message = "Use user id (guid) in URL, not email" });

            var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(callerId))
            {
                _logger.LogWarning("DeleteUser attempted without NameIdentifier claim. Target={UserId}", userId);
                return Unauthorized(new { message = "Token missing user id (NameIdentifier claim)" });
            }

            var isAdmin = User.IsInRole("Admin");
            if (!isAdmin && callerId != userId)
            {
                _logger.LogWarning("Forbidden delete attempt. Caller={Caller} Target={Target}", callerId, userId);
                return Forbid();
            }

            var result = await _authService.DeleteUserAsync(userId);
            if (!result.IsAuthenticated)
            {
                // DeleteUserAsync returns IsAuthenticated=false on anonymize success
                if (!string.IsNullOrEmpty(result.Message)) return Ok(new { message = result.Message });
                return BadRequest(result.Message);
            }

            return Ok(result);
        }

        // ===============================
        // VALIDATE TOKEN (Protected)
        // ===============================
        [Authorize]
        [HttpGet("validate-token")]
        public IActionResult ValidateToken()
        {
            return Ok(new { valid = true });
        }

    }
}
