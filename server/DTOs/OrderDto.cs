// backend/DTOs/OrderDto.cs
using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class OrderDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class UpdateOrderStatusDto
    {
        public string Status { get; set; } = string.Empty; // Pending|Completed|Cancelled
    }
}
