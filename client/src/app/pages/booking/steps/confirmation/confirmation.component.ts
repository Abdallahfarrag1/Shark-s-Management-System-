import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent],
  template: `
    <div class="text-center py-8">
      <div
        class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
      >
        ✅
      </div>
      <h2 class="text-3xl font-bold mb-4">{{ t().bookingConfirmedTitle }}</h2>
      <p class="text-gray-600 mb-8">
        {{ t().bookingConfirmedDesc }}
      </p>

      <div class="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8 text-left">
        <h3 class="font-bold mb-4 border-b pb-2">{{ t().appointmentDetails }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t().serviceLabel }}</span>
            <span class="font-medium">{{ bookingService.selectedService()?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t().dateLabel }}</span>
            <span class="font-medium">{{ bookingService.selectedDate() | date }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t().timeLabel }}</span>
            <span class="font-medium">{{ bookingService.selectedTime() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t().barberLabel }}</span>
            <span class="font-medium">
              @if (bookingService.selectedBarber()) {
              {{ bookingService.selectedBarber()?.firstName }}
              {{ bookingService.selectedBarber()?.lastName }}
              } @else { {{ t().anyProfessional }} }
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t().paymentLabel }}</span>
            <span class="font-medium capitalize">{{ bookingService.paymentMethod() }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-4 justify-center">
        <app-ui-button routerLink="/">{{ t().backToHome }}</app-ui-button>
        <app-ui-button routerLink="/my-history" variant="outline">{{
          t().viewMyBookings
        }}</app-ui-button>
      </div>
    </div>
  `,
})
export class ConfirmationComponent {
  bookingService = inject(BookingService);
  languageService = inject(LanguageService);
  t = this.languageService.t;
}
