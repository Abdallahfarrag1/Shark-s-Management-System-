using backend.DTOs;
using BarberBooking.API.DTOs;

namespace BarberBooking.API.Services;

public interface IBookingService
{
    Task<BookingDto> CreateAsync(CreateBookingDto dto);
    Task<BookingDto?> GetByIdAsync(int id);
    Task<List<BookingDto>> GetAllAsync();
    Task<bool> DeleteAsync(int id);
    Task<BookingDto?> UpdateStatusAsync(int bookingId, string newStatus);
    Task<List<BookingDto>> GetByUserAsync(string userId);
    Task<List<BookingDto>> GetByBranchAsync(int branchId);
}
