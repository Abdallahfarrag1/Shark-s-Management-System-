using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
            var result = await _authService.ChangePasswordAsync(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

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
