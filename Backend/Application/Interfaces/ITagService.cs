using Application.DTOs;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ITagService
    {
        Task<ApiResponse> GetAllTagsAsync();
        Task<ApiResponse> GetTagByIdAsync(int id);
        Task<ApiResponse> CreateTagAsync(CreateTagDTO createTagDto);
        Task<ApiResponse> UpdateTagAsync(int id, UpdateTagDTO updateTagDto);
        Task<ApiResponse> DeleteTagAsync(int id);
    }
} 