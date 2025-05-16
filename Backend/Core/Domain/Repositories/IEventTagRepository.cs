using Core.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface IEventTagRepository
    {
        Task<IEnumerable<EventTag>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<EventTag>> GetByTagIdAsync(int tagId);
        Task AddAsync(EventTag eventTag);
        Task RemoveAsync(int eventId, int tagId);
        Task<bool> ExistsAsync(int eventId, int tagId);
    }
} 