using backend.DTOs;
namespace BarberBooking.API.Services;
public interface IUserService
{
    Task<List<UserSummaryDto>> GetNonAdminUsersAsync();
}
