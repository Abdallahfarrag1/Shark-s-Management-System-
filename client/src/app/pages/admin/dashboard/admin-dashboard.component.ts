import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from '../../../components/shared/chart/chart.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { LanguageService } from '../../../core/services/language.service';
import { BranchService, Branch } from '../../../core/services/branch.service';
import {
  DashboardStats,
  RevenueBreakdown,
  TrendData,
  BranchAnalytics,
} from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartComponent],
  template: `
    <div class="space-y-4 md:space-y-6 fade-in">
      <!-- Header -->
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().superAdminDashboard }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().welcomeMessage }}
          </p>
        </div>
      </div>

      <!-- Branch Analytics Section -->
      <div class="card p-4 md:p-6">
        <h2 class="text-lg md:text-xl font-semibold mb-4" [style.color]="'var(--text-primary)'">
          📊 Branch Analytics
        </h2>

        <!-- Branch Selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-secondary)'">
            Select Branch to View Analytics
          </label>
          <div class="flex flex-wrap gap-2">
            @for (branch of branches; track branch.id) {
            <button
              (click)="selectBranch(branch)"
              class="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
              [class]="
                selectedBranch?.id === branch.id
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              "
              [style.color]="selectedBranch?.id === branch.id ? 'white' : 'var(--text-primary)'"
            >
              🏪 {{ branch.name }}
            </button>
            }
          </div>
          @if (branches.length === 0) {
          <p class="text-sm" [style.color]="'var(--text-secondary)'">Loading branches...</p>
          }
        </div>

        <!-- Branch Analytics Display -->
        @if (selectedBranch && branchAnalytics) {
        <!-- KPI Cards for Selected Branch -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(13, 153, 153, 0.1), rgba(13, 153, 153, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Total Bookings
            </p>
            <h3 class="text-2xl font-bold" [style.color]="'var(--primary-color)'">
              {{ branchAnalytics.totalBookings }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              Last {{ analyticsDays }} days: {{ branchAnalytics.totalBookingsLastDays }}
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Total Revenue
            </p>
            <h3 class="text-2xl font-bold" style="color: #10b981;">
              {{ branchAnalytics.totalOrdersValue | number }} LE
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              {{ branchAnalytics.ordersCount }} orders
            </p>
          </div>
          <div
            class="card p-4 text-center"
            style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));"
          >
            <p class="text-xs font-medium mb-1" [style.color]="'var(--text-secondary)'">
              Avg Rating
            </p>
            <h3 class="text-2xl font-bold" style="color: #f59e0b;">
              ⭐ {{ branchAnalytics.averageRating | number : '1.1-1' }}
            </h3>
            <p class="text-xs mt-1" [style.color]="'var(--text-secondary)'">
              Customer satisfaction
            </p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <!-- Bookings Per Day Chart -->
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              📅 Bookings Per Day
            </h4>
            @if (bookingsPerDayData && branchAnalytics.bookingsPerDay.length > 0) {
            <app-chart
              type="line"
              [data]="bookingsPerDayData"
              [options]="bookingsChartOptions"
              [height]="'200px'"
            />
            } @else {
            <div class="flex items-center justify-center h-48 text-gray-400">
              <p>No booking data available</p>
            </div>
            }
          </div>

          <!-- Revenue Per Day Chart -->
          <div class="card p-4">
            <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
              💰 Revenue Per Day
            </h4>
            @if (revenuePerDayData && branchAnalytics.revenuePerDay.length > 0) {
            <app-chart
              type="line"
              [data]="revenuePerDayData"
              [options]="revenueChartOptions"
              [height]="'200px'"
            />
            } @else {
            <div class="flex items-center justify-center h-48 text-gray-400">
              <p>No revenue data available</p>
            </div>
            }
          </div>
        </div>

        <!-- Top Services Chart -->
        <div class="card p-4">
          <h4 class="text-sm font-semibold mb-3" [style.color]="'var(--text-primary)'">
            🏆 Top Services
          </h4>
          @if (topServicesData && branchAnalytics.topServices.length > 0) {
          <app-chart
            type="bar"
            [data]="topServicesData"
            [options]="servicesChartOptions"
            [height]="'250px'"
          />
          } @else {
          <div class="flex items-center justify-center h-48 text-gray-400">
            <p>No services data available</p>
          </div>
          }
        </div>
        } @else if (selectedBranch && loadingAnalytics) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span class="ml-3" [style.color]="'var(--text-secondary)'">Loading analytics...</span>
        </div>
        } @else if (!selectedBranch) {
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="text-5xl mb-4">👆</div>
          <p class="text-lg font-medium" [style.color]="'var(--text-primary)'">Select a Branch</p>
          <p class="text-sm" [style.color]="'var(--text-secondary)'">
            Click on a branch above to view its analytics
          </p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private branchService = inject(BranchService);
  langService = inject(LanguageService);

  stats: DashboardStats | null = null;
  revenueBreakdown: RevenueBreakdown | null = null;
  revenuePeriod: 'daily' | 'weekly' | 'monthly' = 'monthly';

  // Branch Analytics
  branches: Branch[] = [];
  selectedBranch: Branch | null = null;
  branchAnalytics: BranchAnalytics | null = null;
  loadingAnalytics = false;
  analyticsDays = 30;

  // Branch Analytics Chart Data
  bookingsPerDayData: any = null;
  revenuePerDayData: any = null;
  topServicesData: any = null;

  // Chart data
  revenueTrendData: any = null;
  revenueByBranchData: any = null;
  revenueByServiceData: any = null;
  revenueByBarberData: any = null;
  revenueByTimeData: any = null;
  customerData: any = null;

  // Chart options
  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  horizontalBarOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  areaChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      filler: {
        propagate: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        fill: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  // Branch Analytics Chart Options
  bookingsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString() + ' LE',
        },
      },
    },
  };

  servicesChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadBranches();
  }

  private loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
      error: (err) => {
        console.error('Failed to load branches:', err);
      },
    });
  }

  selectBranch(branch: Branch): void {
    this.selectedBranch = branch;
    this.loadBranchAnalytics(branch.id);
  }

  private loadBranchAnalytics(branchId: number): void {
    this.loadingAnalytics = true;
    this.branchAnalytics = null;

    this.analyticsService.getBranchAnalytics(branchId, this.analyticsDays).subscribe({
      next: (analytics) => {
        this.branchAnalytics = analytics;
        this.prepareBranchChartData(analytics);
        this.loadingAnalytics = false;
      },
      error: (err) => {
        console.error('Failed to load branch analytics:', err);
        this.loadingAnalytics = false;
      },
    });
  }

  private prepareBranchChartData(analytics: BranchAnalytics): void {
    // Bookings Per Day Chart
    if (analytics.bookingsPerDay && analytics.bookingsPerDay.length > 0) {
      this.bookingsPerDayData = {
        labels: analytics.bookingsPerDay.map((d) => this.formatDate(d.date)),
        datasets: [
          {
            label: 'Bookings',
            data: analytics.bookingsPerDay.map((d) => d.count),
            borderColor: '#0d9999',
            backgroundColor: 'rgba(13, 153, 153, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Revenue Per Day Chart
    if (analytics.revenuePerDay && analytics.revenuePerDay.length > 0) {
      this.revenuePerDayData = {
        labels: analytics.revenuePerDay.map((d) => this.formatDate(d.date)),
        datasets: [
          {
            label: 'Revenue',
            data: analytics.revenuePerDay.map((d) => d.amount),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    }

    // Top Services Chart
    if (analytics.topServices && analytics.topServices.length > 0) {
      this.topServicesData = {
        labels: analytics.topServices.map((s) => s.serviceName),
        datasets: [
          {
            label: 'Bookings',
            data: analytics.topServices.map((s) => s.count),
            backgroundColor: ['#0d9999', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          },
        ],
      };
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  private loadDashboardData(): void {
    // Load stats
    this.analyticsService.getDashboardStats().subscribe((stats) => {
      this.stats = stats;
    });

    // Load revenue breakdown
    this.analyticsService.getRevenueBreakdown().subscribe((breakdown) => {
      this.revenueBreakdown = breakdown;
      this.prepareChartData(breakdown);
    });

    // Load revenue trends
    this.loadRevenueTrends();
  }

  loadRevenueTrends(): void {
    this.analyticsService.getRevenueTrends(this.revenuePeriod).subscribe((trends) => {
      this.revenueTrendData = {
        labels: trends.map((t) => t.label),
        datasets: [
          {
            label: 'Revenue',
            data: trends.map((t) => t.value),
            borderColor: '#0d9999',
            backgroundColor: 'rgba(13, 153, 153, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      };
    });
  }

  private prepareChartData(breakdown: RevenueBreakdown): void {
    // Revenue by Branch
    this.revenueByBranchData = {
      labels: breakdown.byBranch.map((b) => b.branchName),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byBranch.map((b) => b.revenue),
          backgroundColor: '#0d9999',
        },
      ],
    };

    // Revenue by Service
    this.revenueByServiceData = {
      labels: breakdown.byService.map((s) => s.serviceName),
      datasets: [
        {
          data: breakdown.byService.map((s) => s.revenue),
          backgroundColor: ['#0d9999', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        },
      ],
    };

    // Revenue by Barber
    this.revenueByBarberData = {
      labels: breakdown.byBarber.map((b) => b.barberName),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byBarber.map((b) => b.revenue),
          backgroundColor: '#10b981',
        },
      ],
    };

    // Revenue by Time of Day
    this.revenueByTimeData = {
      labels: breakdown.byTimeOfDay.map((t) => `${t.hour}:00`),
      datasets: [
        {
          label: 'Revenue',
          data: breakdown.byTimeOfDay.map((t) => t.revenue),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Customer Data
    if (this.stats) {
      this.customerData = {
        labels: ['New Customers', 'Returning Customers'],
        datasets: [
          {
            data: [this.stats.newCustomers, this.stats.returningCustomers],
            backgroundColor: ['#0d9999', '#10b981'],
          },
        ],
      };
    }
  }
}
