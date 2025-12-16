// Queue Management Models

export interface ChairDto {
  id: number;
  branchId: number;
  name: string;
  assignedBarberId?: number;
  currentBookingId?: number;
}

export interface CreateChairRequest {
  branchId: number;
  name: string;
  assignedBarberId?: number;
}

export interface QueueItemDto {
  id: number;
  branchId: number;
  bookingId: number;
  priority: number; // 0-10
  enqueuedAt: string; // ISO 8601
  isServed: boolean;
}

export interface EnqueueRequest {
  branchId: number;
  bookingId: number;
  priority: number; // 0-10, default 0
}

export interface AssignRequest {
  chairId: number;
  bookingId: number;
}

export interface CompleteResultDto {
  chairId: number;
  previousBookingId?: number;
  newAssignedBookingId?: number;
}

export interface ApiResponse {
  message: string;
}
