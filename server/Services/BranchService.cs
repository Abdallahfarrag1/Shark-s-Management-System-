
using backend.Models;
using backend.Services;
using BarberBooking.API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace BarberBooking.API.Services;

public class BranchService : IBranchService
{
    private readonly AppDbContext _db;
    private readonly IPhotoService _photo;
    private readonly UserManager<ApplicationUser> _userManager;

    public BranchService(AppDbContext db, IPhotoService photo, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _photo = photo;
        _userManager = userManager;
    }
    public async Task<BranchDto> CreateAsync(CreateBranchDto dto)
    {
        // 1) Create the branch entity
        var ent = new Branch
        {
            Name = dto.Name,
            Location = dto.Location,
            ManagerId = dto.ManagerId
        };

        // 2) Upload Image
        if (dto.Image != null)
        {
            var upload = await _photo.AddPhotoAsync(dto.Image);
            ent.ImageUrl = upload.Url.ToString();
        }

        _db.Add(ent);
        await _db.SaveChangesAsync();

        // 🔥 IMPORTANT:
        // 3) Assign the manager role & set branch id
        if (!string.IsNullOrEmpty(dto.ManagerId))
        {
            var manager = await _userManager.FindByIdAsync(dto.ManagerId);

            if (manager != null)
            {
                // Remove old roles if needed
                var roles = await _userManager.GetRolesAsync(manager);

                // Remove all roles except Admin (just to be safe)
                foreach (var role in roles)
                {
                    if (role != "Admin")
                        await _userManager.RemoveFromRoleAsync(manager, role);
                }

                // Assign BranchManager role
                await _userManager.AddToRoleAsync(manager, "BranchManager");

                // Update manager branch assignment
                manager.BranchId = ent.Id;

                await _userManager.UpdateAsync(manager);
            }
        }

        // 4) Return response DTO
        return new BranchDto
        {
            Id = ent.Id,
            Name = ent.Name,
            Location = ent.Location,
            ManagerId = ent.ManagerId,
            ImageUrl = ent.ImageUrl
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return false;
        _db.Branches.Remove(b);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BranchDto>> GetAllAsync()
    {
        return await _db.Branches
            .Select(b => new BranchDto
            {
                Id = b.Id,
                Name = b.Name,
                Location = b.Location,
                ManagerId = b.ManagerId,
                ImageUrl = b.ImageUrl
            })
            .ToListAsync();
    }
    public async Task<BranchDto?> GetByIdAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return null;
        return new BranchDto
        {
            Id = b.Id,
            Name = b.Name,
            Location = b.Location,
            ManagerId = b.ManagerId,
            ImageUrl = b.ImageUrl
        };
    }

    public async Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto)
    {
        var branch = await _db.Branches.FindAsync(id);
        if (branch == null) return null;

        branch.Name = dto.Name;
        branch.Location = dto.Location;

        // ================================
        // 📌 تحديث صورة الفرع
        // ================================
        if (dto.Image != null)
        {
            if (!string.IsNullOrEmpty(branch.ImageUrl))
            {
                var publicId = branch.ImageUrl.Split('/').Last().Split('.').First();
                await _photo.DeletePhotoAsync(publicId);
            }

            var upload = await _photo.AddPhotoAsync(dto.Image);
            branch.ImageUrl = upload.SecureUrl.ToString();
        }

        // ================================
        // 📌 تحديث المدير (ManagerId)
        // ================================
        if (dto.ManagerId != branch.ManagerId)
        {
            // 1) شيل دور BranchManager من المدير القديم
            if (branch.ManagerId != null)
            {
                var oldManager = await _userManager.FindByIdAsync(branch.ManagerId);
                if (oldManager != null)
                {
                    await _userManager.RemoveFromRoleAsync(oldManager, "BranchManager");
                    oldManager.BranchId = null;
                    await _userManager.UpdateAsync(oldManager);
                }
            }

            // 2) أضف المدير الجديد
            if (dto.ManagerId != null)
            {
                var newManager = await _userManager.FindByIdAsync(dto.ManagerId);
                if (newManager != null)
                {
                    await _userManager.AddToRoleAsync(newManager, "BranchManager");

                    newManager.BranchId = branch.Id;
                    await _userManager.UpdateAsync(newManager);
                }
            }

            branch.ManagerId = dto.ManagerId;
        }

        await _db.SaveChangesAsync();

        return new BranchDto
        {
            Id = branch.Id,
            Name = branch.Name,
            Location = branch.Location,
            ManagerId = branch.ManagerId,
            ImageUrl = branch.ImageUrl
        };
    }

}
