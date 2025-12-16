import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-select-service',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">{{ t().selectServiceTitle }}</h2>
    <div class="grid grid-cols-1 gap-4">
      @if (services$ | async; as services) { @for (service of services; track service.id) {
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
        [class.border-primary]="bookingService.selectedService()?.id === service.id"
        [class.bg-gray-50]="bookingService.selectedService()?.id === service.id"
        (click)="selectService(service)"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold">{{ service.name }}</h3>
            <p class="text-sm text-gray-500">{{ service.description }}</p>
          </div>
          <div class="text-lg font-bold">{{ service.price }} {{ t().currency }}</div>
        </div>
      </div>
      } } @else {
      <div class="text-center py-8 text-gray-500">{{ t().loadingServices }}</div>
      }
    </div>
    <div class="mt-8 flex justify-end">
      <app-ui-button (click)="next()" [disabled]="!bookingService.selectedService()">
        {{ t().nextDateTime }}
      </app-ui-button>
    </div>
  `,
})
export class SelectServiceComponent {
  bookingService = inject(BookingService);
  languageService = inject(LanguageService);
  router = inject(Router);

  t = this.languageService.t;

  services$ = this.bookingService.getServices();

  selectService(service: any) {
    this.bookingService.selectedService.set(service);
  }

  next() {
    this.router.navigate(['/booking/date-time']);
  }
}
