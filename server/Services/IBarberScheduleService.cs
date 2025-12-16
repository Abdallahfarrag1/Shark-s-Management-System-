using backend.DTOs;

namespace backend.Services
{
    public interface IBarberScheduleService
    {
        Task<Dictionary<string, DailyScheduleDto>> GetWeeklySchedule(int barberId);
        Task<bool> UpdateWeeklySchedule(int barberId, Dictionary<string, DailyScheduleDto> schedule);
        Task<bool> IsBarberAvailableAt(int barberId, DateTime date, TimeSpan time);


    }
}
