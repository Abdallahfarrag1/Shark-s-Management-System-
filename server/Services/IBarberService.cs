using backend.DTOs;
using BarberBooking.API.DTOs;

namespace BarberBooking.API.Services;

public interface IBarberService
{
    Task<List<BarberDto>> GetAllAsync();
    Task<BarberDto?> GetByIdAsync(int id);
    Task<BarberDto> CreateAsync(CreateBarberDto dto);
    Task<BarberDto?> UpdateAsync(int id, UpdateBarberDto dto);
    Task<bool> DeleteAsync(int id);
    Task<List<AvailableBarberDto>> GetAvailableBarbersAsync(int branchId, DateTime date, TimeSpan time);


}
