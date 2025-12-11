using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Chair
    {
        [Key]
        public int Id { get; set; }

        public int BranchId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        // Barber assigned to this chair (optional)
        public int? AssignedBarberId { get; set; }

        // Current booking seated on this chair
        public int? CurrentBookingId { get; set; }
    }
}
