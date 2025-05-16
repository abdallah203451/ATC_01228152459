using Core.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Domain.Repositories
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetAllAsync();
        Task<Booking?> GetByIdAsync(int id);
        Task<IEnumerable<Booking>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Booking>> GetByEventIdAsync(int eventId);
        Task<Booking> AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task CancelAsync(int id);

	}
} 