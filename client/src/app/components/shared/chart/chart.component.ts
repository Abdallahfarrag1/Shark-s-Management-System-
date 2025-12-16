import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" [style.height]="height">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        position: relative;
        width: 100%;
      }

      canvas {
        max-width: 100%;
      }
    `,
  ],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() type: ChartType = 'line';
  @Input() data: any;
  @Input() options: any = {};
  @Input() height: string = '300px';

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            color:
              getComputedStyle(document.documentElement)
                .getPropertyValue('--text-primary')
                .trim() || '#111827',
            font: {
              family: 'Inter, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {},
        },
      },
      scales:
        this.type === 'line' || this.type === 'bar'
          ? {
              y: {
                beginAtZero: true,
                grid: {
                  color:
                    getComputedStyle(document.documentElement)
                      .getPropertyValue('--border-light')
                      .trim() || '#e5e7eb',
                },
                ticks: {
                  color:
                    getComputedStyle(document.documentElement)
                      .getPropertyValue('--text-secondary')
                      .trim() || '#6b7280',
                },
              },
              x: {
                grid: {
                  color:
                    getComputedStyle(document.documentElement)
                      .getPropertyValue('--border-light')
                      .trim() || '#e5e7eb',
                },
                ticks: {
                  color:
                    getComputedStyle(document.documentElement)
                      .getPropertyValue('--text-secondary')
                      .trim() || '#6b7280',
                },
              },
            }
          : {},
    };

    const config: ChartConfiguration = {
      type: this.type,
      data: this.data,
      options: { ...defaultOptions, ...this.options },
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    this.chart.data = this.data;
    this.chart.options = { ...this.chart.options, ...this.options };
    this.chart.update();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
