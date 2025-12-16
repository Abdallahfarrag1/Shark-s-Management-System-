// backend/Models/OrderItem.cs
using System;

namespace backend.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order? Order { get; set; }

        public int ProductId { get; set; }               // reference to Products table
        public string Name { get; set; } = string.Empty; // snapshot name
        public decimal Price { get; set; }               // snapshot price
        public int Quantity { get; set; }

        public decimal Subtotal => Price * Quantity;
    }
}
