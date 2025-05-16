using System;
using System.Collections.Generic;

namespace Core.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation property for relationship with Events
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    }
}