import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            Advanced Analytics
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            Deep dive into performance metrics and insights
          </p>
        </div>
        <div class="flex gap-2">
          <button class="btn-outline" (click)="customizeReport()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Customize
          </button>
          <button class="btn-primary" (click)="exportReport()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <!-- Time Period Selector -->
      <div class="card p-4">
        <div class="flex flex-wrap gap-2">
          @for (period of timePeriods; track period) {
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            [class]="
              selectedPeriod() === period
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            "
            [style.color]="selectedPeriod() === period ? 'white' : 'var(--text-primary)'"
            (click)="selectPeriod(period)"
          >
            {{ period }}
          </button>
          }
        </div>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (metric of analyticsMetrics; track metric.title) {
        <div
          class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          (click)="viewMetricDetails(metric.title)"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-sm" [style.color]="'var(--text-secondary)'">{{ metric.title }}</p>
              <h3 class="text-3xl font-bold mt-2" [style.color]="'var(--text-primary)'">
                {{ metric.value }}
              </h3>
            </div>
            <div class="text-3xl">{{ metric.icon }}</div>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <span
              [class]="metric.trend > 0 ? 'text-green-600' : 'text-red-600'"
              class="font-semibold"
            >
              {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
            </span>
            <span [style.color]="'var(--text-tertiary)'">vs last period</span>
          </div>

          <!-- Mini Chart Placeholder -->
          <div class="mt-4 h-12 flex items-end gap-1">
            @for (bar of metric.chartData; track $index) {
            <div
              class="flex-1 rounded-t"
              [style.height.%]="bar"
              [style.background]="
                metric.trend > 0 ? 'var(--color-success-500)' : 'var(--color-danger-500)'
              "
            ></div>
            }
          </div>
        </div>
        }
      </div>

      <!-- Insights Section -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4" [style.color]="'var(--text-primary)'">
          Key Insights
        </h2>
        <div class="space-y-3">
          @for (insight of keyInsights; track insight.title) {
          <div
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="text-2xl">{{ insight.icon }}</div>
            <div class="flex-1">
              <h4 class="font-medium" [style.color]="'var(--text-primary)'">{{ insight.title }}</h4>
              <p class="text-sm mt-1" [style.color]="'var(--text-secondary)'">
                {{ insight.description }}
              </p>
            </div>
            <button
              class="text-sm text-blue-600 hover:text-blue-800"
              (click)="viewInsightDetails(insight.title)"
            >
              View
            </button>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .bg-primary {
        background-color: var(--color-primary-500);
      }
    `,
  ],
})
export class AnalyticsComponent {
  private toastService = signal(new ToastService()).asReadonly();
  Math = Math;

  timePeriods = ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];
  selectedPeriod = signal('This Month');

  analyticsMetrics = [
    {
      title: 'Total Revenue',
      value: '$125.5K',
      icon: '💰',
      trend: 12.5,
      chartData: [60, 70, 65, 80, 75, 90, 100],
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      icon: '⭐',
      trend: 5.2,
      chartData: [70, 75, 72, 80, 85, 88, 90],
    },
    {
      title: 'Booking Rate',
      value: '87%',
      icon: '📈',
      trend: 8.3,
      chartData: [65, 70, 75, 72, 80, 85, 87],
    },
    {
      title: 'Staff Efficiency',
      value: '92%',
      icon: '⚡',
      trend: 3.1,
      chartData: [80, 82, 85, 88, 89, 91, 92],
    },
    {
      title: 'Customer Retention',
      value: '76%',
      icon: '🔄',
      trend: -2.4,
      chartData: [82, 80, 78, 77, 76, 75, 76],
    },
    {
      title: 'Avg Wait Time',
      value: '12 min',
      icon: '⏱️',
      trend: -15.3,
      chartData: [100, 95, 90, 85, 80, 75, 70],
    },
  ];

  keyInsights = [
    {
      icon: '🎯',
      title: 'Peak Hours Optimization',
      description: 'Bookings peak between 2-5 PM. Consider adding more staff during these hours.',
    },
    {
      icon: '💡',
      title: 'Service Recommendation',
      description: 'Hair coloring services show 45% growth. Promote this service more actively.',
    },
    {
      icon: '📊',
      title: 'Branch Performance',
      description: 'New Cairo Hub outperforms other branches by 23%. Analyze their best practices.',
    },
    {
      icon: '⚠️',
      title: 'Cancellation Alert',
      description: 'Cancellation rate increased by 8% this week. Follow up with customers.',
    },
  ];

  selectPeriod(period: string) {
    this.selectedPeriod.set(period);
    this.toastService().info('Period Changed', `Showing analytics for: ${period}`);
  }

  viewMetricDetails(metric: string) {
    this.toastService().info('Metric Details', `Detailed view for: ${metric}`);
  }

  viewInsightDetails(insight: string) {
    this.toastService().info('Insight Details', `Detailed analysis for: ${insight}`);
  }

  customizeReport() {
    this.toastService().info('Customize Report', 'Report customization options will appear here');
  }

  exportReport() {
    this.toastService().success('Export', 'Analytics report exported successfully');
  }
}
