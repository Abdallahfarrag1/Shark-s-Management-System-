using backend.Models;
using BarberBooking.API.DTOs;

using Microsoft.EntityFrameworkCore;

namespace BarberBooking.API.Services;

public class ServiceService : IServiceService
{
    private readonly AppDbContext _db;
    public ServiceService(AppDbContext db) => _db = db;

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var ent = new Service { Name = dto.Name, Price = dto.Price};
        _db.Services.Add(ent);
        await _db.SaveChangesAsync();
        return new ServiceDto { Id = ent.Id, Name = ent.Name, Price = ent.Price };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var s = await _db.Services.FindAsync(id);
        if (s == null) return false;
        _db.Services.Remove(s);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ServiceDto>> GetAllAsync()
    {
        return await _db.Services.Select(s => new ServiceDto { Id = s.Id, Name = s.Name, Price = s.Price }).ToListAsync();
    }

    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        var s = await _db.Services.FindAsync(id);
        if (s == null) return null;
        return new ServiceDto { Id = s.Id, Name = s.Name, Price = s.Price };
    }

    public async Task<ServiceDto?> UpdateAsync(int id, UpdateServiceDto dto)
    {
        var s = await _db.Services.FindAsync(id);
        if (s == null) return null;
        s.Name = dto.Name;
        s.Price = dto.Price;
       
        await _db.SaveChangesAsync();
        return new ServiceDto { Id = s.Id, Name = s.Name, Price = s.Price };
    }
}
