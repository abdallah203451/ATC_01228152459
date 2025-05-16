using Application.DTOs;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IBookingService
    {
        Task<ApiResponse> GetAllBookingsAsync();
        Task<ApiResponse> GetBookingByIdAsync(int id);
        Task<ApiResponse> GetUserBookingsAsync(string userId);
        Task<ApiResponse> GetEventBookingsAsync(int eventId);
        Task<ApiResponse> CreateBookingAsync(string userId, CreateBookingDTO createBookingDto);
        Task<ApiResponse> UpdateBookingAsync(int id, string userId, UpdateBookingDTO updateBookingDto);
        Task<ApiResponse> CancelBookingAsync(int id, string userId);
    }
} 