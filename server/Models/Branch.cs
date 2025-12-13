namespace backend.Models
{
    public class Branch
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public string? ManagerId { get; set; }       
        public ApplicationUser? Manager { get; set; }
        public string? ImageUrl { get; set; }
        public List<Barber> Staff { get; set; } = new();
    }
}
