import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { BranchService } from '../../../../core/services/branch.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-select-barber',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">{{ t().selectBarberTitle }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <!-- Any Professional Option -->
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.selectedBarber() === null"
        [class.bg-gray-50]="bookingService.selectedBarber() === null"
        (click)="selectBarber(null)"
      >
        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          ?
        </div>
        <div>
          <h3 class="font-bold">{{ t().anyProfessional }}</h3>
          <p class="text-sm text-gray-500">{{ t().firstAvailableBarber }}</p>
        </div>
      </div>

      <!-- Barber Options -->
      @if (isLoading()) {
      <div class="col-span-full flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      } @else { @for (barber of availableBarbers(); track barber.barberId) {
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.selectedBarber()?.barberId === barber.barberId"
        [class.bg-gray-50]="bookingService.selectedBarber()?.barberId === barber.barberId"
        (click)="selectBarber(barber)"
      >
        <div
          class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500"
        >
          {{ barber.firstName.charAt(0) }}{{ barber.lastName.charAt(0) }}
        </div>
        <div>
          <h3 class="font-bold">{{ barber.firstName }} {{ barber.lastName }}</h3>
          <p class="text-sm text-gray-500">{{ barber.phoneNumber }}</p>
        </div>
      </div>
      } }
    </div>

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">{{ t().back }}</app-ui-button>
      <app-ui-button (click)="next()">{{ t().nextPayment }}</app-ui-button>
    </div>
  `,
})
export class SelectBarberComponent implements OnInit {
  bookingService = inject(BookingService);
  branchService = inject(BranchService);
  languageService = inject(LanguageService);
  router = inject(Router);

  t = this.languageService.t;

  availableBarbers = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadAvailableBarbers();
  }

  loadAvailableBarbers() {
    const selectedDate = this.bookingService.selectedDate();
    const selectedTime = this.bookingService.selectedTime();
    const branch = this.bookingService.selectedBranch();

    console.log('SelectBarberComponent Init:', { selectedDate, selectedTime, branch });

    if (!branch) {
      console.warn('No branch selected! Redirecting...');
      this.router.navigate(['/booking/service']); // Redirect to start if no branch
      return;
    }
    const branchId = branch.id;

    if (selectedDate && selectedTime) {
      this.isLoading.set(true);

      // Clone date to avoid mutating the signal's value reference if it were an object (though signals are immutable-ish, Date objects are mutable)
      const effectiveDate = new Date(selectedDate);
      const hour = parseInt(selectedTime.split(':')[0], 10);

      // Handle next day logic for late night slots (00:00 - 02:00)
      if (hour >= 0 && hour <= 2) {
        effectiveDate.setDate(effectiveDate.getDate() + 1);
      }

      const dateStr = this.formatDate(effectiveDate);
      console.log('Fetching barbers for:', { branchId, dateStr, selectedTime });

      this.bookingService.getAvailableBarbers(branchId, dateStr, selectedTime).subscribe({
        next: (barbers) => {
          console.log('Barbers loaded:', barbers);
          this.availableBarbers.set(barbers);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load barbers', err);
          this.isLoading.set(false);
        },
      });
    } else {
      console.warn('Missing date or time', { selectedDate, selectedTime });
      // Optionally redirect back if date/time missing
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectBarber(barber: any) {
    this.bookingService.selectedBarber.set(barber);
  }

  back() {
    this.router.navigate(['/booking/date-time']);
  }

  next() {
    this.router.navigate(['/booking/payment']);
  }
}
