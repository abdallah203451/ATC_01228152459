using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Core.Domain.Entities;
using Core.Domain.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.Services
{
    public class EventService : IEventService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
		private readonly IDatabase _redisDb;
		private readonly IServer _redisServer;
		private readonly IWebHostEnvironment _environment;
        private readonly string _cacheKeyPrefix = "EventService_";
		private readonly string _instanceName = "EventBookingSystem_";

		public EventService(IUnitOfWork unitOfWork, IMapper mapper, IDistributedCache cache, IConnectionMultiplexer redis, IWebHostEnvironment environment)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cache = cache;
			_redisDb = redis.GetDatabase();
			_redisServer = redis.GetServer(redis.GetEndPoints().First());
			_environment = environment;
        }

        public async Task<ApiResponse> GetAllEventsAsync()
        {
            try
            {
                string cacheKey = $"{_cacheKeyPrefix}GetAllEvents";
                string? cachedData = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedData))
                {
                    var cachedEvents = JsonSerializer.Deserialize<List<EventDTO>>(cachedData);
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Events retrieved from cache successfully",
                        Data = cachedEvents
                    };
                }

                var events = await _unitOfWork.Events.GetAllAsync();
                var eventListDtos = _mapper.Map<List<EventDTO>>(events);

                // Cache the result
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                
                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(eventListDtos), cacheOptions);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Events retrieved successfully",
                    Data = eventListDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving events",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetEventByIdAsync(int id)
        {
            try
            {
                var @event = await _unitOfWork.Events.GetByIdAsync(id);
                if (@event == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event not found"
                    };
                }

                var eventDto = _mapper.Map<EventDTO>(@event);

                // Cache the result
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };

                return new ApiResponse
                {
                    Success = true,
                    Message = "Event retrieved successfully",
                    Data = eventDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving event",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetEventsByCategoryAsync(int categoryId)
        {
			try
			{
				var events = await _unitOfWork.Events.GetByCategoryIdAsync(categoryId);
				var dtos = _mapper.Map<List<EventListDTO>>(events);
				return new ApiResponse { Success = true, Message = "OK", Data = dtos };
			}
			catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving events by category",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetEventsByTagIdAsync(int tagId)
        {
            try
            {
                var events = await _unitOfWork.Events.GetByTagIdAsync(tagId);
                var eventListDtos = _mapper.Map<List<EventListDTO>>(events);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Events retrieved successfully",
                    Data = eventListDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving events by tag",
                    Errors = new List<string> { ex.Message }
                };
            }
		}

        public async Task<ApiResponse> GetPaginatedEventsAsync(int pageNumber,int pageSize,string? search,string? category)
		{
            try
            {
				string cacheKey = $"{_cacheKeyPrefix}GetPaginatedEvents_{pageNumber}_{pageSize}_{search}_{category}";
				string? cachedData = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedData))
                {
                    var cachedResponse = JsonSerializer.Deserialize<PagedResponse<EventDTO>>(cachedData);
                    return new ApiResponse
                    {
                        Success = true,
                        Message = "Paginated events retrieved from cache successfully",
                        Data = cachedResponse
                    };
                }

				var events = await _unitOfWork.Events.GetPaginatedAsync(pageNumber, pageSize, search, category);
				var totalCount = await _unitOfWork.Events.CountAsync(search, category);
                
                var eventListDtos = _mapper.Map<List<EventDTO>>(events);
                
                var response = new PagedResponse<EventDTO>
                {
                    Items = eventListDtos,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };

                // Cache the result
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                };

				await _cache.SetStringAsync(cacheKey,JsonSerializer.Serialize(response),cacheOptions);

				return new ApiResponse
                {
                    Success = true,
                    Message = "Paginated events retrieved successfully",
                    Data = response
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving paginated events",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> CreateEventAsync(CreateEventDTO createEventDto)
        {
            try
            {
                var @event = _mapper.Map<Event>(createEventDto);
				@event.AvailableTickets = createEventDto.Capacity;

				// Handle image upload if provided
				if (createEventDto.Image != null && createEventDto.Image.Length > 0)
                {
                    var imageUrl = await ProcessImageUpload(createEventDto.Image);
                    if (!string.IsNullOrEmpty(imageUrl))
                    {
                        @event.ImageUrl = imageUrl;
                    }
                }
                
                var addedEvent = await _unitOfWork.Events.AddAsync(@event);
                await _unitOfWork.SaveChangesAsync();

                // Add the event tags
                foreach (var tagId in createEventDto.TagIds)
                {
                    var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                    if (tag != null)
                    {
                        var eventTag = new EventTag
                        {
                            EventId = addedEvent.Id,
                            TagId = tagId
                        };
                        
                        await _unitOfWork.EventTags.AddAsync(eventTag);
                    }
                }
                
                await _unitOfWork.SaveChangesAsync();

				// Clear all caches
				await ClearAllEventCacheAsync();

				return new ApiResponse
                {
                    Success = true,
                    Message = "Event created successfully",
                    Data = _mapper.Map<EventDTO>(addedEvent)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error creating event",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> UpdateEventAsync(int id, UpdateEventDTO updateEventDto)
        {
            try
            {
                var @event = await _unitOfWork.Events.GetByIdAsync(id);
                if (@event == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event not found"
                    };
                }

                _mapper.Map(updateEventDto, @event);
                @event.UpdatedAt = DateTime.UtcNow;
                
                // Handle image upload if provided
                if (updateEventDto.Image != null && updateEventDto.Image.Length > 0)
                {
                    var imageUrl = await ProcessImageUpload(updateEventDto.Image);
                    if (!string.IsNullOrEmpty(imageUrl))
                    {
                        @event.ImageUrl = imageUrl;
                    }
                }
                
                await _unitOfWork.Events.UpdateAsync(@event);

                // Update event tags
                // First, retrieve all existing tags
                var existingEventTags = await _unitOfWork.EventTags.GetByEventIdAsync(id);
                var existingTagIds = existingEventTags.Select(et => et.TagId).ToList();

                // Remove tags that are not in the updated list
                foreach (var existingTagId in existingTagIds)
                {
                    if (!updateEventDto.TagIds.Contains(existingTagId))
                    {
                        await _unitOfWork.EventTags.RemoveAsync(id, existingTagId);
                    }
                }

                // Add new tags that were not already assigned
                foreach (var tagId in updateEventDto.TagIds)
                {
                    if (!existingTagIds.Contains(tagId))
                    {
                        var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
                        if (tag != null)
                        {
                            var eventTag = new EventTag
                            {
                                EventId = id,
                                TagId = tagId
                            };
                            
                            await _unitOfWork.EventTags.AddAsync(eventTag);
                        }
                    }
                }
                
                await _unitOfWork.SaveChangesAsync();


				// Clear all caches
				await ClearAllEventCacheAsync();

				return new ApiResponse
                {
                    Success = true,
                    Message = "Event updated successfully",
                    Data = _mapper.Map<EventDTO>(@event)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error updating event",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> DeleteEventAsync(int id)
        {
            try
            {
                if (!await _unitOfWork.Events.ExistsAsync(id))
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event not found"
                    };
                }

                await _unitOfWork.Events.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

				// Clear all caches
				await ClearAllEventCacheAsync();

				return new ApiResponse
                {
                    Success = true,
                    Message = "Event deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error deleting event",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        // Private helper method to process image upload
        private async Task<string?> ProcessImageUpload(IFormFile file)
        {
            try
            {
                // Validate file extension
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!Array.Exists(allowedExtensions, ext => ext == extension))
                {
                    return null;
                }

                // Create uploads directory if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "events");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Create unique filename
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Return the relative image URL
                return $"/uploads/events/{uniqueFileName}";
            }
            catch (Exception)
            {
                // Log the exception if needed
                return null;
            }
        }

        // Keep this method for backward compatibility if needed
        public async Task<ApiResponse> UploadEventImageAsync(int id, string imageUrl)
        {
            try
            {
                var @event = await _unitOfWork.Events.GetByIdAsync(id);
                if (@event == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event not found"
                    };
                }

                @event.ImageUrl = imageUrl;
                @event.UpdatedAt = DateTime.UtcNow;
                
                await _unitOfWork.Events.UpdateAsync(@event);
                await _unitOfWork.SaveChangesAsync();

                // Clear relevant caches
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllEvents");
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetEventById_{id}");

                return new ApiResponse
                {
                    Success = true,
                    Message = "Event image uploaded successfully",
                    Data = _mapper.Map<EventDTO>(@event)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error uploading event image",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

		private async Task ClearAllEventCacheAsync()
		{
			// The issue is with how patterns are handled in Redis vs IDistributedCache

			// Method 1: Use Redis directly to find and remove keys by pattern
			try
			{
				var pattern = $"{_instanceName}{_cacheKeyPrefix}*";
				var keys = _redisServer.Keys(database: _redisDb.Database, pattern: pattern).ToArray();

				if (keys.Length > 0)
				{
					// Delete keys in batch from Redis
					await _redisDb.KeyDeleteAsync(keys);

					// Also remove from IDistributedCache for consistency
					foreach (var key in keys)
					{
						// Need to remove the instance name prefix when using IDistributedCache
						// since it's automatically added by the implementation
						string cacheKey = key.ToString().Replace(_instanceName, "");
						await _cache.RemoveAsync(cacheKey);
					}
				}
			}
			catch (Exception ex)
			{
				// Log the exception but don't rethrow - cache clearing should be non-blocking
				Console.WriteLine($"Error clearing Redis cache: {ex.Message}");
			}

			//// Method 2: Clear specific known cache keys as a fallback
			//// Even if the pattern matching fails, ensure critical keys are cleared
			//await _cache.RemoveAsync($"{_cacheKeyPrefix}GetAllEvents");

			//// Clear all paginated results cache
			//for (int page = 1; page <= 10; page++) // Reasonable assumption for pages
			//{
			//	for (int size = 10; size <= 50; size += 10) // Common page sizes
			//	{
			//		await _cache.RemoveAsync($"{_cacheKeyPrefix}GetPaginatedEvents_{page}_{size}");
			//	}
			//}
		}
	}
} 