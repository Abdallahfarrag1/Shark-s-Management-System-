// backend/Services/OrderService.cs
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _db;

        public OrderService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            // calculate total
            decimal total = dto.Items.Sum(i => i.Price * i.Quantity);

            var order = new Order
            {
                UserId = dto.UserId,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                PaymentMethod = dto.PaymentMethod,
                Total = total,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var it in dto.Items)
            {
                order.Items.Add(new OrderItem
                {
                    ProductId = it.ProductId,
                    Name = it.Name,
                    Price = it.Price,
                    Quantity = it.Quantity
                });
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return MapToDto(order);
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return null;
            return MapToDto(order);
        }

        public async Task<List<OrderDto>> GetAllAsync()
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapToDto).ToList();
        }

        public async Task<List<OrderDto>> GetByUserAsync(string userId)
        {
            var orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapToDto).ToList();
        }

        public async Task<bool> UpdateStatusAsync(int id, string newStatus)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return false;

            if (!Enum.TryParse<OrderStatus>(newStatus, true, out var parsed))
                return false;

            order.Status = parsed;
            order.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _db.Orders.FindAsync(id);
            if (order == null) return false;
            _db.Orders.Remove(order);
            await _db.SaveChangesAsync();
            return true;
        }

        // helper mapper
        private static OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                PhoneNumber = order.PhoneNumber,
                Address = order.Address,
                Total = order.Total,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    Name = i.Name,
                    Price = i.Price,
                    Quantity = i.Quantity,
                    Subtotal = i.Subtotal
                }).ToList()
            };
        }
    }
}
