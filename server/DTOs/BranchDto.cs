namespace BarberBooking.API.DTOs;

public class BranchDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ManagerId { get; set; }
    public string? ImageUrl { get; set; } 


}
