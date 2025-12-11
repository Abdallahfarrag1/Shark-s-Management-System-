using backend.DTOs;
using backend.Models;
using BarberBooking.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _db;

    public BookingService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        // If BarberId is 0 or not provided, treat as no preferred barber
        Barber? barber = null;
        if (dto.BarberId > 0)
        {
            barber = await _db.Barbers.FindAsync(dto.BarberId);
            if (barber == null)
                throw new Exception("Invalid barber ID");
        }

        var service = await _db.Services.FindAsync(dto.ServiceId);

        if (service == null)
            throw new Exception("Invalid service ID");

        // Service duration = service.Price ?? لو عندك duration field غيرها  
        var duration = 30; // default  
        var endAt = dto.StartAt.AddMinutes(duration);

        var booking = new Booking
        {
            CustomerId = dto.CustomerId,
            CustomerName = string.IsNullOrWhiteSpace(dto.CustomerName) ? string.Empty : dto.CustomerName!.Trim(),

            BarberId = barber?.Id ?? 0,
            BarberName = barber != null ? barber.FirstName + " " + barber.LastName : string.Empty,

            ServiceId = service.Id,
            ServiceName = service.Name,
            ServicePrice = service.Price,

            BranchId = dto.BranchId,

            StartAt = dto.StartAt,
            EndAt = endAt,
            DurationMinutes = duration,

            Status = "Pending",
            PaymentStatus = "Unpaid",
            PaymentMethod = "None"
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return ToDto(booking);
    }

    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        return booking == null ? null : ToDto(booking);
    }

    public async Task<List<BookingDto>> GetAllAsync()
    {
        return await _db.Bookings
            .Select(x => ToDto(x))
            .ToListAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return false;

        _db.Bookings.Remove(booking);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<BookingDto?> UpdateStatusAsync(int bookingId, string newStatus)
    {
        var booking = await _db.Bookings.FindAsync(bookingId);
        if (booking == null) return null;

        booking.Status = newStatus;

        await _db.SaveChangesAsync();

        return ToDto(booking);
    }

    public async Task<List<BookingDto>> GetByUserAsync(string userId)
    {
        return await _db.Bookings
            .Where(b => b.CustomerId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => ToDto(b))
            .ToListAsync();
    }

    public async Task<List<BookingDto>> GetByBranchAsync(int branchId)
    {
        return await _db.Bookings
            .Where(b => b.BranchId == branchId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => ToDto(b))
            .ToListAsync();
    }

    private static BookingDto ToDto(Booking b)
    {
        return new BookingDto
        {
            Id = b.Id,

            CustomerId = b.CustomerId,
            CustomerName = b.CustomerName,

            BarberId = b.BarberId,
            BarberName = b.BarberName,

            ServiceId = b.ServiceId,
            ServiceName = b.ServiceName,
            ServicePrice = b.ServicePrice,

            BranchId = b.BranchId,

            StartAt = b.StartAt,
            EndAt = b.EndAt,
            DurationMinutes = b.DurationMinutes,

            Status = b.Status,
            PaymentStatus = b.PaymentStatus,
            PaymentMethod = b.PaymentMethod,

            CreatedAt = b.CreatedAt
        };
    }
}







