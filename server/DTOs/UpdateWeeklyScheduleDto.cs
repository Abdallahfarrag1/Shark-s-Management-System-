namespace backend.DTOs
{
    public class UpdateWeeklyScheduleDto
    {
        public Dictionary<string, DailyScheduleDto> Days { get; set; }
            = new Dictionary<string, DailyScheduleDto>();
    }
}
