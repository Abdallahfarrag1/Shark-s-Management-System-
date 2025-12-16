using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface IAnalyticsService
{
    Task<AnalyticsResultDto> GetBranchAnalyticsAsync(int branchId, int days);
}

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _db;

    public AnalyticsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AnalyticsResultDto> GetBranchAnalyticsAsync(int branchId, int days)
    {
        var since = DateTime.UtcNow.Date.AddDays(-days + 1);

        // Bookings created in the range
        var bookingsQuery = _db.Bookings.Where(b => b.BranchId == branchId && b.CreatedAt.Date >= since);
        var totalBookings = await bookingsQuery.CountAsync();

        var bookingsByStatus = await bookingsQuery
            .GroupBy(b => b.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var bookingsPerDay = await bookingsQuery
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync();

        // queue
        var pendingQueueCount = await _db.QueueItems.CountAsync(q => q.BranchId == branchId && !q.IsServed);

        // chairs
        var occupiedChairs = await _db.Chairs.CountAsync(c => c.BranchId == branchId && c.CurrentBookingId != null);

        // feedback
        var feedbacksQuery = _db.Feedbacks.Where(f => f.BranchId == branchId && f.CreatedAt.Date >= since);
        var ratingsCount = await feedbacksQuery.CountAsync();
        var avgRating = ratingsCount == 0 ? 0.0 : await feedbacksQuery.AverageAsync(f => (double)f.Rating);

        // revenue from bookings (only include completed or paid bookings)
        var paidBookingsQuery = bookingsQuery.Where(b => b.Status == BookingStatus.Completed || b.PaymentStatus != "Unpaid");
        decimal bookingsRevenue = 0m;
        int paidBookingsCount = 0;
        try
        {
            bookingsRevenue = await paidBookingsQuery.SumAsync(b => (decimal?)b.ServicePrice) ?? 0m;
            paidBookingsCount = await paidBookingsQuery.CountAsync();
        }
        catch
        {
            bookingsRevenue = 0m;
            paidBookingsCount = 0;
        }

        // orders - not linked to branch in current schema, include bookings revenue as total revenue for branch
        decimal totalOrdersValue = bookingsRevenue;
        int ordersCount = paidBookingsCount;

        var statusDict = bookingsByStatus.ToDictionary(x => x.Status ?? "Unknown", x => x.Count);

        return new AnalyticsResultDto
        {
            BranchId = branchId,
            Days = days,
            TotalBookings = totalBookings,
            BookingsByStatus = statusDict,
            BookingsPerDay = bookingsPerDay.Select(x => new DailyCount { Date = x.Date, Count = x.Count }).ToList(),
            PendingQueueCount = pendingQueueCount,
            OccupiedChairs = occupiedChairs,
            AverageRating = avgRating,
            RatingsCount = ratingsCount,
            TotalOrdersValue = totalOrdersValue,
            OrdersCount = ordersCount
        };
    }
}
