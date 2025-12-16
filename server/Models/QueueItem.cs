using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class QueueItem
    {
        [Key]
        public int Id { get; set; }

        public int BranchId { get; set; }

        public int BookingId { get; set; }

        public int Priority { get; set; } = 0;

        public DateTime EnqueuedAt { get; set; } = DateTime.UtcNow;

        public bool IsServed { get; set; } = false;
    }
}
