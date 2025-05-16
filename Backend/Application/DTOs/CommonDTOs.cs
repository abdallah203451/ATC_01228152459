using System.Collections.Generic;

namespace Application.DTOs
{
    public class PagedResponse<T> where T : class
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }

    public class UploadImageDTO
    {
        public int EventId { get; set; }
    }
} 