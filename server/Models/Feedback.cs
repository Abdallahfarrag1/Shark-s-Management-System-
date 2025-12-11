// backend/Models/Feedback.cs
using System;

namespace backend.Models
{
    public class Feedback
    {
        public int Id { get; set; }

        public int BranchId { get; set; }
        public int Rating { get; set; } // 0 to 5

        public string IpAddress { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
