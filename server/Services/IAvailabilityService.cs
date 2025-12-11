using backend.DTOs;

namespace backend.Services
{
    public interface IAvailabilityService
    {
        Task<List<AvailableBarberDto>> GetAvailableBarbersAsync(int branchId, DateTime date, TimeSpan time);
        Task<List<AvailableBarberDto>> GetAvailableByDateAsync(int branchId, DateTime date, TimeSpan time);
    }
}
