using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class EventDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
		public int CategoryId { get; set; }
		public string CategoryName { get; set; } = string.Empty;
		public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
		public int Capacity { get; set; }
		public int AvailableTickets { get; set; }
		public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<TagDTO> Tags { get; set; } = new List<TagDTO>();
    }

    public class CreateEventDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
		public int CategoryId { get; set; }
		public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
        public IFormFile? Image { get; set; }
		public int Capacity { get; set; }
	}

    public class UpdateEventDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
		public int CategoryId { get; set; }
		public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public List<int> TagIds { get; set; } = new List<int>();
        public IFormFile? Image { get; set; }
		public int Capacity { get; set; }
	}

    public class EventListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
		public int CategoryId { get; set; }
		public string CategoryName { get; set; } = string.Empty;
		public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
		public int Capacity { get; set; }
		public int AvailableTickets { get; set; }
		public List<string> Tags { get; set; } = new List<string>();
    }
} 