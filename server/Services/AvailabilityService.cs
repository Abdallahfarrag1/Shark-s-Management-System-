using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Globalization;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class AvailabilityService : IAvailabilityService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<AvailabilityService> _logger;

        public AvailabilityService(AppDbContext db, ILogger<AvailabilityService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<List<AvailableBarberDto>> GetAvailableBarbersAsync(int branchId, DateTime date, TimeSpan time)
        {
            return await GetAvailableByDateAsync(branchId, date, time);
        }

        public async Task<List<AvailableBarberDto>> GetAvailableByDateAsync(int branchId, DateTime date, TimeSpan time)
        {
            string dayName = date.DayOfWeek.ToString();

            // 1) هات كل الحلاقين في الفرع
            var barbers = await _db.Barbers
                .Where(b => b.BranchId == branchId)
                .ToListAsync();

            var available = new List<AvailableBarberDto>();

            foreach (var barber in barbers)
            {
                // Load schedule
                var scheduleRecord = await _db.BarberSchedules
                    .FirstOrDefaultAsync(s => s.BarberId == barber.Id);

                if (scheduleRecord == null || string.IsNullOrWhiteSpace(scheduleRecord.WeeklyScheduleJson))
                    continue;

                Dictionary<string, DailyScheduleDto>? weekly = null;

                try
                {
                    weekly = JsonSerializer.Deserialize<Dictionary<string, DailyScheduleDto>>(scheduleRecord.WeeklyScheduleJson);
                }
                catch
                {
                    continue;
                }

                if (weekly == null || !weekly.ContainsKey(dayName))
                    continue;

                var day = weekly[dayName];

                // check if working
                if (!day.IsWorking)
                    continue;

                // add barber to available list
                available.Add(new AvailableBarberDto
                {
                    BarberId = barber.Id,
                    FirstName = barber.FirstName,
                    LastName = barber.LastName,
                    PhoneNumber = barber.PhoneNumber
                });
            }

            return available;
        }
    }
}