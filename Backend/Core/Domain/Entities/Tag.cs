using System.Collections.Generic;

namespace Core.Domain.Entities
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // Navigation properties
        public ICollection<EventTag> EventTags { get; set; } = new List<EventTag>();
    }
} 