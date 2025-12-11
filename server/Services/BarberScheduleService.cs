using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Globalization;

namespace backend.Services
{
    public class BarberScheduleService : IBarberScheduleService
    {
        private readonly AppDbContext _context;

        public BarberScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Dictionary<string, DailyScheduleDto>> GetWeeklySchedule(int barberId)
        {
            var schedule = await _context.BarberSchedules
                .FirstOrDefaultAsync(s => s.BarberId == barberId);

            if (schedule == null)
                return new Dictionary<string, DailyScheduleDto>();

            // Try new shape first (WeeklyScheduleDto), otherwise fallback to legacy dictionary
            try
            {
                var weekly = JsonSerializer.Deserialize<WeeklyScheduleDto>(schedule.WeeklyScheduleJson);
                if (weekly != null && weekly.Days != null && weekly.Days.Count > 0)
                    return weekly.Days;
            }
            catch
            {
                // ignore and try legacy
            }

            try
            {
                return JsonSerializer.Deserialize<Dictionary<string, DailyScheduleDto>>(schedule.WeeklyScheduleJson)!
                    ?? new Dictionary<string, DailyScheduleDto>();
            }
            catch
            {
                return new Dictionary<string, DailyScheduleDto>();
            }
        }

        public async Task<bool> UpdateWeeklySchedule(int barberId, Dictionary<string, DailyScheduleDto> schedule)
        {
            var barberSchedule = await _context.BarberSchedules
                .FirstOrDefaultAsync(s => s.BarberId == barberId);

            if (barberSchedule == null)
                return false;

            // Serialize using the newer shape with Days property to be compatible with AvailabilityService
            var wrapper = new WeeklyScheduleDto { Days = schedule };
            barberSchedule.WeeklyScheduleJson = JsonSerializer.Serialize(wrapper);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsBarberAvailableAt(int barberId, DateTime date, TimeSpan time)
        {
            var scheduleRecord = await _context.BarberSchedules
                .FirstOrDefaultAsync(s => s.BarberId == barberId);

            if (scheduleRecord == null) return false;

            Dictionary<string, DailyScheduleDto>? dict = null;

            // Attempt to parse either shape
            try
            {
                var weekly = JsonSerializer.Deserialize<WeeklyScheduleDto>(scheduleRecord.WeeklyScheduleJson);
                if (weekly != null && weekly.Days != null && weekly.Days.Count > 0)
                    dict = weekly.Days;
            }
            catch
            {
                dict = null;
            }

            if (dict == null)
            {
                try
                {
                    dict = JsonSerializer.Deserialize<Dictionary<string, DailyScheduleDto>>(scheduleRecord.WeeklyScheduleJson);
                }
                catch
                {
                    dict = null;
                }
            }

            if (dict == null) return false;

            string dayName = date.DayOfWeek.ToString(); // e.g., Monday

            // Case-insensitive lookup
            var key = dict.Keys.FirstOrDefault(k => string.Equals(k, dayName, StringComparison.OrdinalIgnoreCase));
            if (key == null) return false;

            var day = dict[key];
            if (day == null) return false;
            if (!day.IsWorking) return false;

            var startText = day.StartTime?.Trim() ?? string.Empty;
            var endText = day.EndTime?.Trim() ?? string.Empty;

            if (!TryParseTime(startText, out var start)) return false;
            if (!TryParseTime(endText, out var end)) return false;

            // Check if time is inside working hours (inclusive start, exclusive end)
            return time >= start && time < end;
        }

        private static bool TryParseTime(string input, out TimeSpan time)
        {
            time = default;
            if (string.IsNullOrWhiteSpace(input))
                return false;

            if (TimeSpan.TryParse(input, CultureInfo.InvariantCulture, out var ts))
            {
                time = ts;
                return true;
            }

            if (DateTime.TryParse(input, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
            {
                time = dt.TimeOfDay;
                return true;
            }

            if (TimeSpan.TryParse(input, CultureInfo.CurrentCulture, out ts))
            {
                time = ts;
                return true;
            }

            if (DateTime.TryParse(input, CultureInfo.CurrentCulture, DateTimeStyles.None, out dt))
            {
                time = dt.TimeOfDay;
                return true;
            }

            return false;
        }
    }
}
