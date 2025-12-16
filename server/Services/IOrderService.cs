// backend/Services/IOrderService.cs
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);
        Task<OrderDto?> GetByIdAsync(int id);
        Task<List<OrderDto>> GetAllAsync();
        Task<List<OrderDto>> GetByUserAsync(string userId);
        Task<bool> UpdateStatusAsync(int id, string newStatus);
        Task<bool> DeleteAsync(int id);
    }
}
