using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class QueueService : IQueueService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<QueueService> _logger;

        private const string STATUS_PENDING = "Pending";
        private const string STATUS_QUEUED = "Queued";
        private const string STATUS_IN_PROGRESS = "InProgress";
        private const string STATUS_COMPLETED = "Completed";

        public QueueService(AppDbContext db, ILogger<QueueService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<List<ChairDto>> GetChairsForBranchAsync(int branchId)
        {
            // Project chairs and include assigned barber name and optional currentBooking summary
            return await _db.Chairs
                .Where(c => c.BranchId == branchId)
                .Select(c => new ChairDto
                {
                    Id = c.Id,
                    BranchId = c.BranchId,
                    Name = c.Name,
                    AssignedBarberId = c.AssignedBarberId,
                    CurrentBookingId = c.CurrentBookingId,

                    // assigned barber full name (nullable)
                    AssignedBarberName = c.AssignedBarberId == null
                        ? null
                        : _db.Barbers.Where(b => b.Id == c.AssignedBarberId).Select(b => (b.FirstName + " " + b.LastName).Trim()).FirstOrDefault(),

                    // status derived from currentBookingId
                    Status = c.CurrentBookingId == null ? "Empty" : "Occupied",

                    // currentBooking: if occupied include an enhanced QueueItemDto (may be null if not found)
                    CurrentBooking = c.CurrentBookingId == null ? null :
                        _db.QueueItems
                            .Where(q => q.BookingId == c.CurrentBookingId)
                            .OrderByDescending(q => q.EnqueuedAt)
                            .Select(q => new QueueItemDto
                            {
                                Id = q.Id,
                                BranchId = q.BranchId,
                                BookingId = q.BookingId,
                                Priority = q.Priority,
                                EnqueuedAt = q.EnqueuedAt,
                                IsServed = q.IsServed,

                                // booking related fields
                                CustomerName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.CustomerName).FirstOrDefault(),
                                ServiceName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.ServiceName).FirstOrDefault(),
                                BookingTime = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => (DateTime?)bk.StartAt).FirstOrDefault(),
                                PreferredBarberName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.BarberName).FirstOrDefault()
                            })
                            .FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<ChairDto> CreateChairAsync(CreateChairDto dto)
        {
            var ent = new Chair
            {
                BranchId = dto.BranchId,
                Name = dto.Name,
                AssignedBarberId = dto.AssignedBarberId
            };

            _db.Add(ent);
            await _db.SaveChangesAsync();

            return new ChairDto
            {
                Id = ent.Id,
                BranchId = ent.BranchId,
                Name = ent.Name,
                AssignedBarberId = ent.AssignedBarberId,
                CurrentBookingId = ent.CurrentBookingId
            };
        }

        public async Task<bool> DeleteChairAsync(int id)
        {
            var chair = await _db.Chairs.FindAsync(id);
            if (chair == null) return false;

            if (chair.CurrentBookingId != null)
            {
                // cannot delete occupied chair - return false so controller can return 409
                _logger.LogWarning("Attempt to delete occupied chair {ChairId}", id);
                return false;
            }

            _db.Chairs.Remove(chair);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task EnqueueBookingAsync(EnqueueDto dto)
        {
            // validate priority (0..10)
            if (dto.Priority < 0 || dto.Priority > 10)
            {
                _logger.LogWarning("Invalid priority {Priority} for enqueue", dto.Priority);
                throw new ArgumentOutOfRangeException(nameof(dto.Priority), "Priority must be between 0 and 10.");
            }

            var booking = await _db.Bookings.FindAsync(dto.BookingId);
            if (booking == null)
            {
                _logger.LogWarning("Attempt to enqueue non-existing booking {BookingId}", dto.BookingId);
                throw new ArgumentException("Booking not found");
            }

            if (booking.BranchId != dto.BranchId)
            {
                _logger.LogWarning("Booking {BookingId} does not belong to branch {BranchId}", dto.BookingId, dto.BranchId);
                throw new ArgumentException("Booking does not belong to this branch.");
            }

            // prevent duplicates: if there is an active queue item for this booking
            var exists = await _db.QueueItems.AnyAsync(q => q.BookingId == dto.BookingId && !q.IsServed);
            if (exists)
            {
                _logger.LogInformation("Booking {BookingId} is already enqueued", dto.BookingId);
                throw new InvalidOperationException("Booking is already enqueued.");
            }

            // validate booking status (only Pending bookings can be enqueued)
            if (!string.Equals(booking.Status, STATUS_PENDING, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInformation("Booking {BookingId} has status {Status} and cannot be enqueued", dto.BookingId, booking.Status);
                throw new InvalidOperationException($"Cannot enqueue booking with status '{booking.Status}'");
            }

            var qi = new QueueItem
            {
                BranchId = dto.BranchId,
                BookingId = dto.BookingId,
                Priority = dto.Priority,
            };

            _db.Add(qi);

            if (string.Equals(booking.Status, STATUS_PENDING, StringComparison.OrdinalIgnoreCase))
                booking.Status = STATUS_QUEUED;

            await _db.SaveChangesAsync();
        }

        public async Task<List<QueueItemDto>> GetQueueForBranchAsync(int branchId)
        {
            // include booking details with each queue item
            return await _db.QueueItems
                .Where(q => q.BranchId == branchId && !q.IsServed)
                .OrderByDescending(q => q.Priority)
                .ThenBy(q => q.EnqueuedAt)
                .Select(q => new QueueItemDto
                {
                    Id = q.Id,
                    BranchId = q.BranchId,
                    BookingId = q.BookingId,
                    Priority = q.Priority,
                    EnqueuedAt = q.EnqueuedAt,
                    IsServed = q.IsServed,

                    CustomerName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.CustomerName).FirstOrDefault(),
                    ServiceName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.ServiceName).FirstOrDefault(),
                    BookingTime = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => (DateTime?)bk.StartAt).FirstOrDefault(),
                    PreferredBarberName = _db.Bookings.Where(bk => bk.Id == q.BookingId).Select(bk => bk.BarberName).FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<bool> AssignBookingToChairAsync(AssignDto dto)
        {
            using var trx = await _db.Database.BeginTransactionAsync();

            var chair = await _db.Chairs.FindAsync(dto.ChairId);
            if (chair == null)
            {
                _logger.LogWarning("Assign failed: chair {ChairId} not found", dto.ChairId);
                throw new ArgumentException("Chair not found");
            }

            if (chair.CurrentBookingId != null)
            {
                _logger.LogWarning("Assign failed: chair {ChairId} is occupied", dto.ChairId);
                throw new InvalidOperationException("Chair is occupied.");
            }

            var booking = await _db.Bookings.FindAsync(dto.BookingId);
            if (booking == null)
            {
                _logger.LogWarning("Assign failed: booking {BookingId} not found", dto.BookingId);
                throw new ArgumentException("Booking not found");
            }

            var qi = await _db.QueueItems
                .Where(q => q.BookingId == booking.Id && !q.IsServed)
                .FirstOrDefaultAsync();

            if (qi != null)
            {
                qi.IsServed = true;
                _db.Update(qi);
            }

            // set assignment
            chair.CurrentBookingId = booking.Id;
            booking.Status = STATUS_IN_PROGRESS;

            _db.Update(chair);
            _db.Update(booking);

            // re-check to avoid race: ensure chair is still available
            var freshChair = await _db.Chairs.AsNoTracking().FirstOrDefaultAsync(c => c.Id == chair.Id);
            if (freshChair != null && freshChair.CurrentBookingId != null && freshChair.CurrentBookingId != chair.CurrentBookingId)
            {
                _logger.LogWarning("Race detected when assigning booking {BookingId} to chair {ChairId}", booking.Id, chair.Id);
                throw new InvalidOperationException("Chair was occupied by another operation.");
            }

            await _db.SaveChangesAsync();
            await trx.CommitAsync();
            return true;
        }

        public async Task<CompleteResultDto> CompleteChairBookingAsync(int chairId)
        {
            using var trx = await _db.Database.BeginTransactionAsync();

            var chair = await _db.Chairs.FindAsync(chairId);
            if (chair == null)
            {
                _logger.LogWarning("Complete failed: chair {ChairId} not found", chairId);
                throw new ArgumentException("Chair not found");
            }

            int? previous = chair.CurrentBookingId;

            if (previous != null)
            {
                var oldBooking = await _db.Bookings.FindAsync(previous.Value);
                if (oldBooking != null)
                {
                    oldBooking.Status = STATUS_COMPLETED;
                    _db.Update(oldBooking);
                }
            }

            chair.CurrentBookingId = null;
            _db.Update(chair);

            var next = await _db.QueueItems
                .Where(q => q.BranchId == chair.BranchId && !q.IsServed)
                .OrderByDescending(q => q.Priority)
                .ThenBy(q => q.EnqueuedAt)
                .FirstOrDefaultAsync();

            int? newAssign = null;

            if (next != null)
            {
                var nextBooking = await _db.Bookings.FindAsync(next.BookingId);

                if (nextBooking != null)
                {
                    chair.CurrentBookingId = nextBooking.Id;
                    nextBooking.Status = STATUS_IN_PROGRESS;

                    next.IsServed = true;

                    _db.Update(chair);
                    _db.Update(nextBooking);
                    _db.Update(next);
                }

                newAssign = next.BookingId;
            }

            await _db.SaveChangesAsync();
            await trx.CommitAsync();

            return new CompleteResultDto
            {
                ChairId = chairId,
                PreviousBookingId = previous,
                NewAssignedBookingId = newAssign
            };
        }
    }
}
