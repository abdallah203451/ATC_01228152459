using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var response = await _categoryService.GetAllCategoriesAsync();
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var response = await _categoryService.GetCategoryByIdAsync(id);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDTO categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _categoryService.CreateCategoryAsync(categoryDto);
            if (!response.Success)
                return BadRequest(response);

            return CreatedAtAction(nameof(GetCategoryById), new { id = ((CategoryDTO)response.Data).Id }, response);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDTO categoryDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (!response.Success)
            {
                if (response.Message.Contains("not found"))
                    return NotFound(response);
                
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var response = await _categoryService.DeleteCategoryAsync(id);
            if (!response.Success)
            {
                if (response.Message.Contains("not found"))
                    return NotFound(response);
                
                return BadRequest(response);
            }

            return Ok(response);
        }
    }
}