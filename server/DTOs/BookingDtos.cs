using System;

namespace BarberBooking.API.DTOs;

public class BookingDto
{
    public int Id { get; set; }

    public string CustomerId { get; set; }
    public string CustomerName { get; set; }

    public int BarberId { get; set; }
    public string BarberName { get; set; }

    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public decimal ServicePrice { get; set; }

    public int BranchId { get; set; }

    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public int DurationMinutes { get; set; }

    public string Status { get; set; }
    public string PaymentStatus { get; set; }
    public string PaymentMethod { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class CreateBookingDto
{
    public string CustomerId { get; set; } = string.Empty;

    // Added: allow frontend to send customer full name
    public string? CustomerName { get; set; } = string.Empty;

    public int BarberId { get; set; }
    public int ServiceId { get; set; }
    public int BranchId { get; set; }

    public DateTime StartAt { get; set; }
}

public class UpdateBookingStatusDto
{
    public string Status { get; set; } = string.Empty;
}
public class BookingSlotDto
{
    public DateTime Time { get; set; }
    public bool IsAvailable { get; set; }
}