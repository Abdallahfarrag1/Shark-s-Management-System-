// backend/DTOs/CreateOrderDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateOrderItemDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int Quantity { get; set; }
    }

    public class CreateOrderDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string PaymentMethod { get; set; } = "None";

        [Required]
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}
