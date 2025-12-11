using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IQueueService
    {
        Task<List<ChairDto>> GetChairsForBranchAsync(int branchId);
        Task<ChairDto> CreateChairAsync(CreateChairDto dto);
        Task<bool> DeleteChairAsync(int id);

        Task EnqueueBookingAsync(EnqueueDto dto);
        Task<List<QueueItemDto>> GetQueueForBranchAsync(int branchId);

        Task<bool> AssignBookingToChairAsync(AssignDto dto);

        Task<CompleteResultDto> CompleteChairBookingAsync(int chairId);
    }
}
