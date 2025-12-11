using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AnalyticsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("branch/{branchId}")]
        public async Task<IActionResult> GetBranchAnalytics(int branchId, int days = 30)
        {
            var since = DateTime.UtcNow.AddDays(-days);

            // total bookings
            var totalBookings = await _db.Bookings.CountAsync(b => b.BranchId == branchId);
            var totalBookingsLast = await _db.Bookings.CountAsync(b => b.BranchId == branchId && b.CreatedAt >= since);

            // revenue: from orders and booking service prices
            var revenueFromOrders = await _db.Orders
                .Where(o => _db.OrderItems.Any(i => i.OrderId == o.Id) && o.Items.Any())
                .Where(o => o.Items.Any())
                .Where(o => true) // placeholder
                .ToListAsync();

            // simple revenue from bookings: sum of ServicePrice for completed bookings
            var totalRevenue = await _db.Bookings
                .Where(b => b.BranchId == branchId && b.Status == "Completed")
                .SumAsync(b => (decimal?)b.ServicePrice) ?? 0m;

            var totalRevenueLast = await _db.Bookings
                .Where(b => b.BranchId == branchId && b.Status == "Completed" && b.CreatedAt >= since)
                .SumAsync(b => (decimal?)b.ServicePrice) ?? 0m;

            // avg rating
            var avgRating = await _db.Feedbacks
                .Where(f => f.BranchId == branchId)
                .Select(f => (double?)f.Rating)
                .AverageAsync() ?? 0.0;

            // bookings per day and revenue per day
            var bookingsPerDay = await _db.Bookings
                .Where(b => b.BranchId == branchId && b.CreatedAt >= since)
                .GroupBy(b => b.CreatedAt.Date)
                .Select(g => new DayPointDto { Date = g.Key, Count = g.Count(), Revenue = g.Sum(x => x.ServicePrice) })
                .OrderBy(dp => dp.Date)
                .ToListAsync();

            // peak hour - find hour with most bookings (by StartAt hour)
            var peak = await _db.Bookings
                .Where(b => b.BranchId == branchId && b.CreatedAt >= since)
                .GroupBy(b => b.StartAt.Hour)
                .Select(g => new { Hour = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .FirstOrDefaultAsync();

            int peakHour = peak?.Hour ?? 0;
            int peakHourCount = peak?.Count ?? 0;

            // top services
            var topServices = await _db.Bookings
                .Where(b => b.BranchId == branchId && b.CreatedAt >= since)
                .GroupBy(b => new { b.ServiceId, b.ServiceName })
                .Select(g => new TopServiceDto { ServiceId = g.Key.ServiceId, ServiceName = g.Key.ServiceName, BookingsCount = g.Count() })
                .OrderByDescending(x => x.BookingsCount)
                .Take(10)
                .ToListAsync();

            var dto = new BranchAnalyticsDto
            {
                BranchId = branchId,
                TotalBookings = totalBookings,
                TotalBookingsLastDays = totalBookingsLast,
                TotalRevenue = totalRevenue,
                TotalRevenueLastDays = totalRevenueLast,
                AvgRating = avgRating,
                PeakHour = peakHour,
                PeakHourCount = peakHourCount,
                BookingsPerDay = bookingsPerDay,
                RevenuePerDay = bookingsPerDay,
                TopServices = topServices
            };

            return Ok(dto);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllBranchesAnalytics(int days = 30)
        {
            var since = DateTime.UtcNow.AddDays(-days);

            var branchIds = await _db.Branches.Select(b => b.Id).ToListAsync();

            // Pre-aggregate necessary data grouped by BranchId
            var bookingsTotal = await _db.Bookings
                .GroupBy(b => b.BranchId)
                .Select(g => new { BranchId = g.Key, Total = g.Count() })
                .ToListAsync();

            var bookingsLast = await _db.Bookings
                .Where(b => b.CreatedAt >= since)
                .GroupBy(b => b.BranchId)
                .Select(g => new { BranchId = g.Key, Total = g.Count() })
                .ToListAsync();

            var revenueTotal = await _db.Bookings
                .Where(b => b.Status == "Completed")
                .GroupBy(b => b.BranchId)
                .Select(g => new { BranchId = g.Key, Revenue = g.Sum(x => x.ServicePrice) })
                .ToListAsync();

            var revenueLast = await _db.Bookings
                .Where(b => b.Status == "Completed" && b.CreatedAt >= since)
                .GroupBy(b => b.BranchId)
                .Select(g => new { BranchId = g.Key, Revenue = g.Sum(x => x.ServicePrice) })
                .ToListAsync();

            var avgRatings = await _db.Feedbacks
                .GroupBy(f => f.BranchId)
                .Select(g => new { BranchId = g.Key, Avg = g.Average(x => (double)x.Rating) })
                .ToListAsync();

            var bookingsPerDayAll = await _db.Bookings
                .Where(b => b.CreatedAt >= since)
                .GroupBy(b => new { b.BranchId, Date = b.CreatedAt.Date })
                .Select(g => new { g.Key.BranchId, g.Key.Date, Count = g.Count(), Revenue = g.Sum(x => x.ServicePrice) })
                .ToListAsync();

            var peakHoursAll = await _db.Bookings
                .Where(b => b.CreatedAt >= since)
                .GroupBy(b => new { b.BranchId, Hour = b.StartAt.Hour })
                .Select(g => new { g.Key.BranchId, Hour = g.Key.Hour, Count = g.Count() })
                .ToListAsync();

            var topServicesAll = await _db.Bookings
                .Where(b => b.CreatedAt >= since)
                .GroupBy(b => new { b.BranchId, b.ServiceId, b.ServiceName })
                .Select(g => new { g.Key.BranchId, g.Key.ServiceId, g.Key.ServiceName, Count = g.Count() })
                .ToListAsync();

            var result = new List<BranchAnalyticsDto>();

            foreach (var branchId in branchIds)
            {
                var totalB = bookingsTotal.FirstOrDefault(x => x.BranchId == branchId)?.Total ?? 0;
                var lastB = bookingsLast.FirstOrDefault(x => x.BranchId == branchId)?.Total ?? 0;
                var rev = revenueTotal.FirstOrDefault(x => x.BranchId == branchId)?.Revenue ?? 0m;
                var revLast = revenueLast.FirstOrDefault(x => x.BranchId == branchId)?.Revenue ?? 0m;
                var avgR = avgRatings.FirstOrDefault(x => x.BranchId == branchId)?.Avg ?? 0.0;

                var bookingsPerDay = bookingsPerDayAll
                    .Where(x => x.BranchId == branchId)
                    .OrderBy(x => x.Date)
                    .Select(x => new DayPointDto { Date = x.Date, Count = x.Count, Revenue = x.Revenue })
                    .ToList();

                var peakForBranch = peakHoursAll
                    .Where(x => x.BranchId == branchId)
                    .GroupBy(x => x.Hour)
                    .Select(g => new { Hour = g.Key, Count = g.Sum(x => x.Count) })
                    .OrderByDescending(x => x.Count)
                    .FirstOrDefault();

                int peakHour = peakForBranch?.Hour ?? 0;
                int peakCount = peakForBranch?.Count ?? 0;

                var topServices = topServicesAll
                    .Where(x => x.BranchId == branchId)
                    .GroupBy(x => new { x.ServiceId, x.ServiceName })
                    .Select(g => new TopServiceDto { ServiceId = g.Key.ServiceId, ServiceName = g.Key.ServiceName, BookingsCount = g.Sum(x => x.Count) })
                    .OrderByDescending(x => x.BookingsCount)
                    .Take(10)
                    .ToList();

                result.Add(new BranchAnalyticsDto
                {
                    BranchId = branchId,
                    TotalBookings = totalB,
                    TotalBookingsLastDays = lastB,
                    TotalRevenue = rev,
                    TotalRevenueLastDays = revLast,
                    AvgRating = avgR,
                    PeakHour = peakHour,
                    PeakHourCount = peakCount,
                    BookingsPerDay = bookingsPerDay,
                    RevenuePerDay = bookingsPerDay,
                    TopServices = topServices
                });
            }

            return Ok(result);
        }
    }
}
