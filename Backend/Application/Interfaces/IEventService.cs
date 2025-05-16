using Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEventService
    {
        Task<ApiResponse> GetAllEventsAsync();
        Task<ApiResponse> GetEventByIdAsync(int id);
        Task<ApiResponse> GetEventsByCategoryAsync(int categoryId);
        Task<ApiResponse> GetEventsByTagIdAsync(int tagId);
		Task<ApiResponse> GetPaginatedEventsAsync(int pageNumber,int pageSize,string? search,string? category);
		Task<ApiResponse> CreateEventAsync(CreateEventDTO createEventDto);
        Task<ApiResponse> UpdateEventAsync(int id, UpdateEventDTO updateEventDto);
        Task<ApiResponse> DeleteEventAsync(int id);
        Task<ApiResponse> UploadEventImageAsync(int id, string imageUrl);
    }
} 