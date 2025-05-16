using Core.Domain.Entities;
using Core.Domain.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class TagRepository : ITagRepository
    {
        private readonly ApplicationDbContext _context;

        public TagRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tag>> GetAllAsync()
        {
            return await _context.Tags.ToListAsync();
        }

        public async Task<Tag?> GetByIdAsync(int id)
        {
            return await _context.Tags.FindAsync(id);
        }

        public async Task<Tag?> GetByNameAsync(string name)
        {
            return await _context.Tags.FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower());
        }

        public async Task<Tag> AddAsync(Tag tag)
        {
            await _context.Tags.AddAsync(tag);
            return tag;
        }

        public async Task UpdateAsync(Tag tag)
        {
            _context.Entry(tag).State = EntityState.Modified;
        }

        public async Task DeleteAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag != null)
            {
                _context.Tags.Remove(tag);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Tags.AnyAsync(t => t.Id == id);
        }
    }
} 