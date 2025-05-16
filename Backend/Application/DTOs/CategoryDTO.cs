using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class CreateCategoryDTO
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(50, ErrorMessage = "Category name must be at most 50 characters")]
        public string Name { get; set; }
    }
    
    public class UpdateCategoryDTO
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(50, ErrorMessage = "Category name must be at most 50 characters")]
        public string Name { get; set; }
    }
}