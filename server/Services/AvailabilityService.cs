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
        private readonly IBarberScheduleService _scheduleService;

        public AvailabilityService(AppDbContext db, ILogger<AvailabilityService> logger, IBarberScheduleService scheduleService)
        {
            _db = db;
            _logger = logger;
            _scheduleService = scheduleService;
        }

        public async Task<List<AvailableBarberDto>> GetAvailableBarbersAsync(int branchId, DateTime date, TimeSpan time)
        {
            return await GetAvailableByDateAsync(branchId, date, time);
        }

        public async Task<List<AvailableBarberDto>> GetAvailableByDateAsync(int branchId, DateTime date, TimeSpan time)
        {
            // 1) get all barbers in branch
            var barbers = await _db.Barbers
                .Where(b => b.BranchId == branchId)
                .ToListAsync();

            var available = new List<AvailableBarberDto>();

            foreach (var barber in barbers)
            {
                bool isWorking = await _scheduleService.IsBarberAvailableAt(barber.Id, date, time);
                if (!isWorking)
                    continue;

                // check for conflicting bookings at the requested slot
                bool hasBooking = await _db.Bookings.AnyAsync(bk =>
                    bk.BarberId == barber.Id &&
                    bk.StartAt.Date == date.Date &&
                    time >= bk.StartAt.TimeOfDay &&
                    time < bk.EndAt.TimeOfDay &&
                    bk.Status != "Rejected"
                );

                if (hasBooking)
                    continue;

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