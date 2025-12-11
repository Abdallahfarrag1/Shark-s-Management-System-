using backend.Services;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IBookingService _bookingService;

        public UserDataController(IOrderService orderService, IBookingService bookingService)
        {
            _orderService = orderService;
            _bookingService = bookingService;
        }

        // GET api/userdata/user/{userId} -> { orders: [], bookings: [] }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersAndBookingsForUser(string userId)
        {
            var orders = await _orderService.GetByUserAsync(userId);
            var bookings = await _bookingService.GetByUserAsync(userId);

            return Ok(new { orders, bookings });
        }

        // GET api/userdata/orders -> all orders (public)
        [HttpGet("orders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        // GET api/userdata/bookings -> all bookings (public)
        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllAsync();
            return Ok(bookings);
        }
    }
}
