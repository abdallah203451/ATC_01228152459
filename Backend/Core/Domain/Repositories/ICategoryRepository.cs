using Core.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category> GetByIdAsync(int id);
        Task<Category> GetByNameAsync(string name);
        Task<Category> AddAsync(Category category);
        Task UpdateAsync(Category category);
        Task DeleteAsync(int id);
    }
}