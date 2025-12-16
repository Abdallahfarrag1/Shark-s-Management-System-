using BarberBooking.API.DTOs;
namespace BarberBooking.API.Services;
public interface IServiceService
{
    Task<List<ServiceDto>> GetAllAsync();
    Task<ServiceDto?> GetByIdAsync(int id);
    Task<ServiceDto> CreateAsync(CreateServiceDto dto);
    Task<ServiceDto?> UpdateAsync(int id, UpdateServiceDto dto);
    Task<bool> DeleteAsync(int id);
}
