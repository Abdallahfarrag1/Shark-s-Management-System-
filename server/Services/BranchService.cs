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
                // If this manager is already assigned to another branch, clear that branch.ManagerId
                var prevBranch = await _db.Branches.FirstOrDefaultAsync(b => b.ManagerId == manager.Id && b.Id != ent.Id);
                if (prevBranch != null)
                {
                    prevBranch.ManagerId = null;
                    _db.Branches.Update(prevBranch);
                }

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

        await _db.SaveChangesAsync();

        // 4) Return response DTO including manager email
        string? managerEmail = null;
        if (!string.IsNullOrEmpty(ent.ManagerId))
        {
            var mgr = await _db.Users.FindAsync(ent.ManagerId);
            managerEmail = mgr?.Email;
        }

        return new BranchDto
        {
            Id = ent.Id,
            Name = ent.Name,
            Location = ent.Location,
            ManagerId = ent.ManagerId,
            ImageUrl = ent.ImageUrl,
            ManagerEmail = managerEmail
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        // Perform cascade delete silently
        using var trx = await _db.Database.BeginTransactionAsync();

        var branch = await _db.Branches.FindAsync(id);
        if (branch == null) return false;

        // Unassign manager and remove BranchManager role
        if (!string.IsNullOrEmpty(branch.ManagerId))
        {
            var manager = await _userManager.FindByIdAsync(branch.ManagerId);
            if (manager != null)
            {
                await _userManager.RemoveFromRoleAsync(manager, "BranchManager");
                manager.BranchId = null;
                await _userManager.UpdateAsync(manager);
            }
        }

        // Delete queue items
        var queueItems = _db.QueueItems.Where(q => q.BranchId == id);
        _db.QueueItems.RemoveRange(queueItems);

        // Delete barber schedules for barbers in this branch
        var barberIds = await _db.Barbers.Where(b => b.BranchId == id).Select(b => b.Id).ToListAsync();
        var schedules = _db.BarberSchedules.Where(s => barberIds.Contains(s.BarberId) || s.BranchId == id);
        _db.BarberSchedules.RemoveRange(schedules);

        // Delete barbers
        var barbers = _db.Barbers.Where(b => b.BranchId == id);
        _db.Barbers.RemoveRange(barbers);

        // Delete chairs
        var chairs = _db.Chairs.Where(c => c.BranchId == id);
        _db.Chairs.RemoveRange(chairs);

        // Delete bookings
        var bookings = _db.Bookings.Where(b => b.BranchId == id);
        _db.Bookings.RemoveRange(bookings);

        // Delete feedbacks
        var feedbacks = _db.Feedbacks.Where(f => f.BranchId == id);
        _db.Feedbacks.RemoveRange(feedbacks);

        // Finally delete the branch
        _db.Branches.Remove(branch);

        await _db.SaveChangesAsync();
        await trx.CommitAsync();
        return true;
    }

    public async Task<bool> ForceDeleteAsync(int id)
    {
        // ForceDelete does same as DeleteAsync for now
        return await DeleteAsync(id);
    }

    public async Task<List<BranchDto>> GetAllAsync()
    {
        var branches = await _db.Branches.ToListAsync();
        var managerIds = branches.Where(b => b.ManagerId != null).Select(b => b.ManagerId!).Distinct().ToList();
        var users = await _db.Users.Where(u => managerIds.Contains(u.Id)).ToListAsync();
        var userById = users.ToDictionary(u => u.Id, u => u.Email);

        return branches.Select(b => new BranchDto
        {
            Id = b.Id,
            Name = b.Name,
            Location = b.Location,
            ManagerId = b.ManagerId,
            ImageUrl = b.ImageUrl,
            ManagerEmail = b.ManagerId != null && userById.ContainsKey(b.ManagerId) ? userById[b.ManagerId] : null
        }).ToList();
    }
    public async Task<BranchDto?> GetByIdAsync(int id)
    {
        var b = await _db.Branches.FindAsync(id);
        if (b == null) return null;

        string? managerEmail = null;
        if (!string.IsNullOrEmpty(b.ManagerId))
        {
            var mgr = await _db.Users.FindAsync(b.ManagerId);
            managerEmail = mgr?.Email;
        }

        return new BranchDto
        {
            Id = b.Id,
            Name = b.Name,
            Location = b.Location,
            ManagerId = b.ManagerId,
            ImageUrl = b.ImageUrl,
            ManagerEmail = managerEmail
        };
    }

    public async Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto)
    {
        const int maxAttempts = 3;

        for (int attempt = 0; attempt < maxAttempts; attempt++)
        {
            // Fetch fresh branch for each attempt
            var branch = await _db.Branches.FindAsync(id);
            if (branch == null) return null;

            branch.Name = dto.Name;
            branch.Location = dto.Location;

            // ================================
            // 📌 update image
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
            // 📌 update ManagerId
            // ================================
            if (dto.ManagerId != branch.ManagerId)
            {
                // 1) remove BranchManager role from old manager
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

                // 2) add new manager
                if (dto.ManagerId != null)
                {
                    var newManager = await _userManager.FindByIdAsync(dto.ManagerId);
                    if (newManager != null)
                    {
                        // If this manager currently manages another branch, clear that previous assignment
                        var prevBranch = await _db.Branches.FirstOrDefaultAsync(b => b.ManagerId == newManager.Id && b.Id != branch.Id);
                        if (prevBranch != null)
                        {
                            prevBranch.ManagerId = null;
                            _db.Branches.Update(prevBranch);
                        }

                        await _userManager.AddToRoleAsync(newManager, "BranchManager");

                        newManager.BranchId = branch.Id;
                        await _userManager.UpdateAsync(newManager);
                    }
                }

                branch.ManagerId = dto.ManagerId;
            }

            try
            {
                await _db.SaveChangesAsync();

                // prepare manager email
                string? managerEmail = null;
                if (!string.IsNullOrEmpty(branch.ManagerId))
                {
                    var mgr = await _db.Users.FindAsync(branch.ManagerId);
                    managerEmail = mgr?.Email;
                }

                return new BranchDto
                {
                    Id = branch.Id,
                    Name = branch.Name,
                    Location = branch.Location,
                    ManagerId = branch.ManagerId,
                    ImageUrl = branch.ImageUrl,
                    ManagerEmail = managerEmail
                };
            }
            catch (DbUpdateConcurrencyException ex) when (attempt < maxAttempts - 1)
            {
                // reload conflicting entries and retry
                foreach (var entry in ex.Entries)
                {
                    try { await entry.ReloadAsync(); } catch { }
                }
                // small delay to reduce contention
                await Task.Delay(50);
                continue; // retry
            }
        }

        // if we reach here something went wrong after retries
        throw new DbUpdateConcurrencyException("Could not update branch due to concurrent updates. Please retry.");
    }

}
