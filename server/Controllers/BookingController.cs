using backend.Models;
using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingDto dto)
    {
        var result = await _bookingService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var booking = await _bookingService.GetByIdAsync(id);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _bookingService.GetAllAsync());
    }

    // New endpoint: GET /api/all/bookings/{branchId}
    [HttpGet("~/api/all/bookings/{branchId}")]
    public async Task<IActionResult> GetByBranch(int branchId)
    {
        var bookings = await _bookingService.GetByBranchAsync(branchId);
        return Ok(bookings);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await _bookingService.DeleteAsync(id)
            ? Ok(new { message = "Booking deleted" })
            : NotFound();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateBookingStatusDto dto)
    {
        var result = await _bookingService.UpdateStatusAsync(id, dto.Status);
        return result == null ? NotFound() : Ok(result);
    }
}


