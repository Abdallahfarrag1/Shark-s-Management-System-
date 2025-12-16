using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sharks.Services;
using PayPalHttp;
using backend.Models;

namespace Sharks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PayPalController : ControllerBase
    {
        private readonly PayPalService _paypal;
        private readonly AppDbContext _db;

        public PayPalController(PayPalService paypal, AppDbContext db)
        {
            _paypal = paypal;
            _db = db;
        }


        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
        {
            if (req.Amount <= 0)
                return BadRequest(new { message = "Amount must be greater than 0" });

            try
            {
                var order = await _paypal.CreateOrder(req.Amount, req.Currency ?? "USD");

                if (req.BookingId.HasValue)
                {
                    var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
                    if (booking != null)
                    {
                        booking.PaymentOrderId = order.Id;
                        booking.Status = "PendingPayment";
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        return NotFound(new { message = "Booking not found" });
                    }
                }

                var approvalUrl = order.Links.FirstOrDefault(x => x.Rel == "approve")?.Href;

                return Ok(new { orderId = order.Id, approvalUrl });
            }
            catch (HttpException ex)
            {
                return StatusCode((int)ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("return")]
        public async Task<IActionResult> PayPalReturn([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token)) return BadRequest("Token missing");
            try
            {
                var orderDetails = await _paypal.GetOrderDetails(token);
                if (orderDetails.Status == "COMPLETED")
                    return Ok(new { message = "Order already completed", orderDetails });

                var result = await _paypal.CaptureOrder(token);
                return Ok(new { message = "Payment captured successfully", data = result });
            }
            catch (HttpException ex)
            {
                return StatusCode((int)ex.StatusCode, new { message = ex.Message });
            }
        }

        [HttpGet("cancel")]
        public IActionResult PayPalCancel()
        {
            return Ok(new { message = "Payment was cancelled" });
        }

        [HttpPost("capture-order/{orderId}")]
        public async Task<IActionResult> CaptureOrder(string orderId, [FromBody] CaptureOrderRequest req)
        {
            if (string.IsNullOrEmpty(orderId)) return BadRequest(new { message = "OrderId is required" });

            try
            {
                var result = await _paypal.CaptureOrder(orderId);

                if (req.BookingId.HasValue)
                {
                    var booking = await _db.Bookings.FindAsync(req.BookingId.Value);
                    if (booking != null)
                    {
                        booking.Status = "Confirmed";
                        booking.PaymentCapturedId = orderId;
                        await _db.SaveChangesAsync();
                    }
                    else
                    {
                        return NotFound(new { message = "Booking not found" });
                    }
                }
                return Ok(result);
            }
            catch (HttpException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
                {
                    return BadRequest(new { message = "Payment not approved yet.", details = ex.Message });
                }
                return StatusCode((int)ex.StatusCode, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
        public string? Currency { get; set; }
        public int? BookingId { get; set; }
    }

    public class CaptureOrderRequest
    {
        public int? BookingId { get; set; }
    }
}