using BarberBooking.API.DTOs;
using BarberBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BarberBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BranchController : ControllerBase
{
    private readonly IBranchService _branchService;

    public BranchController(IBranchService branchService)
    {
        _branchService = branchService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _branchService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _branchService.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateBranchDto dto)
    {
        var created = await _branchService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }
    [Authorize(Roles = "Admin,BranchManager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateBranchDto dto)
    {
        var user = HttpContext.User;

        // لو BranchManager
        if (user.IsInRole("BranchManager"))
        {
            var userBranchId = user.FindFirst("BranchId")?.Value;

            if (userBranchId == null || userBranchId != id.ToString())
                return Forbid(); // ممنوع يغير فرع مش بتاعه
        }

        var result = await _branchService.UpdateAsync(id, dto);
        return result == null ? NotFound() : Ok(result);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return await _branchService.DeleteAsync(id) ? Ok(new { message = "Deleted" }) : NotFound();
    }
}