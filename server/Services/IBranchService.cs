using BarberBooking.API.DTOs;

namespace BarberBooking.API.Services;

public interface IBranchService
{
    Task<List<BranchDto>> GetAllAsync();
    Task<BranchDto?> GetByIdAsync(int id);
    Task<BranchDto> CreateAsync(CreateBranchDto dto);
    Task<BranchDto?> UpdateAsync(int id, UpdateBranchDto dto);
    Task<bool> DeleteAsync(int id);
}
