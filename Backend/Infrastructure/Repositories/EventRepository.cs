using Core.Domain.Entities;
using Core.Domain.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
				.Include(e => e.Categoryobj)
				.Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
                .ToListAsync();
		}

        public async Task<IEnumerable<Event>> GetPaginatedAsync(int pageNumber,int pageSize,string? search,string? category)
		{
			    // start with base query
		    var query = _context.Events
			    .Include(e => e.Categoryobj)
			    .Include(e => e.EventTags)
			    .ThenInclude(et => et.Tag)
			    .AsQueryable();

			if (!string.IsNullOrWhiteSpace(search))
		    {
		        var s = search.Trim().ToLower();
			    query = query.Where(e =>EF.Functions.Like(e.Name.ToLower(), $"%{s}%") || EF.Functions.Like(e.Description.ToLower(), $"%{s}%"));
			}

			if (!string.IsNullOrWhiteSpace(category) && category != "all")
			{
			    query = query.Where(e => e.Categoryobj.Id.ToString() == category);
		    }

			return await query
			    .Skip((pageNumber - 1) * pageSize)
			    .Take(pageSize)
			    .ToListAsync();
		}

		public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
				.Include(e => e.Categoryobj)
				.Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Event>> GetByUserIdAsync(string userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => b.Event)
				.Include(e => e.Categoryobj)
				.Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
                .Distinct()
                .ToListAsync();
        }

		public async Task<IEnumerable<Event>> GetByCategoryIdAsync(int categoryId)
		{
			return await _context.Events
				.Where(e => e.CategoryId == categoryId)
				.Include(e => e.Categoryobj)
				.Include(e => e.EventTags).ThenInclude(et => et.Tag)
				.ToListAsync();
		}

		public async Task<IEnumerable<Event>> GetByTagIdAsync(int tagId)
        {
            return await _context.EventTags
                .Where(et => et.TagId == tagId)
                .Select(et => et.Event)
				.Include(e => e.Categoryobj)
				.Include(e => e.EventTags)
                .ThenInclude(et => et.Tag)
                .ToListAsync();
        }

        public async Task<Event> AddAsync(Event @event)
        {
            await _context.Events.AddAsync(@event);
            return @event;
        }

        public async Task UpdateAsync(Event @event)
        {
            _context.Entry(@event).State = EntityState.Modified;
            @event.UpdatedAt = System.DateTime.UtcNow;
        }

        public async Task DeleteAsync(int id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event != null)
            {
                _context.Events.Remove(@event);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Events.AnyAsync(e => e.Id == id);
		}


		public async Task<int> CountAsync(string? search, string? category)
		{
			var query = _context.Events.AsQueryable();

			if (!string.IsNullOrWhiteSpace(search))
			{
				var s = search.Trim().ToLower();
				query = query.Where(e =>EF.Functions.Like(e.Name.ToLower(), $"%{s}%") || EF.Functions.Like(e.Description.ToLower(), $"%{s}%"));
			}

			if (!string.IsNullOrWhiteSpace(category) && category != "all")
			{
				query = query.Where(e => e.Categoryobj.Id.ToString() == category);
			}

			return await query.CountAsync();
		}
	}
} 