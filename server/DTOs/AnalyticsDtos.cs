using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class AnalyticsResultDto
    {
        public int BranchId { get; set; }
        public int Days { get; set; }

        public int TotalBookings { get; set; }
        public Dictionary<string,int> BookingsByStatus { get; set; } = new();
        public List<DailyCount> BookingsPerDay { get; set; } = new();

        public int PendingQueueCount { get; set; }
        public int OccupiedChairs { get; set; }

        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }

        public decimal TotalOrdersValue { get; set; }
        public int OrdersCount { get; set; }
    }

    public class DailyCount
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
}
