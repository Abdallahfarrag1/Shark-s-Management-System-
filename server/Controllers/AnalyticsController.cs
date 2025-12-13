using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analytics;

        public AnalyticsController(IAnalyticsService analytics)
        {
            _analytics = analytics;
        }

        [HttpGet("branch/{branchId}")]
        public async Task<IActionResult> GetBranchAnalytics(int branchId, [FromQuery] int days = 7)
        {
            if (days <= 0) days = 7;
            var result = await _analytics.GetBranchAnalyticsAsync(branchId, days);
            return Ok(result);
        }
    }
}
