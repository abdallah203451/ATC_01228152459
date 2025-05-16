using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _bookingService.GetAllBookingsAsync();
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _bookingService.GetBookingByIdAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }

            // Only admin or booking owner can access booking details
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var booking = (BookingDTO)result.Data;
            
            if (booking.UserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            return Ok(result);
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _bookingService.GetUserBookingsAsync(userId);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("event/{eventId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByEventId(int eventId)
        {
            var result = await _bookingService.GetEventBookingsAsync(eventId);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _bookingService.CreateBookingAsync(userId, model);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = ((BookingDTO)result.Data).Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookingDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Only the booking owner can update their booking
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var bookingResult = await _bookingService.GetBookingByIdAsync(id);
            
            if (!bookingResult.Success)
            {
                return NotFound(bookingResult);
            }

            var booking = (BookingDTO)bookingResult.Data;
            if (booking.UserId != userId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var result = await _bookingService.UpdateBookingAsync(id, userId, model);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            // Only the booking owner can cancel their booking
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var bookingResult = await _bookingService.GetBookingByIdAsync(id);
            
            if (!bookingResult.Success)
            {
                return NotFound(bookingResult);
            }

            var booking = (BookingDTO)bookingResult.Data;
            if (booking.UserId != userId)
            {
                return Forbid();
            }

            var result = await _bookingService.CancelBookingAsync(id, userId);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
} 