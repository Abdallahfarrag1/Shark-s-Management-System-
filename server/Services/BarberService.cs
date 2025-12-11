using backend.DTOs;
using backend.Models;
using backend.Services;
using BarberBooking.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BarberBooking.API.Services
{
    public class BarberService : IBarberService
    {
        private readonly AppDbContext _db;
        private readonly IBarberScheduleService _scheduleService;

        public BarberService(AppDbContext db, IBarberScheduleService scheduleService)
        {
            _db = db;
            _scheduleService = scheduleService;
        }
        public async Task<BarberDto> CreateAsync(CreateBarberDto dto)
        {
            var ent = new Barber
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                BranchId = dto.BranchId
            };

            _db.Barbers.Add(ent);
            await _db.SaveChangesAsync(); // ضروري جداً لإرجاع BarberId

            // ⬅️ إنشاء جدول شفتات فارغ للحلاق فور إضافته
            var emptySchedule = new BarberSchedule
            {
                BarberId = ent.Id,
                BranchId = ent.BranchId,
                WeeklyScheduleJson = JsonSerializer.Serialize(
                    new Dictionary<string, DailyScheduleDto>
                    {
                { "Sunday",    new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Monday",    new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Tuesday",   new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Wednesday", new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Thursday",  new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Friday",    new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } },
                { "Saturday",  new DailyScheduleDto { IsWorking = false, StartTime = "00:00", EndTime = "00:00" } }
                    }
                )
            };

            _db.BarberSchedules.Add(emptySchedule);
            await _db.SaveChangesAsync();

            return new BarberDto
            {
                Id = ent.Id,
                FirstName = ent.FirstName,
                LastName = ent.LastName,
                PhoneNumber = ent.PhoneNumber,
                BranchId = ent.BranchId
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var b = await _db.Barbers.FindAsync(id);
            if (b == null) return false;

            _db.Barbers.Remove(b);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<BarberDto>> GetAllAsync()
        {
            return await _db.Barbers
                .Select(b => new BarberDto
                {
                    Id = b.Id,
                    FirstName = b.FirstName,
                    LastName = b.LastName,
                    PhoneNumber = b.PhoneNumber,
                    BranchId = b.BranchId
                })
                .ToListAsync();
        }

        public async Task<BarberDto?> GetByIdAsync(int id)
        {
            var b = await _db.Barbers.FindAsync(id);
            if (b == null) return null;

            return new BarberDto
            {
                Id = b.Id,
                FirstName = b.FirstName,
                LastName = b.LastName,
                PhoneNumber = b.PhoneNumber,
                BranchId = b.BranchId
            };
        }

        public async Task<BarberDto?> UpdateAsync(int id, UpdateBarberDto dto)
        {
            var b = await _db.Barbers.FindAsync(id);
            if (b == null) return null;

            b.FirstName = dto.FirstName;
            b.LastName = dto.LastName;
            b.PhoneNumber = dto.PhoneNumber;
            b.BranchId = dto.BranchId;

            await _db.SaveChangesAsync();

            return new BarberDto
            {
                Id = b.Id,
                FirstName = b.FirstName,
                LastName = b.LastName,
                PhoneNumber = b.PhoneNumber,
                BranchId = b.BranchId
            };
        }
        public async Task<List<AvailableBarberDto>> GetAvailableBarbersAsync(int branchId, DateTime date, TimeSpan time)
        {
            var barbers = await _db.Barbers
                .Where(b => b.BranchId == branchId)
                .ToListAsync();

            var available = new List<AvailableBarberDto>();

            foreach (var barber in barbers)
            {
                bool isWorking = await _scheduleService.IsBarberAvailableAt(barber.Id, date, time);
                if (!isWorking)
                    continue;

                bool hasBooking = await _db.Bookings.AnyAsync(b =>
                    b.BarberId == barber.Id &&
                    b.StartAt.Date == date.Date &&
                    time >= b.StartAt.TimeOfDay &&
                    time < b.EndAt.TimeOfDay &&
                    b.Status != "Rejected"
                );

                if (!hasBooking)
                {
                    available.Add(new AvailableBarberDto
                    {
                        BarberId = barber.Id,
                        FirstName = barber.FirstName,
                        LastName = barber.LastName,
                        PhoneNumber = barber.PhoneNumber
                    });
                }
            }

            return available;
        }
    }
}
