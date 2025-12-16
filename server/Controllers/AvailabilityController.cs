using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAvailabilityService _availabilityService;

        public AvailabilityController(IAvailabilityService availabilityService)
        {
            _availabilityService = availabilityService;
        }

        [HttpGet("barbers")]
        public async Task<IActionResult> GetAvailableBarbers(
    int branchId,
    DateTime date,
    string time)
        {
            if (!TimeSpan.TryParse(time, out TimeSpan parsedTime))
            {
                return BadRequest(new { message = "Invalid time format. Use HH:mm like 14:00" });
            }

            var result = await _availabilityService
                .GetAvailableBarbersAsync(branchId, date, parsedTime);

            return Ok(result);
        }   
    }
}
