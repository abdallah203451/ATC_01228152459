using Core.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<IEnumerable<Event>> GetPaginatedAsync(int pageNumber, int pageSize, string? search, string? category);
        Task<Event?> GetByIdAsync(int id);
        Task<IEnumerable<Event>> GetByUserIdAsync(string userId);
		Task<IEnumerable<Event>> GetByCategoryIdAsync(int categoryId);
		Task<IEnumerable<Event>> GetByTagIdAsync(int tagId);
        Task<Event> AddAsync(Event @event);
        Task UpdateAsync(Event @event);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<int> CountAsync(string? search, string? category);
    }
} 