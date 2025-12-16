using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // ⭐ GET: api/users/non-admin
    [HttpGet("non-admin")]
    public async Task<IActionResult> GetNonAdminUsers()
    {
        var users = await _userService.GetNonAdminUsersAsync();
        return Ok(users);
    }
}
