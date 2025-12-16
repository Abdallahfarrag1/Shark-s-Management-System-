using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QueueController : ControllerBase
    {
        private readonly IQueueService _queue;

        public QueueController(IQueueService queue)
        {
            _queue = queue;
        }

        [HttpGet("chairs/{branchId}")]
        public async Task<IActionResult> GetChairs(int branchId)
            => Ok(await _queue.GetChairsForBranchAsync(branchId));

        // Live endpoint
        [HttpGet("live/{branchId}")]
        public async Task<IActionResult> GetLive(int branchId)
        {
            var chairs = await _queue.GetChairsForBranchAsync(branchId);
            var live = chairs.Select(c => new LiveChairDto
            {
                Id = c.Id,
                Name = c.Name,
                AssignedBarberId = c.AssignedBarberId,
                AssignedBarberName = c.AssignedBarberName,
                Occupied = c.CurrentBookingId != null,
                CurrentBookingId = c.CurrentBookingId,
                CurrentCustomerName = c.CurrentBooking?.CustomerName
            }).ToList();

            return Ok(live);
        }

        //[Authorize(Roles = "Admin,BranchManager")]
        [HttpPost("chairs")]
        public async Task<IActionResult> CreateChair([FromBody] CreateChairDto dto)
        {
            var created = await _queue.CreateChairAsync(dto);

            // try to populate AssignedBarberName for response
            if (created.AssignedBarberId.HasValue)
            {
                // this uses booking service to fetch barber name via the queue service projection in GetChairs
                var chairs = await _queue.GetChairsForBranchAsync(created.BranchId);
                var match = chairs.FirstOrDefault(c => c.Id == created.Id);
                if (match != null)
                    return Ok(match);
            }

            return Ok(created);
        }

        //[Authorize(Roles = "Admin,BranchManager")]
        [HttpDelete("chairs/{id}")]
        public async Task<IActionResult> DeleteChair(int id)
            => Ok(await _queue.DeleteChairAsync(id));

        //[Authorize(Roles = "Admin,BranchManager")]
        [HttpPost("enqueue")]
        public async Task<IActionResult> Enqueue([FromBody] EnqueueDto dto)
        {
            await _queue.EnqueueBookingAsync(dto);
            return Ok(new { message = "Enqueued" });
        }

        [HttpGet("queue/{branchId}")]
        public async Task<IActionResult> GetQueue(int branchId)
            => Ok(await _queue.GetQueueForBranchAsync(branchId));

        //[Authorize(Roles = "Admin,BranchManager")]
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignDto dto)
        {
            await _queue.AssignBookingToChairAsync(dto);
            return Ok(new { message = "Assigned" });
        }

        //[Authorize(Roles = "Admin,BranchManager")]
        [HttpPost("complete/{chairId}")]
        public async Task<IActionResult> Complete(int chairId)
            => Ok(await _queue.CompleteChairBookingAsync(chairId));
    }
}
