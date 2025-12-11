namespace backend.DTOs
{
    public class DailyScheduleDto
    {
        public bool IsWorking { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }
}
