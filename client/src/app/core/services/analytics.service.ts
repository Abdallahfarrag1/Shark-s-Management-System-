import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  DashboardStats,
  RevenueBreakdown,
  TrendData,
  HeatmapData,
  BarberPerformance,
  CustomerInsights,
  BranchMetrics,
  ServicePopularity,
  PeakHoursData,
  CancellationReason,
  BranchAnalytics,
} from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/Analytics`;

  constructor(private http: HttpClient) {}

  // Fetch branch analytics from API
  getBranchAnalytics(branchId: number, days: number = 30): Observable<BranchAnalytics> {
    return this.http.get<BranchAnalytics>(`${this.apiUrl}/branch/${branchId}?days=${days}`);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalRevenue: 1250000,
      dailyRevenue: 15000,
      weeklyRevenue: 95000,
      monthlyRevenue: 385000,
      ytdRevenue: 1250000,
      totalBookings: 3450,
      completedBookings: 3120,
      cancelledBookings: 180,
      newCustomers: 245,
      returningCustomers: 1205,
      averageWaitTime: 12,
      totalBranches: 12,
    };
    return of(stats).pipe(delay(300));
  }

  // Revenue Breakdown
  getRevenueBreakdown(): Observable<RevenueBreakdown> {
    const breakdown: RevenueBreakdown = {
      byBranch: [
        { branchId: '1', branchName: 'Downtown Branch', revenue: 185000 },
        { branchId: '2', branchName: 'Westside Branch', revenue: 165000 },
        { branchId: '3', branchName: 'Eastside Branch', revenue: 145000 },
        { branchId: '4', branchName: 'Northside Branch', revenue: 125000 },
        { branchId: '5', branchName: 'Southside Branch', revenue: 115000 },
      ],
      byService: [
        { serviceId: '1', serviceName: 'Haircut & Styling', revenue: 450000 },
        { serviceId: '2', serviceName: 'Beard Trim', revenue: 285000 },
        { serviceId: '3', serviceName: 'Hair Coloring', revenue: 195000 },
        { serviceId: '4', serviceName: 'Hot Towel Shave', revenue: 165000 },
        { serviceId: '5', serviceName: 'Hair Treatment', revenue: 155000 },
      ],
      byBarber: [
        { barberId: '1', barberName: 'John Smith', revenue: 95000 },
        { barberId: '2', barberName: 'Mike Johnson', revenue: 88000 },
        { barberId: '3', barberName: 'David Brown', revenue: 82000 },
        { barberId: '4', barberName: 'Chris Wilson', revenue: 75000 },
        { barberId: '5', barberName: 'Tom Davis', revenue: 68000 },
      ],
      byTimeOfDay: [
        { hour: 9, revenue: 25000 },
        { hour: 10, revenue: 45000 },
        { hour: 11, revenue: 65000 },
        { hour: 12, revenue: 85000 },
        { hour: 13, revenue: 75000 },
        { hour: 14, revenue: 95000 },
        { hour: 15, revenue: 105000 },
        { hour: 16, revenue: 115000 },
        { hour: 17, revenue: 125000 },
        { hour: 18, revenue: 95000 },
        { hour: 19, revenue: 65000 },
        { hour: 20, revenue: 35000 },
      ],
    };
    return of(breakdown).pipe(delay(300));
  }

  // Revenue Trends
  getRevenueTrends(period: 'daily' | 'weekly' | 'monthly'): Observable<TrendData[]> {
    let trends: TrendData[] = [];

    if (period === 'monthly') {
      trends = [
        { label: 'Jan', value: 285000 },
        { label: 'Feb', value: 295000 },
        { label: 'Mar', value: 315000 },
        { label: 'Apr', value: 335000 },
        { label: 'May', value: 355000 },
        { label: 'Jun', value: 365000 },
        { label: 'Jul', value: 385000 },
        { label: 'Aug', value: 395000 },
        { label: 'Sep', value: 405000 },
        { label: 'Oct', value: 415000 },
        { label: 'Nov', value: 425000 },
        { label: 'Dec', value: 385000 },
      ];
    } else if (period === 'weekly') {
      trends = [
        { label: 'Week 1', value: 85000 },
        { label: 'Week 2', value: 92000 },
        { label: 'Week 3', value: 88000 },
        { label: 'Week 4', value: 95000 },
      ];
    } else {
      trends = [
        { label: 'Mon', value: 12000 },
        { label: 'Tue', value: 13500 },
        { label: 'Wed', value: 14200 },
        { label: 'Thu', value: 15800 },
        { label: 'Fri', value: 18500 },
        { label: 'Sat', value: 22000 },
        { label: 'Sun', value: 16000 },
      ];
    }

    return of(trends).pipe(delay(300));
  }

  // Booking Trends
  getBookingTrends(period: 'daily' | 'weekly' | 'monthly'): Observable<TrendData[]> {
    let trends: TrendData[] = [];

    if (period === 'monthly') {
      trends = [
        { label: 'Jan', value: 2850 },
        { label: 'Feb', value: 2950 },
        { label: 'Mar', value: 3150 },
        { label: 'Apr', value: 3350 },
        { label: 'May', value: 3550 },
        { label: 'Jun', value: 3650 },
        { label: 'Jul', value: 3850 },
        { label: 'Aug', value: 3950 },
        { label: 'Sep', value: 4050 },
        { label: 'Oct', value: 4150 },
        { label: 'Nov', value: 4250 },
        { label: 'Dec', value: 3850 },
      ];
    }

    return of(trends).pipe(delay(300));
  }

  // Heatmap Data (busiest hours/days)
  getHeatmapData(): Observable<HeatmapData[]> {
    const heatmap: HeatmapData[] = [];

    // Generate heatmap for 7 days x 12 hours (9 AM - 9 PM)
    for (let day = 0; day < 7; day++) {
      for (let hour = 9; hour <= 21; hour++) {
        // Simulate higher activity on weekends and peak hours
        let value = Math.floor(Math.random() * 50) + 10;
        if (day === 5 || day === 6) value += 30; // Weekend boost
        if (hour >= 14 && hour <= 18) value += 20; // Peak hours boost

        heatmap.push({ day, hour, value });
      }
    }

    return of(heatmap).pipe(delay(300));
  }

  // Barber Performance
  getBarberPerformance(): Observable<BarberPerformance[]> {
    const performance: BarberPerformance[] = [
      {
        barberId: '1',
        barberName: 'John Smith',
        totalBookings: 285,
        completedBookings: 275,
        averageServiceTime: 28,
        averageRating: 4.8,
        punctualityScore: 95,
        efficiencyScore: 92,
        rebookingRate: 78,
        totalRevenue: 95000,
      },
      {
        barberId: '2',
        barberName: 'Mike Johnson',
        totalBookings: 268,
        completedBookings: 260,
        averageServiceTime: 30,
        averageRating: 4.7,
        punctualityScore: 93,
        efficiencyScore: 90,
        rebookingRate: 75,
        totalRevenue: 88000,
      },
      {
        barberId: '3',
        barberName: 'David Brown',
        totalBookings: 255,
        completedBookings: 248,
        averageServiceTime: 32,
        averageRating: 4.6,
        punctualityScore: 91,
        efficiencyScore: 88,
        rebookingRate: 72,
        totalRevenue: 82000,
      },
    ];

    return of(performance).pipe(delay(300));
  }

  // Customer Insights
  getCustomerInsights(): Observable<CustomerInsights[]> {
    const insights: CustomerInsights[] = [
      {
        customerId: '1',
        customerName: 'Robert Anderson',
        lifetimeValue: 2850,
        totalVisits: 42,
        daysSinceLastVisit: 5,
        averageRating: 4.9,
        loyaltyScore: 95,
      },
      {
        customerId: '2',
        customerName: 'James Wilson',
        lifetimeValue: 2450,
        totalVisits: 38,
        daysSinceLastVisit: 8,
        averageRating: 4.8,
        loyaltyScore: 92,
      },
      {
        customerId: '3',
        customerName: 'Michael Taylor',
        lifetimeValue: 2150,
        totalVisits: 35,
        daysSinceLastVisit: 12,
        averageRating: 4.7,
        loyaltyScore: 88,
      },
    ];

    return of(insights).pipe(delay(300));
  }

  // Branch Metrics
  getBranchMetrics(): Observable<BranchMetrics[]> {
    const metrics: BranchMetrics[] = [
      {
        branchId: '1',
        branchName: 'Downtown Branch',
        todayBookings: 45,
        upcomingBookings: 28,
        inProgressBookings: 8,
        completedBookings: 9,
        cancelledBookings: 2,
        currentQueueLength: 5,
        averageWaitTime: 15,
        dailyRevenue: 3500,
        operationalLoad: 85,
        status: 'OPEN' as any,
      },
      {
        branchId: '2',
        branchName: 'Westside Branch',
        todayBookings: 38,
        upcomingBookings: 22,
        inProgressBookings: 6,
        completedBookings: 8,
        cancelledBookings: 1,
        currentQueueLength: 3,
        averageWaitTime: 12,
        dailyRevenue: 2950,
        operationalLoad: 72,
        status: 'OPEN' as any,
      },
    ];

    return of(metrics).pipe(delay(300));
  }

  // Service Popularity
  getServicePopularity(): Observable<ServicePopularity[]> {
    const popularity: ServicePopularity[] = [
      {
        serviceId: '1',
        serviceName: 'Haircut & Styling',
        bookingCount: 1250,
        revenue: 450000,
        profitMargin: 65,
        averageRating: 4.7,
      },
      {
        serviceId: '2',
        serviceName: 'Beard Trim',
        bookingCount: 985,
        revenue: 285000,
        profitMargin: 70,
        averageRating: 4.8,
      },
      {
        serviceId: '3',
        serviceName: 'Hair Coloring',
        bookingCount: 645,
        revenue: 195000,
        profitMargin: 55,
        averageRating: 4.6,
      },
    ];

    return of(popularity).pipe(delay(300));
  }

  // Peak Hours
  getPeakHours(): Observable<PeakHoursData[]> {
    const peakHours: PeakHoursData[] = [
      { hour: 9, bookingCount: 45, averageWaitTime: 8 },
      { hour: 10, bookingCount: 68, averageWaitTime: 10 },
      { hour: 11, bookingCount: 85, averageWaitTime: 12 },
      { hour: 12, bookingCount: 95, averageWaitTime: 15 },
      { hour: 13, bookingCount: 78, averageWaitTime: 13 },
      { hour: 14, bookingCount: 105, averageWaitTime: 18 },
      { hour: 15, bookingCount: 125, averageWaitTime: 22 },
      { hour: 16, bookingCount: 135, averageWaitTime: 25 },
      { hour: 17, bookingCount: 145, averageWaitTime: 28 },
      { hour: 18, bookingCount: 115, averageWaitTime: 20 },
      { hour: 19, bookingCount: 85, averageWaitTime: 15 },
      { hour: 20, bookingCount: 55, averageWaitTime: 10 },
    ];

    return of(peakHours).pipe(delay(300));
  }

  // Cancellation Reasons
  getCancellationReasons(): Observable<CancellationReason[]> {
    const reasons: CancellationReason[] = [
      { reason: 'Schedule Conflict', count: 65, percentage: 36 },
      { reason: 'Found Another Barber', count: 42, percentage: 23 },
      { reason: 'Too Long Wait Time', count: 35, percentage: 19 },
      { reason: 'Personal Emergency', count: 25, percentage: 14 },
      { reason: 'Other', count: 13, percentage: 8 },
    ];

    return of(reasons).pipe(delay(300));
  }
}
