using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int Stock { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 100000)]
        public decimal Price { get; set; }

        public IFormFile? Image { get; set; }

        public int Stock { get; set; }
    }

    public class UpdateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public IFormFile? Image { get; set; }

        public int Stock { get; set; }
    }
}