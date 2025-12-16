using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly IServiceService _serviceService;
    public ServiceController(IServiceService serviceService) => _serviceService = serviceService;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _serviceService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var r = await _serviceService.GetByIdAsync(id);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateServiceDto dto)
    {
        var c = await _serviceService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = c.Id }, c);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, UpdateServiceDto dto)
    {
        var r = await _serviceService.UpdateAsync(id, dto);
        return r == null ? NotFound() : Ok(r);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
        => await _serviceService.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
}