using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using BarberBooking.API.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<UserSummaryDto>> GetNonAdminUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();

        var result = new List<UserSummaryDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Admin"))
                continue; 

            result.Add(new UserSummaryDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList()
            });
        }

        return result;
    }
}