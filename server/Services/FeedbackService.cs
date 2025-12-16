// backend/Services/FeedbackService.cs
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _db;

        public FeedbackService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<bool> AddFeedbackAsync(CreateFeedbackDto dto, string ipAddress)
        {
            // Check last feedback from this IP for same branch
            var last = await _db.Feedbacks
                .Where(f => f.BranchId == dto.BranchId && f.IpAddress == ipAddress)
                .OrderByDescending(f => f.CreatedAt)
                .FirstOrDefaultAsync();

            if (last != null)
            {
                // allow only 1 feedback every 24 hours
                if ((DateTime.UtcNow - last.CreatedAt).TotalHours < 24)
                    return false; // reject
            }

            var feedback = new Feedback
            {
                BranchId = dto.BranchId,
                Rating = dto.Rating,
                IpAddress = ipAddress
            };

            _db.Feedbacks.Add(feedback);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
