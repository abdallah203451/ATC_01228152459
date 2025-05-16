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
    public class TagService : ITagService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
        private readonly string _cacheKeyPrefix = "TagService_";

        public TagService(IUnitOfWork unitOfWork, IMapper mapper, IDistributedCache cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
        }

        public async Task<ApiResponse> GetAllTagsAsync()
        {
            try
            {
                string cacheKey = $"{_cacheKeyPrefix}GetAllTags";
                string? cachedData = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedData))
                {
                    var cachedTags = JsonSerializer.Deserialize<List<TagDTO>>(cachedData);
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Tags retrieved from cache successfully",
                        Data = cachedTags
                    };
                }

                var tags = await _unitOfWork.Tags.GetAllAsync();
                var tagDtos = _mapper.Map<List<TagDTO>>(tags);

                // Cache the result
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                };
                
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(tagDtos), cacheOptions);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Tags retrieved successfully",
                    Data = tagDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving tags",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetTagByIdAsync(int id)
        {
            try
            {
                string cacheKey = $"{_cacheKeyPrefix}GetTagById_{id}";
                string? cachedData = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedData))
                {
                    var cachedTag = JsonSerializer.Deserialize<TagDTO>(cachedData);
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Tag retrieved from cache successfully",
                        Data = cachedTag
                    };
                }

                var tag = await _unitOfWork.Tags.GetByIdAsync(id);
                if (tag == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                var tagDto = _mapper.Map<TagDTO>(tag);

                // Cache the result
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                };
                
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(tagDto), cacheOptions);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Tag retrieved successfully",
                    Data = tagDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving tag",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> CreateTagAsync(CreateTagDTO createTagDto)
        {
            try
            {
                // Check if tag with the same name already exists
                var existingTag = await _unitOfWork.Tags.GetByNameAsync(createTagDto.Name);
                if (existingTag != null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Tag with the same name already exists"
                    };
                }

                var tag = _mapper.Map<Tag>(createTagDto);
                
                var addedTag = await _unitOfWork.Tags.AddAsync(tag);
                await _unitOfWork.SaveChangesAsync();

                // Clear relevant caches
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllTags");

                return new ApiResponse
                {
                    Success = true,
                    Message = "Tag created successfully",
                    Data = _mapper.Map<TagDTO>(addedTag)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error creating tag",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> UpdateTagAsync(int id, UpdateTagDTO updateTagDto)
        {
            try
            {
                var tag = await _unitOfWork.Tags.GetByIdAsync(id);
                if (tag == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                // Check if tag with the same name already exists (but not this one)
                var existingTag = await _unitOfWork.Tags.GetByNameAsync(updateTagDto.Name);
                if (existingTag != null && existingTag.Id != id)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Tag with the same name already exists"
                    };
                }

                _mapper.Map(updateTagDto, tag);
                
                await _unitOfWork.Tags.UpdateAsync(tag);
                await _unitOfWork.SaveChangesAsync();

                // Clear relevant caches
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllTags");
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetTagById_{id}");

                return new ApiResponse
                {
                    Success = true,
                    Message = "Tag updated successfully",
                    Data = _mapper.Map<TagDTO>(tag)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error updating tag",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> DeleteTagAsync(int id)
        {
            try
            {
                if (!await _unitOfWork.Tags.ExistsAsync(id))
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Tag not found"
                    };
                }

                // Check if tag is associated with any events
                var eventTags = await _unitOfWork.EventTags.GetByTagIdAsync(id);
                if (eventTags.Any())
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Cannot delete tag because it is associated with events"
                    };
                }

                await _unitOfWork.Tags.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                // Clear relevant caches
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllTags");
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetTagById_{id}");

                return new ApiResponse
                {
                    Success = true,
                    Message = "Tag deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting tag",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
} 