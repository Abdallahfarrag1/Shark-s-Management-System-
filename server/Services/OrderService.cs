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
                CustomerName = dto.CustomerName,
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

            // Map from in-memory entity (has CustomerName)
            return MapToDto(order);
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            // Project into DTO and include CustomerName from the entity
            var dto = await _db.Orders
                .Where(o => o.Id == id)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId ?? string.Empty,
                    PhoneNumber = o.PhoneNumber ?? string.Empty,
                    Address = o.Address ?? string.Empty,
                    CustomerName = o.CustomerName ?? string.Empty,
                    Total = o.Total,
                    PaymentMethod = o.PaymentMethod ?? string.Empty,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        Name = i.Name ?? string.Empty,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        Subtotal = i.Subtotal
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return dto;
        }

        public async Task<List<OrderDto>> GetAllAsync()
        {
            var list = await _db.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId ?? string.Empty,
                    PhoneNumber = o.PhoneNumber ?? string.Empty,
                    Address = o.Address ?? string.Empty,
                    CustomerName = o.CustomerName ?? string.Empty,
                    Total = o.Total,
                    PaymentMethod = o.PaymentMethod ?? string.Empty,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        Name = i.Name ?? string.Empty,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        Subtotal = i.Subtotal
                    }).ToList()
                })
                .ToListAsync();

            return list;
        }

        public async Task<List<OrderDto>> GetByUserAsync(string userId)
        {
            var list = await _db.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    UserId = o.UserId ?? string.Empty,
                    PhoneNumber = o.PhoneNumber ?? string.Empty,
                    Address = o.Address ?? string.Empty,
                    CustomerName = o.CustomerName ?? string.Empty,
                    Total = o.Total,
                    PaymentMethod = o.PaymentMethod ?? string.Empty,
                    Status = o.Status.ToString(),
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        Name = i.Name ?? string.Empty,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        Subtotal = i.Subtotal
                    }).ToList()
                })
                .ToListAsync();

            return list;
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

        // helper mapper for in-memory entity (used after create)
        private static OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                PhoneNumber = order.PhoneNumber,
                Address = order.Address,
                CustomerName = order.CustomerName,
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
