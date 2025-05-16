using System;
using System.Collections.Generic;

namespace Core.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
		public int Capacity { get; set; }
		public int AvailableTickets { get; set; }

		// Foreign key for Category
		public int CategoryId { get; set; }

        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<EventTag> EventTags { get; set; } = new List<EventTag>();
        public virtual Category Categoryobj { get; set; } = null!;
	}
}