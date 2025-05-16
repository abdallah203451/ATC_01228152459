using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Core.Domain.Entities;
using Core.Domain.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
        private readonly string _cacheKeyPrefix = "CategoryService_";

        public CategoryService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IDistributedCache cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ApiResponse> GetAllCategoriesAsync()
        {
            try
            {
                // Try to get from cache first
                string cacheKey = $"{_cacheKeyPrefix}GetAllCategories";
                var cachedCategories = await _cache.GetStringAsync(cacheKey);
                
                if (!string.IsNullOrEmpty(cachedCategories))
                {
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Categories retrieved from cache successfully",
                        Data = JsonSerializer.Deserialize<IEnumerable<CategoryDTO>>(cachedCategories)
                    };
                }
                
                // If not in cache, get from database
                var categories = await _unitOfWork.Categories.GetAllAsync();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDTO>>(categories);
                
                // Store in cache
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                
                await _cache.SetStringAsync(
                    cacheKey,
                    JsonSerializer.Serialize(categoryDtos),
                    cacheOptions);
                
                return new ApiResponse
                {
                    Success = true,
                    Message = "Categories retrieved successfully",
                    Data = categoryDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving categories",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetCategoryByIdAsync(int id)
        {
            try
            {
                string cacheKey = $"{_cacheKeyPrefix}GetCategoryById_{id}";
                var cachedCategory = await _cache.GetStringAsync(cacheKey);
                
                if (!string.IsNullOrEmpty(cachedCategory))
                {
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Category retrieved from cache successfully",
                        Data = JsonSerializer.Deserialize<CategoryDTO>(cachedCategory)
                    };
                }
                
                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }
                
                var categoryDto = _mapper.Map<CategoryDTO>(category);
                
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                
                await _cache.SetStringAsync(
                    cacheKey,
                    JsonSerializer.Serialize(categoryDto),
                    cacheOptions);
                
                return new ApiResponse
                {
                    Success = true,
                    Message = "Category retrieved successfully",
                    Data = categoryDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving category",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> CreateCategoryAsync(CreateCategoryDTO categoryDto)
        {
            try
            {
                // Check if category with the same name already exists
                var existingCategory = await _unitOfWork.Categories.GetByNameAsync(categoryDto.Name);
                if (existingCategory != null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Category with the same name already exists"
                    };
                }
                
                var category = _mapper.Map<Category>(categoryDto);
                category.CreatedAt = DateTime.UtcNow;
                
                var createdCategory = await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.SaveChangesAsync();
                
                // Invalidate cache
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllCategories");
                
                return new ApiResponse
                {
                    Success = true,
                    Message = "Category created successfully",
                    Data = _mapper.Map<CategoryDTO>(createdCategory)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error creating category",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> UpdateCategoryAsync(int id, UpdateCategoryDTO categoryDto)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }
                
                // Check if category with the same name already exists (but not this one)
                var existingCategory = await _unitOfWork.Categories.GetByNameAsync(categoryDto.Name);
                if (existingCategory != null && existingCategory.Id != id)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Category with the same name already exists"
                    };
                }
                
                _mapper.Map(categoryDto, category);
                category.UpdatedAt = DateTime.UtcNow;
                
                await _unitOfWork.Categories.UpdateAsync(category);
                await _unitOfWork.SaveChangesAsync();
                
                // Invalidate cache
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllCategories");
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetCategoryById_{id}");
                
                return new ApiResponse
                {
                    Success = true,
                    Message = "Category updated successfully",
                    Data = _mapper.Map<CategoryDTO>(category)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error updating category",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> DeleteCategoryAsync(int id)
        {
            try
            {
                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Category not found"
                    };
                }
                
                // Check if the category is being used by any events
                var eventsWithCategory = await _unitOfWork.Events.GetByCategoryIdAsync(category.Id);
                if (eventsWithCategory.Any())
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Cannot delete category because it is being used by events"
                    };
                }
                
                await _unitOfWork.Categories.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();
                
                // Invalidate cache
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllCategories");
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetCategoryById_{id}");
                
                return new ApiResponse
                {
                    Success = true,
                    Message = "Category deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting category",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}