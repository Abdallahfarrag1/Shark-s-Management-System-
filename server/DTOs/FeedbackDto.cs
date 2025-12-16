// backend/DTOs/FeedbackDto.cs
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateFeedbackDto
    {
        [Required]
        public int BranchId { get; set; }

        [Required]
        [Range(0, 5)]
        public int Rating { get; set; }
    }
}
