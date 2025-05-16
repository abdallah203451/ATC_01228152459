using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Core.Domain.Entities;
using Core.Domain.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IDistributedCache _cache;
        private readonly string _cacheKeyPrefix = "BookingService_";

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService, IDistributedCache cache)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
            _cache = cache;
        }

        public async Task<ApiResponse> GetAllBookingsAsync()
        {
            try
            {
                var bookings = await _unitOfWork.Bookings.GetAllAsync();
                var bookingDtos = _mapper.Map<List<BookingDTO>>(bookings);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Bookings retrieved successfully",
                    Data = bookingDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving bookings",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> GetBookingByIdAsync(int id)
        {
            try
            {
                var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
                if (booking == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Booking not found"
                    };
                }

                var bookingDto = _mapper.Map<BookingDTO>(booking);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Booking retrieved successfully",
                    Data = bookingDto
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving booking",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

		//public async Task<ApiResponse> GetUserBookingsAsync(string userId)
		//{
		//    try
		//    {
		//        string cacheKey = $"{_cacheKeyPrefix}GetUserBookings_{userId}";
		//        string? cachedData = await _cache.GetStringAsync(cacheKey);

		//        if (!string.IsNullOrEmpty(cachedData))
		//        {
		//            var cachedBookings = System.Text.Json.JsonSerializer.Deserialize<List<BookingListDTO>>(cachedData);
		//            return new ApiResponse
		//            {
		//                Success = true,
		//                Message = "User bookings retrieved from cache successfully",
		//                Data = cachedBookings
		//            };
		//        }

		//        var bookings = await _unitOfWork.Bookings.GetByUserIdAsync(userId);
		//        var bookingListDtos = _mapper.Map<List<BookingListDTO>>(bookings);

		//        // Cache the result
		//        var cacheOptions = new DistributedCacheEntryOptions
		//        {
		//            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
		//        };

		//        await _cache.SetStringAsync(cacheKey, System.Text.Json.JsonSerializer.Serialize(bookingListDtos), cacheOptions);

		//        return new ApiResponse
		//        {
		//            Success = true,
		//            Message = "User bookings retrieved successfully",
		//            Data = bookingListDtos
		//        };
		//    }
		//    catch (Exception ex)
		//    {
		//        return new ApiResponse
		//        {
		//            Success = false,
		//            Message = "Error retrieving user bookings",
		//            Errors = new List<string> { ex.Message }
		//        };
		//    }
		//}

		public async Task<ApiResponse> GetUserBookingsAsync(string userId)
		{
			var bookings = await _unitOfWork.Bookings.GetByUserIdAsync(userId);
			// only non–cancelled upcoming
			var filtered = bookings
				.Where(b => b.BookingStatus != "Cancelled")
				.Select(b => _mapper.Map<BookingDTO>(b));

			return new ApiResponse
			{
			    Success = true,
			    Message = "User bookings retrieved successfully",
			    Data = filtered
			};
		}
		public async Task<ApiResponse> GetEventBookingsAsync(int eventId)
        {
            try
            {
                var bookings = await _unitOfWork.Bookings.GetByEventIdAsync(eventId);
                var bookingDtos = _mapper.Map<List<BookingDTO>>(bookings);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Event bookings retrieved successfully",
                    Data = bookingDtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error retrieving event bookings",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> CreateBookingAsync(string userId, CreateBookingDTO createBookingDto)
        {
            try
            {
                // Check if event exists
                var @event = await _unitOfWork.Events.GetByIdAsync(createBookingDto.EventId);
                if (@event == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event not found"
                    };
                }

                // Check if event is active
                if (!@event.IsActive)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Event is not active"
                    };
                }

                // Calculate total price
                var totalPrice = @event.Price * createBookingDto.TicketCount;

                var booking = new Booking
                {
                    EventId = createBookingDto.EventId,
                    UserId = userId,
                    TicketCount = createBookingDto.TicketCount,
                    TotalPrice = totalPrice,
                    BookingStatus = "Confirmed",
                    BookingDate = DateTime.UtcNow
                };
                
                var addedBooking = await _unitOfWork.Bookings.AddAsync(booking);
                await _unitOfWork.SaveChangesAsync();

                // Clear user bookings cache
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetUserBookings_{userId}");

                // Send booking confirmation email
                var user = addedBooking.User;
                if (user != null)
                {
                    await _emailService.SendBookingConfirmationEmailAsync(
                        user.Email,
                        $"{user.FirstName} {user.LastName}",
                        @event.Name,
                        @event.EventDate.ToString("g"),
                        @event.Venue,
                        addedBooking.TicketCount,
                        addedBooking.TotalPrice
                    );
                }

                return new ApiResponse
                {
                    Success = true,
                    Message = "Booking created successfully",
                    Data = _mapper.Map<BookingDTO>(addedBooking)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error creating booking",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse> UpdateBookingAsync(int id, string userId, UpdateBookingDTO updateBookingDto)
        {
            try
            {
                var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
                if (booking == null)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Booking not found"
                    };
                }

                // Check if the booking belongs to the user
                if (booking.UserId != userId)
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "You are not authorized to update this booking"
                    };
                }

                // Only allow updates if the booking is not canceled
                if (booking.BookingStatus == "Cancelled")
                {
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Cannot update a cancelled booking"
                    };
                }

                // Update ticket count and recalculate total price if needed
                if (updateBookingDto.TicketCount > 0 && updateBookingDto.TicketCount != booking.TicketCount)
                {
                    var @event = await _unitOfWork.Events.GetByIdAsync(booking.EventId);
                    if (@event != null)
                    {
                        booking.TicketCount = updateBookingDto.TicketCount;
                        booking.TotalPrice = @event.Price * updateBookingDto.TicketCount;
                    }
                }

                // Update booking status if provided
                if (!string.IsNullOrEmpty(updateBookingDto.BookingStatus))
                {
                    booking.BookingStatus = updateBookingDto.BookingStatus;
                }
                
                await _unitOfWork.Bookings.UpdateAsync(booking);
                await _unitOfWork.SaveChangesAsync();

                // Clear user bookings cache
                await _cache.RemoveAsync($"{_cacheKeyPrefix}GetUserBookings_{userId}");

                return new ApiResponse
                {
                    Success = true,
                    Message = "Booking updated successfully",
                    Data = _mapper.Map<BookingDTO>(booking)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Error updating booking",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

		//public async Task<ApiResponse> CancelBookingAsync(int id, string userId)
		//{
		//    try
		//    {
		//        var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
		//        if (booking == null)
		//        {
		//            return new ApiResponse
		//            {
		//                Success = false,
		//                Message = "Booking not found"
		//            };
		//        }

		//        // Check if the booking belongs to the user
		//        if (booking.UserId != userId)
		//        {
		//            return new ApiResponse
		//            {
		//                Success = false,
		//                Message = "You are not authorized to cancel this booking"
		//            };
		//        }

		//        // Only allow cancellation if the booking is not already canceled
		//        if (booking.BookingStatus == "Cancelled")
		//        {
		//            return new ApiResponse
		//            {
		//                Success = false,
		//                Message = "Booking is already cancelled"
		//            };
		//        }

		//        booking.BookingStatus = "Cancelled";

		//        await _unitOfWork.Bookings.UpdateAsync(booking);
		//        await _unitOfWork.SaveChangesAsync();

		//        // Clear user bookings cache
		//        await _cache.RemoveAsync($"{_cacheKeyPrefix}GetUserBookings_{userId}");

		//        return new ApiResponse
		//        {
		//            Success = true,
		//            Message = "Booking cancelled successfully",
		//            Data = _mapper.Map<BookingDTO>(booking)
		//        };
		//    }
		//    catch (Exception ex)
		//    {
		//        return new ApiResponse
		//        {
		//            Success = false,
		//            Message = "Error cancelling booking",
		//            Errors = new List<string> { ex.Message }
		//        };
		//    }
		public async Task<ApiResponse> CancelBookingAsync(int id, string userId)
		{
			var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
            if (booking == null) {
				return new ApiResponse
		        {
		            Success = false,
		            Message = "Booking is already cancelled"
		        };
			}
			if (booking.UserId != userId)
            {
				return new ApiResponse
				{
					Success = false,
					Message = "Not allowed"
				};
			}

			await _unitOfWork.Bookings.CancelAsync(id);
			await _unitOfWork.SaveChangesAsync();

			return new ApiResponse
			{
			    Success = true,
			    Message = "Booking cancelled successfully",
			    Data = _mapper.Map<BookingDTO>(booking)
			};
		}
	}
    
}
