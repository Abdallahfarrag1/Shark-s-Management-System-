namespace BarberBooking.API.DTOs;

public class CreateBranchDto
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ManagerId { get; set; }

    public IFormFile? Image { get; set; }   // ← مهم جداً

}
