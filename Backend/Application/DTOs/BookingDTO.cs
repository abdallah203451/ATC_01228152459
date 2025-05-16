using System;

namespace Application.DTOs
{
    public class BookingDTO
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int TicketCount { get; set; }
        public decimal TotalPrice { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public EventDTO? Event { get; set; }
        public UserDTO? User { get; set; }
    }

    public class CreateBookingDTO
    {
        public int EventId { get; set; }
        public int TicketCount { get; set; }
    }

    public class UpdateBookingDTO
    {
        public int TicketCount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
    }

    public class BookingListDTO
    {
        public int Id { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public int TicketCount { get; set; }
        public decimal TotalPrice { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
    }
} 