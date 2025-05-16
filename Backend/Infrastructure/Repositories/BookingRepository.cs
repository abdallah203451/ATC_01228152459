using Core.Domain.Entities;
using Core.Domain.Repositories;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _context.Bookings
                .Include(b => b.Event)
                .Include(b => b.User)
                .ToListAsync();
        }

        public async Task<Booking?> GetByIdAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.Event)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(string userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.Event)
                .ThenInclude(b => b.EventTags)
                .ThenInclude(b => b.Tag)
				.ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByEventIdAsync(int eventId)
        {
            return await _context.Bookings
                .Where(b => b.EventId == eventId)
                .Include(b => b.User)
                .ToListAsync();
        }

        public async Task<Booking> AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            return booking;
        }

        public async Task UpdateAsync(Booking booking)
        {
            _context.Entry(booking).State = EntityState.Modified;
        }

        public async Task DeleteAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking != null)
            {
                _context.Bookings.Remove(booking);
            }
        }

		public async Task CancelAsync(int id)
		{
			var booking = await _context.Bookings.FindAsync(id);
			if (booking != null)
			{
				booking.BookingStatus = "Cancelled";
				_context.Entry(booking).State = EntityState.Modified;
			}
		}

		public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Bookings.AnyAsync(b => b.Id == id);
        }
    }
} 