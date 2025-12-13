import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DaySchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  startTime: string; // HH:mm format
  endTime: string;
}

@Component({
  selector: 'app-barber-schedule-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-semibold text-sm" [style.color]="'var(--text-primary)'">
          Working Schedule
        </h4>
        <div class="flex gap-2">
          <button
            type="button"
            (click)="copyToWeekdays()"
            class="text-xs px-3 py-1 rounded-md border transition-colors"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-secondary)'"
          >
            Copy to Weekdays
          </button>
          <button
            type="button"
            (click)="clearAll()"
            class="text-xs px-3 py-1 rounded-md border transition-colors"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-secondary)'"
          >
            Clear All
          </button>
        </div>
      </div>

      <div class="space-y-2">
        @for (day of weekDays; track day.value) {
        <div
          class="flex items-center gap-3 p-3 rounded-lg border transition-colors"
          [style.border-color]="
            scheduleSignal()[day.value].enabled ? 'var(--color-primary-500)' : 'var(--border-light)'
          "
          [style.background-color]="
            scheduleSignal()[day.value].enabled ? 'var(--color-primary-50)' : 'transparent'
          "
        >
          <!-- Day Toggle -->
          <label class="flex items-center cursor-pointer min-w-[100px]">
            <input
              type="checkbox"
              [(ngModel)]="scheduleSignal()[day.value].enabled"
              (change)="onScheduleChange()"
              class="w-4 h-4 rounded"
              [style.accent-color]="'var(--color-primary-500)'"
            />
            <span class="ml-2 text-sm font-medium" [style.color]="'var(--text-primary)'">
              {{ day.label }}
            </span>
          </label>

          @if (scheduleSignal()[day.value].enabled) {
          <!-- Time Pickers -->
          <div class="flex items-center gap-2 flex-1">
            <input
              type="time"
              [(ngModel)]="scheduleSignal()[day.value].startTime"
              (change)="onScheduleChange()"
              class="input text-sm py-1 px-2 w-24"
              required
            />
            <span class="text-sm" [style.color]="'var(--text-secondary)'">to</span>
            <input
              type="time"
              [(ngModel)]="scheduleSignal()[day.value].endTime"
              (change)="onScheduleChange()"
              class="input text-sm py-1 px-2 w-24"
              required
            />

            <!-- Validation Error -->
            @if (hasTimeError(day.value)) {
            <span class="text-xs text-red-500 ml-2">Invalid time range</span>
            }
          </div>

          <!-- Remove Button -->
          <button
            type="button"
            (click)="toggleDay(day.value, false)"
            class="text-red-500 hover:text-red-700 transition-colors"
            title="Remove day"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          } @else {
          <span class="text-sm italic flex-1" [style.color]="'var(--text-tertiary)'">
            Day Off
          </span>
          }
        </div>
        }
      </div>

      <!-- Summary -->
      <div class="text-xs pt-2" [style.color]="'var(--text-secondary)'">
        {{ getActiveDaysCount() }} working days • {{ getTotalHours() }} hours/week
      </div>
    </div>
  `,
  styles: [
    `
      input[type='time']::-webkit-calendar-picker-indicator {
        cursor: pointer;
      }
    `,
  ],
})
export class BarberScheduleFormComponent {
  @Input()
  set schedules(value: DaySchedule[]) {
    if (value && value.length > 0) {
      this.scheduleSignal.set(value);
    }
  }

  @Output() schedulesChange = new EventEmitter<DaySchedule[]>();

  weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  scheduleSignal = signal<DaySchedule[]>(
    this.weekDays.map((day) => ({
      dayOfWeek: day.value,
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
    }))
  );

  onScheduleChange() {
    this.schedulesChange.emit(this.scheduleSignal());
  }

  toggleDay(dayOfWeek: number, enabled: boolean) {
    this.scheduleSignal.update((schedule) => {
      const updated = [...schedule];
      updated[dayOfWeek] = { ...updated[dayOfWeek], enabled };
      return updated;
    });
    this.onScheduleChange();
  }

  copyToWeekdays() {
    // Find first enabled day or use default times
    const firstEnabled = this.scheduleSignal().find((d) => d.enabled);
    const startTime = firstEnabled?.startTime || '09:00';
    const endTime = firstEnabled?.endTime || '17:00';

    this.scheduleSignal.update((schedule) => {
      return schedule.map((day, index) => {
        // Monday to Friday (1-5)
        if (index >= 1 && index <= 5) {
          return { ...day, enabled: true, startTime, endTime };
        }
        return day;
      });
    });
    this.onScheduleChange();
  }

  clearAll() {
    this.scheduleSignal.update((schedule) => schedule.map((day) => ({ ...day, enabled: false })));
    this.onScheduleChange();
  }

  hasTimeError(dayOfWeek: number): boolean {
    const day = this.scheduleSignal()[dayOfWeek];
    if (!day.enabled) return false;
    return day.startTime >= day.endTime;
  }

  getActiveDaysCount(): number {
    return this.scheduleSignal().filter((d) => d.enabled).length;
  }

  getTotalHours(): number {
    return this.scheduleSignal()
      .filter((d) => d.enabled)
      .reduce((total, day) => {
        const start = this.timeToMinutes(day.startTime);
        const end = this.timeToMinutes(day.endTime);
        return total + (end - start) / 60;
      }, 0);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
