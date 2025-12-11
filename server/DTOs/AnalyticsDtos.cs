using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class DayPointDto
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
        public decimal Revenue { get; set; }
    }

    public class TopServiceDto
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public int BookingsCount { get; set; }
    }

    public class BranchAnalyticsDto
    {
        public int BranchId { get; set; }
        public int TotalBookings { get; set; }
        public int TotalBookingsLastDays { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalRevenueLastDays { get; set; }
        public double AvgRating { get; set; }
        public int PeakHour { get; set; }
        public int PeakHourCount { get; set; }
        public List<DayPointDto> BookingsPerDay { get; set; } = new();
        public List<DayPointDto> RevenuePerDay { get; set; } = new();
        public List<TopServiceDto> TopServices { get; set; } = new();
    }
}
