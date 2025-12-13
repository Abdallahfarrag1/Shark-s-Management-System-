import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-booking-flow',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Stepper -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative">
          <div
            class="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"
          ></div>

          @for (step of steps; track step.path; let i = $index) {
          <div class="flex flex-col items-center bg-white px-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors"
              [class.bg-primary]="isStepActive(step.path) || isStepCompleted(i)"
              [class.text-white]="isStepActive(step.path) || isStepCompleted(i)"
              [class.bg-gray-200]="!isStepActive(step.path) && !isStepCompleted(i)"
              [class.text-gray-500]="!isStepActive(step.path) && !isStepCompleted(i)"
            >
              {{ i + 1 }}
            </div>
            <span class="text-xs font-medium text-gray-600 hidden md:block">{{
              t()[step.key]
            }}</span>
          </div>
          }
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-lg p-6 min-h-[400px]">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class BookingFlowComponent {
  bookingService = inject(BookingService);
  languageService = inject(LanguageService);
  router = inject(Router);

  t = this.languageService.t;

  steps = [
    { path: 'service', key: 'stepService' },
    { path: 'date-time', key: 'stepDateTime' },
    { path: 'barber', key: 'stepBarber' },
    { path: 'payment', key: 'stepPayment' },
    { path: 'confirmation', key: 'stepConfirm' },
  ];

  isStepActive(path: string) {
    return this.router.url.includes(path);
  }

  isStepCompleted(index: number) {
    const currentPath = this.router.url.split('/').pop();
    const currentIndex = this.steps.findIndex((s) => s.path === currentPath);
    return currentIndex > index;
  }
}
