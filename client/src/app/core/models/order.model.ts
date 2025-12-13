export interface OrderItemDto {
  id?: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface CreateOrderRequest {
  userId: string;
  phoneNumber: string;
  address: string;
  customerName?: string; // Add this
  paymentMethod: string;
  items: OrderItemDto[];
}

export interface OrderDto {
  id: number;
  userId: string;
  customerName?: string;
  phoneNumber: string;
  address: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export interface Order extends OrderDto {} // Alias for backward compatibility if needed, or prefer OrderDto
