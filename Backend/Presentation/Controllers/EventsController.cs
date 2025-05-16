using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IWebHostEnvironment _environment;

        public EventsController(IEventService eventService, IWebHostEnvironment environment)
        {
            _eventService = eventService;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _eventService.GetAllEventsAsync();
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber = 1,[FromQuery] int pageSize = 10,[FromQuery] string? search = null,[FromQuery] string? category = null)
        {
			var result = await _eventService.GetPaginatedEventsAsync(pageNumber, pageSize, search, category);
			if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _eventService.GetEventByIdAsync(id);
            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

		[HttpGet("category/{categoryId}")]
		public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var result = await _eventService.GetEventsByCategoryAsync(categoryId);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("tag/{tagId}")]
        public async Task<IActionResult> GetByTag(int tagId)
        {
            var result = await _eventService.GetEventsByTagIdAsync(tagId);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] CreateEventDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _eventService.CreateEventAsync(model);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = ((EventDTO)result.Data).Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateEventDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // First check if the event exists
            var eventCheck = await _eventService.GetEventByIdAsync(id);
            if (!eventCheck.Success)
            {
                return NotFound(eventCheck);
            }

            var result = await _eventService.UpdateEventAsync(id, model);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _eventService.DeleteEventAsync(id);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
} 