// Chair Management
export interface Chair {
  id: number;
  branchId: number;
  name: string;
  assignedBarberId?: number | null;
  currentBookingId?: number | null;
  // Enhanced fields from backend
  assignedBarberName?: string;
  status?: 'Occupied' | 'Empty';
  currentBooking?: QueueItem;
}

export interface ChairCreateRequest {
  branchId: number;
  name: string;
  assignedBarberId?: number;
}

// Queue Management
export interface QueueItem {
  id: number;
  branchId: number;
  bookingId: number;
  priority: number; // 0-10
  enqueuedAt: string; // ISO 8601
  isServed: boolean;
  // Enhanced fields from backend
  customerName?: string;
  serviceName?: string;
  bookingTime?: string;
  preferredBarberName?: string;
}

export interface EnqueueRequest {
  branchId: number;
  bookingId: number;
  priority: number; // 0-10, default 0
}

// Operations
export interface AssignRequest {
  chairId: number;
  bookingId: number;
}

export interface CompleteResponse {
  chairId: number;
  previousBookingId?: number | null;
  newAssignedBookingId?: number | null;
}

export interface ApiResponse {
  message: string;
}
