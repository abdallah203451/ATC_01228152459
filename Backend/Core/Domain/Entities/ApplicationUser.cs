using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace Core.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        // Navigation properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
} 