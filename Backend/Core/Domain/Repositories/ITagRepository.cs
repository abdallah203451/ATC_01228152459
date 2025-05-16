using Core.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface ITagRepository
    {
        Task<IEnumerable<Tag>> GetAllAsync();
        Task<Tag?> GetByIdAsync(int id);
        Task<Tag?> GetByNameAsync(string name);
        Task<Tag> AddAsync(Tag tag);
        Task UpdateAsync(Tag tag);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 