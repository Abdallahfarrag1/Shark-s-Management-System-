// backend/Controllers/OrderController.cs
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Security.Claims;
using BarberBooking.API.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _svc;
        private readonly IBookingService _bookingService;

        public OrderController(IOrderService svc, IBookingService bookingService)
        {
            _svc = svc;
            _bookingService = bookingService;
        }

        // create order
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _svc.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        // get specific
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _svc.GetByIdAsync(id);
            return order == null ? NotFound() : Ok(order);
        }

        // get all (admin)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _svc.GetAllAsync());

        // get my orders
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Forbid();
            var list = await _svc.GetByUserAsync(userId);
            return Ok(list);
        }

        // get combined orders + bookings for a user (admin or owner)
        [Authorize]
        [HttpGet("user/{userId}/combined")]
        public async Task<IActionResult> GetOrdersAndBookingsForUser(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && currentUserId != userId) return Forbid();

            var orders = await _svc.GetByUserAsync(userId);
            var bookings = await _bookingService.GetByUserAsync(userId);

            return Ok(new { orders, bookings });
        }

        // update status (admin or owner)
        [Authorize]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            // allow admin or the owner
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var order = await _svc.GetByIdAsync(id);
            if (order == null) return NotFound();

            if (!isAdmin && order.UserId != userId) return Forbid();

            var ok = await _svc.UpdateStatusAsync(id, dto.Status);
            return ok ? Ok(new { message = "Status updated" }) : BadRequest(new { message = "Invalid status" });
        }

        // delete (admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
            => await _svc.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
    }
}
