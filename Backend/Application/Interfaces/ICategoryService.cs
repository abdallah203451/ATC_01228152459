using Application.DTOs;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse> GetAllCategoriesAsync();
        Task<ApiResponse> GetCategoryByIdAsync(int id);
        Task<ApiResponse> CreateCategoryAsync(CreateCategoryDTO categoryDto);
        Task<ApiResponse> UpdateCategoryAsync(int id, UpdateCategoryDTO categoryDto);
        Task<ApiResponse> DeleteCategoryAsync(int id);
    }
}