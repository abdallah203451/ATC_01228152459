using Core.Domain.Entities;
using Core.Domain.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class EventTagRepository : IEventTagRepository
    {
        private readonly ApplicationDbContext _context;

        public EventTagRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EventTag>> GetByEventIdAsync(int eventId)
        {
            return await _context.EventTags
                .Where(et => et.EventId == eventId)
                .Include(et => et.Tag)
                .ToListAsync();
        }

        public async Task<IEnumerable<EventTag>> GetByTagIdAsync(int tagId)
        {
            return await _context.EventTags
                .Where(et => et.TagId == tagId)
                .Include(et => et.Event)
                .ToListAsync();
        }

        public async Task AddAsync(EventTag eventTag)
        {
            await _context.EventTags.AddAsync(eventTag);
        }

        public async Task RemoveAsync(int eventId, int tagId)
        {
            var eventTag = await _context.EventTags
                .FirstOrDefaultAsync(et => et.EventId == eventId && et.TagId == tagId);
            
            if (eventTag != null)
            {
                _context.EventTags.Remove(eventTag);
            }
        }

        public async Task<bool> ExistsAsync(int eventId, int tagId)
        {
            return await _context.EventTags.AnyAsync(et => et.EventId == eventId && et.TagId == tagId);
        }
    }
} 