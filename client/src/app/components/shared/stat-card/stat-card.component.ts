import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatCardVariant = 'primary' | 'success' | 'warning' | 'danger' | 'default';
export type StatCardSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="stat-card slide-in-up"
      [class.stat-card-sm]="size === 'sm'"
      [class.stat-card-lg]="size === 'lg'"
      [ngClass]="'stat-card-' + variant"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium opacity-80 mb-1">{{ title }}</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-3xl font-bold counter">{{ value | number }}</h3>
            @if (trend !== undefined) {
            <span
              class="text-sm font-semibold flex items-center gap-1"
              [class.text-green-600]="trend > 0"
              [class.text-red-600]="trend < 0"
              [class.text-gray-500]="trend === 0"
            >
              @if (trend > 0) {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              } @else if (trend < 0) {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              }
              {{ trend > 0 ? '+' : '' }}{{ trend }}%
            </span>
            }
          </div>
          @if (subtitle) {
          <p class="text-xs opacity-60 mt-1">{{ subtitle }}</p>
          }
        </div>
        @if (icon) {
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center opacity-20"
          [ngClass]="'bg-' + variant + '-500'"
        >
          <span class="text-2xl">{{ icon }}</span>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .stat-card {
        @apply bg-white rounded-lg shadow-md p-6 transition-all duration-300 relative overflow-hidden;
        background-color: var(--surface);
        border: 1px solid var(--border-light);
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
      }

      .stat-card-sm {
        @apply p-4;
      }

      .stat-card-lg {
        @apply p-8;
      }

      .stat-card-primary::before {
        background: var(--color-primary-500);
      }

      .stat-card-success::before {
        background: var(--color-success-500);
      }

      .stat-card-warning::before {
        background: var(--color-warning-500);
      }

      .stat-card-danger::before {
        background: var(--color-danger-500);
      }

      .stat-card-default::before {
        background: var(--color-gray-400);
      }
    `,
  ],
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() subtitle?: string;
  @Input() trend?: number; // percentage change
  @Input() icon?: string; // emoji or icon
  @Input() variant: StatCardVariant = 'default';
  @Input() size: StatCardSize = 'md';
}
