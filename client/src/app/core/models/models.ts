// ========================================
// ENUMS
// ========================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  BARBER = 'BARBER',
  CASHIER = 'CASHIER',
  RECEPTION = 'RECEPTION',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentMethod {
  CASH = 'CASH',
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum QueueStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  CANCELLED = 'CANCELLED',
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  INACTIVE = 'INACTIVE',
}

export enum BranchStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
}

export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// ========================================
// CORE ENTITIES
// ========================================

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  imageUrl?: string;
  managerId?: string;
  status: BranchStatus;
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  workingHours: {
    open: string; // HH:mm format
    close: string;
  };
  offDays: string[]; // ISO date strings
  holidaySchedule: Holiday[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Holiday {
  date: string; // ISO date string
  name: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  imageUrl?: string;
  branchId: string;
  status: EmployeeStatus;
  workingDays: number[];
  shiftStart: string; // HH:mm
  shiftEnd: string; // HH:mm
  breakTimes: BreakTime[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BreakTime {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  categoryId: string;
  imageUrl?: string;
  availableBranches: string[]; // branch IDs
  isActive: boolean;
  upsellingSuggestions: string[]; // service IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface Booking {
  id: string; // or number based on backend, spec says number for Create response ID but string in models? Spec says "id": 456. Keeping string for now to match interface but might need number.
  customerId: string;
  customerName: string; // added
  customerPhone: string;
  customerEmail?: string;
  branchId: string; // or number
  barberId: string; // or number
  barberName?: string; // added
  serviceId: string; // or number
  serviceName?: string; // added
  servicePrice?: number; // added
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  startAt?: string; // ISO
  endAt?: string; // ISO
  durationMinutes?: number;
  status: BookingStatus;
  paymentMethod: string; // changed from enum to string to match DTO if needed, or keep enum if compatible
  paymentStatus: string; // changed from enum to string
  totalAmount?: number;
  notes?: string;
  isWalkIn: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateBookingRequest {
  customerId: string;
  customerName: string; // FirstName + LastName
  barberId: number;
  serviceId: number;
  branchId: number;
  startAt: string; // ISO 8601
}

export interface BookingDto {
  id: number;
  customerId: string;
  customerName: string;
  barberId: number;
  barberName: string;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  branchId: number;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface UserOrdersAndBookingsDto {
  orders: any[]; // using any temporarily or import OrderDto if possible, but circular dependency risk if importing from order.model. Will use generic or define inline if simple. Steps below will fix imports.
  // Actually, I can rely on 'any' for now or better yet, define a loose shape or import properly.
  // Ideally models.ts shouldn't depend on features.
  // Let's use 'any' for orders here to avoid coupling if not already coupled, or move OrderDto here.
  // But wait, OrderDto is in order.model.ts.
  // I will just define `orders: any[]` for now and cast it in service.
  bookings: BookingDto[];
}

export interface QueueItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  serviceId: string;
  barberId?: string;
  status: QueueStatus;
  estimatedWaitTime: number; // in minutes
  joinedAt: Date;
  calledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  paymentMethod?: PaymentMethod;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: Date;
  averageRating?: number;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  branchIds: string[]; // empty array means all branches
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: ActionType;
  entityType: string; // 'Branch', 'Employee', 'Booking', etc.
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  bookingId: string;
  barberId: string;
  branchId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// ========================================
// ANALYTICS & REPORTING
// ========================================

export interface DashboardStats {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  ytdRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  newCustomers: number;
  returningCustomers: number;
  averageWaitTime: number;
  totalBranches: number;
}

export interface RevenueBreakdown {
  byBranch: { branchId: string; branchName: string; revenue: number }[];
  byService: { serviceId: string; serviceName: string; revenue: number }[];
  byBarber: { barberId: string; barberName: string; revenue: number }[];
  byTimeOfDay: { hour: number; revenue: number }[];
}

export interface TrendData {
  label: string;
  value: number;
}

export interface HeatmapData {
  day: number; // 0-6
  hour: number; // 0-23
  value: number;
}

export interface BarberPerformance {
  barberId: string;
  barberName: string;
  totalBookings: number;
  completedBookings: number;
  averageServiceTime: number; // in minutes
  averageRating: number;
  punctualityScore: number; // 0-100
  efficiencyScore: number; // 0-100
  rebookingRate: number; // percentage
  totalRevenue: number;
}

export interface CustomerInsights {
  customerId: string;
  customerName: string;
  lifetimeValue: number;
  totalVisits: number;
  daysSinceLastVisit: number;
  averageRating: number;
  loyaltyScore: number; // 0-100
}

export interface BranchMetrics {
  branchId: string;
  branchName: string;
  todayBookings: number;
  upcomingBookings: number;
  inProgressBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  currentQueueLength: number;
  averageWaitTime: number;
  dailyRevenue: number;
  operationalLoad: number; // percentage
  status: BranchStatus;
}

export interface ServicePopularity {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  revenue: number;
  profitMargin: number;
  averageRating: number;
}

export interface PeakHoursData {
  hour: number;
  bookingCount: number;
  averageWaitTime: number;
}

export interface CancellationReason {
  reason: string;
  count: number;
  percentage: number;
}

// Branch Analytics from API
export interface BranchAnalytics {
  branchId: number;
  totalBookings: number;
  totalBookingsLastDays: number;
  totalRevenue: number;
  totalRevenueLastDays: number;
  averageRating: number;
  peakHour: number;
  peakHourCount: number;
  bookingsPerDay: { date: string; count: number }[];
  revenuePerDay: { date: string; amount: number }[];
  topServices: { serviceName: string; count: number; revenue: number }[];
  totalOrdersValue: number;
  ordersCount: number;
}

// ========================================
// CALENDAR & SCHEDULING
// ========================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  bookingId?: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  status: BookingStatus;
  color?: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  barberId?: string;
  bookingId?: string;
}

export interface DaySchedule {
  date: string; // ISO date
  barberId: string;
  barberName: string;
  slots: TimeSlot[];
}

// ========================================
// NOTIFICATION & ALERTS
// ========================================

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  branchId?: string;
  userId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Alert {
  id: string;
  type: 'LOW_STAFF' | 'OVERBOOKING' | 'PEAK_LOAD' | 'QUEUE_DELAY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  branchId: string;
  timestamp: Date;
  acknowledged: boolean;
}

// ========================================
// SYSTEM SETTINGS
// ========================================

export interface SystemSettings {
  maxBookingsPerSlot: number;
  bufferTimeBetweenBookings: number; // in minutes
  autoShiftScheduling: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  defaultCurrency: string;
  timezone: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS';
  subject?: string; // for email
  body: string;
  variables: string[]; // e.g., ['customerName', 'bookingTime']
}

export interface PaymentSettings {
  cashEnabled: boolean;
  paypalEnabled: boolean;
  paypalClientId?: string;
  creditCardEnabled: boolean;
  stripePublicKey?: string;
}

// ========================================
// FILTER & SEARCH PARAMS
// ========================================

export interface BookingFilters {
  branchId?: string;
  barberId?: string;
  serviceId?: string;
  status?: BookingStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  customerName?: string;
}

export interface EmployeeFilters {
  role?: UserRole;
  branchId?: string;
  status?: EmployeeStatus;
  searchTerm?: string;
}

export interface AuditLogFilters {
  userId?: string;
  action?: ActionType;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ========================================
// FEEDBACK
// ========================================

export interface CreateFeedbackRequest {
  branchId: number;
  rating: number;
}

export interface FeedbackResponse {
  success: boolean;
  message?: string;
}
