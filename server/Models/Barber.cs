namespace backend.Models;

public class Barber
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;


    public int BranchId { get; set; }
    public Branch? Branch { get; set; }
    public List<BarberSchedule> Schedules { get; set; } = new();
}
