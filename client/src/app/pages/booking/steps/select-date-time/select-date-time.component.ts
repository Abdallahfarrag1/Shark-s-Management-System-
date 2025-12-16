import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-select-date-time',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">{{ t().selectDateTimeTitle }}</h2>

    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t().dateLabel }}</label>
      <input
        type="date"
        class="w-full p-2 border rounded-md"
        [min]="minDate"
        [max]="maxDate"
        (change)="onDateChange($event)"
      />
    </div>

    @if (bookingService.selectedDate()) {
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">{{ t().selectTimeLabel }}</label>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
        @for (slot of timeSlots; track slot) {
        <button
          class="py-2 px-4 rounded-md border text-sm font-medium transition-colors"
          [class.bg-primary]="bookingService.selectedTime() === slot"
          [class.text-white]="bookingService.selectedTime() === slot"
          [class.hover:bg-gray-100]="bookingService.selectedTime() !== slot"
          (click)="selectTime(slot)"
        >
          {{ slot }}
          @if (isNextDay(slot)) {
          <span class="text-xs ml-1 opacity-75 block font-normal">{{ t().nextDay }}</span>
          }
        </button>
        }
      </div>
    </div>
    }

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">{{ t().back }}</app-ui-button>
      <app-ui-button
        (click)="next()"
        [disabled]="!bookingService.selectedDate() || !bookingService.selectedTime()"
      >
        {{ t().nextBarber }}
      </app-ui-button>
    </div>
  `,
})
export class SelectDateTimeComponent {
  bookingService = inject(BookingService);
  languageService = inject(LanguageService);
  router = inject(Router);

  t = this.languageService.t;

  // Hardcoded slots from 10:00 AM to 02:00 AM (next day)
  timeSlots = [
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
  ];

  minDate: string;
  maxDate: string;

  constructor() {
    const today = new Date();
    this.minDate = this.formatDate(today);

    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    this.maxDate = this.formatDate(next30Days);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.target.value);
    // Reset time when date changes
    this.bookingService.selectedDate.set(selectedDate);
    this.bookingService.selectedTime.set(null);
  }

  selectTime(time: string) {
    this.bookingService.selectedTime.set(time);
  }

  isNextDay(time: string): boolean {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 0 && hour <= 2;
  }

  back() {
    this.router.navigate(['/booking/service']);
  }

  next() {
    this.router.navigate(['/booking/barber']);
  }
}
