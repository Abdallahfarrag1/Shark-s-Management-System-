// backend/Controllers/FeedbackController.cs
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _service;

        public FeedbackController(IFeedbackService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateFeedbackDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            var ok = await _service.AddFeedbackAsync(dto, ip);

            if (!ok)
                return BadRequest(new { message = "You can only submit feedback once every 24 hours" });

            return Ok(new { message = "Feedback submitted successfully" });
        }
    }
}
