using System;

namespace backend.DTOs
{
    public class ChairDto
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? AssignedBarberId { get; set; }
        public int? CurrentBookingId { get; set; }

        // Enhanced fields
        public string? AssignedBarberName { get; set; }
        public string? Status { get; set; } // "Occupied" | "Empty"
        public QueueItemDto? CurrentBooking { get; set; }
    }

    public class CreateChairDto
    {
        public int BranchId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? AssignedBarberId { get; set; }
    }

    public class EnqueueDto
    {
        public int BranchId { get; set; }
        public int BookingId { get; set; }
        public int Priority { get; set; } = 0;
    }

    public class AssignDto
    {
        public int ChairId { get; set; }
        public int BookingId { get; set; }
    }

    public class CompleteResultDto
    {
        public int ChairId { get; set; }
        public int? PreviousBookingId { get; set; }
        public int? NewAssignedBookingId { get; set; }
    }

    public class QueueItemDto
    {
        public int Id { get; set; }
        public int BranchId { get; set; }
        public int BookingId { get; set; }
        public int Priority { get; set; }
        public DateTime EnqueuedAt { get; set; }
        public bool IsServed { get; set; }

        // Enhanced fields
        public string? CustomerName { get; set; }
        public string? ServiceName { get; set; }
        public DateTime? BookingTime { get; set; }
        public string? PreferredBarberName { get; set; }
    }

    // DTO returned by GET /api/queue/live/{branchId}
    public class LiveChairDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? AssignedBarberId { get; set; }
        public string? AssignedBarberName { get; set; }
        public bool Occupied { get; set; }
        public int? CurrentBookingId { get; set; }
        public string? CurrentCustomerName { get; set; }
    }
}
