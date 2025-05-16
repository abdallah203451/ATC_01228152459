using System;

namespace Core.Domain.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TicketCount { get; set; }
        public decimal TotalPrice { get; set; }
        public string BookingStatus { get; set; } = "Confirmed"; // Pending, Confirmed, Cancelled
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Event Event { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
} 