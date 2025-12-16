// backend/Services/IFeedbackService.cs
using backend.DTOs;
using backend.Models;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IFeedbackService
    {
        Task<bool> AddFeedbackAsync(CreateFeedbackDto dto, string ipAddress);
    }
}
