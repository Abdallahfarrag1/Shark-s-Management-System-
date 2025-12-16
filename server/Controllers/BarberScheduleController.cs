using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BarberScheduleController : ControllerBase
    {
        private readonly IBarberScheduleService _service;

        public BarberScheduleController(IBarberScheduleService service)
        {
            _service = service;
        }

        [HttpGet("{barberId}")]
        public async Task<IActionResult> GetWeekly(int barberId)
        {
            var result = await _service.GetWeeklySchedule(barberId);
            return Ok(result);
        }

        [HttpPut("{barberId}")]
        public async Task<IActionResult> UpdateWeekly(int barberId, [FromBody] UpdateWeeklyScheduleDto dto)
        {
            var updated = await _service.UpdateWeeklySchedule(barberId, dto.Days);

            if (!updated)
                return NotFound(new { message = "Schedule not found" });

            return Ok(new { message = "Updated successfully" });
        }
    }
}
