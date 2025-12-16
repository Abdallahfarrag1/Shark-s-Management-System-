namespace backend.Models
{
    public class Booking
    {
        public int Id { get; set; }

        // User
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;

        // Barber
        public int BarberId { get; set; }
        public string BarberName { get; set; } = string.Empty;

        // Service
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal ServicePrice { get; set; }

        // Branch
        public int BranchId { get; set; }

        // Time
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public int DurationMinutes { get; set; }

        // Status
        public string Status { get; set; } = BookingStatus.Pending;

        // Payment
        public string PaymentStatus { get; set; } = "Unpaid";
        public string PaymentMethod { get; set; } = "None";
        //Paypal
        public string? PaymentOrderId { get; set; }
        public string? PaymentCapturedId { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsNoShow { get; set; }
    }

    public static class BookingStatus
    {
        public const string Pending = "Pending";
        public const string Confirmed = "Confirmed";
        public const string InProgress = "InProgress";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";
        public const string Rejected = "Rejected";
        public const string NoShow = "NoShow";
    }
}
