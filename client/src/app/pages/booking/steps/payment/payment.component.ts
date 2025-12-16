import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UiButtonComponent } from '../../../../components/shared/ui-button.component';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageService } from '../../../../core/services/language.service';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  template: `
    <h2 class="text-2xl font-bold mb-6">{{ t().paymentMethodTitle }}</h2>

    <div class="grid grid-cols-1 gap-4 mb-8">
      <!-- Cash Option -->
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors flex items-center gap-4"
        [class.border-primary]="bookingService.paymentMethod() === 'cash'"
        [class.bg-gray-50]="bookingService.paymentMethod() === 'cash'"
        (click)="selectPayment('cash')"
      >
        <div class="text-2xl">💵</div>
        <div>
          <h3 class="font-bold">{{ t().payCashTitle }}</h3>
          <p class="text-sm text-gray-500">{{ t().payCashDesc }}</p>
        </div>
      </div>

      <!-- PayPal Option -->
      <div
        class="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors duration-200"
        [class.border-primary]="bookingService.paymentMethod() === 'paypal'"
        [class.bg-gray-50]="bookingService.paymentMethod() === 'paypal'"
        (click)="selectPayment('paypal')"
      >
        <div class="flex items-center gap-4 mb-2">
          <div class="text-2xl">🅿️</div>
          <div>
            <h3 class="font-bold">{{ t().payPalTitle }}</h3>
            <p class="text-sm text-gray-500">{{ t().payPalDesc }}</p>
          </div>
        </div>

        <!-- PayPal Buttons SDK Container -->
        <div
          [class.hidden]="bookingService.paymentMethod() !== 'paypal'"
          class="mt-4 pl-0 sm:pl-10 border-t pt-4"
        >
          <div #paypalButtonContainer></div>
        </div>
      </div>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg mb-8">
      <h3 class="font-bold mb-2">{{ t().bookingSummary }}</h3>
      <div class="flex justify-between text-sm mb-1">
        <span>{{ t().serviceLabel }}</span>
        <span>{{ bookingService.selectedService()?.name }}</span>
      </div>
      <div class="flex justify-between text-sm mb-1">
        <span>{{ t().dateTimeLabel }}</span>
        <span
          >{{ bookingService.selectedDate() | date }} {{ t().at }}
          {{ bookingService.selectedTime() }}</span
        >
      </div>
      <div class="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
        <span>{{ t().totalLabel }}</span>
        <span>{{ bookingService.totalPrice() }} {{ t().currency }}</span>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <app-ui-button variant="outline" (click)="back()">{{ t().back }}</app-ui-button>

      <!-- Only show Pay & Book button for Cash -->
      @if (bookingService.paymentMethod() === 'cash') {
      <app-ui-button (click)="next()" [disabled]="isProcessing">
        @if (isProcessing) { {{ t().processing }} } @else { {{ t().bookBtn }} }
      </app-ui-button>
      }
    </div>
  `,
})
export class PaymentComponent {
  bookingService = inject(BookingService);
  router = inject(Router);
  authService = inject(AuthService);
  languageService = inject(LanguageService);

  t = this.languageService.t;

  @ViewChild('paypalButtonContainer', { static: false }) paypalButtonContainer!: ElementRef;

  isProcessing = false;
  paypalInitialized = false;

  selectPayment(method: 'cash' | 'paypal') {
    this.bookingService.paymentMethod.set(method);

    if (method === 'paypal' && !this.paypalInitialized) {
      this.tryRenderPayPal();
    }
  }

  tryRenderPayPal() {
    if (this.paypalInitialized) return;

    // Check if window.paypal exists
    const paypalObj = (window as any).paypal;

    if (paypalObj && this.paypalButtonContainer) {
      console.log('PayPal SDK found, rendering...');
      this.renderButtons(paypalObj);
    } else {
      console.log('PayPal SDK not found, attempting to load script...');
      this.loadPaypalScript()
        .then(() => {
          // Once loaded, try rendering again
          const loadedPaypal = (window as any).paypal;
          if (loadedPaypal && this.paypalButtonContainer) {
            this.renderButtons(loadedPaypal);
          } else {
            console.error('PayPal loaded but object or container still missing');
          }
        })
        .catch((err) => {
          console.error('Failed to load PayPal script', err);
        });
    }
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-sdk-script')) {
        resolve(); // Script already exists
        return;
      }

      const script = document.createElement('script');
      script.id = 'paypal-sdk-script';
      script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD';
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  renderButtons(paypalObj: any) {
    if (this.paypalInitialized) return;
    this.paypalInitialized = true;

    try {
      paypalObj
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.bookingService.totalPrice().toString(),
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              this.confirmBooking();
            });
          },
          onError: (err: any) => {
            console.error('PayPal Error', err);
            alert('PayPal payment failed');
          },
        })
        .render(this.paypalButtonContainer.nativeElement);
    } catch (err) {
      console.error('Error rendering PayPal buttons:', err);
    }
  }

  back() {
    this.router.navigate(['/booking/barber']);
  }

  next() {
    this.confirmBooking();
  }

  confirmBooking() {
    if (this.isProcessing) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.id) {
      alert('Please log in again to book an appointment (Session expired or invalid)');
      this.authService.logout();
      return;
    }

    this.isProcessing = true;

    // Construct payload
    const service = this.bookingService.selectedService();
    const branch = this.bookingService.selectedBranch();
    const barber = this.bookingService.selectedBarber();
    const date = this.bookingService.selectedDate();
    const time = this.bookingService.selectedTime();

    if (!service || !date || !time) {
      this.isProcessing = false;
      return;
    }

    // Handle next day logic for payload
    let effectiveDate = new Date(date);
    const hour = parseInt(time.split(':')[0]);

    if (hour >= 0 && hour <= 2) {
      effectiveDate.setDate(effectiveDate.getDate() + 1);
    }

    const year = effectiveDate.getFullYear();
    const month = String(effectiveDate.getMonth() + 1).padStart(2, '0');
    const day = String(effectiveDate.getDate()).padStart(2, '0');

    const startAt = `${year}-${month}-${day}T${time}:00`;

    // Fetch customer fullName from localStorage
    const storedFullName = localStorage.getItem('fullName');
    const customerName =
      storedFullName ||
      `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() ||
      'Unknown';

    const payload = {
      customerId: currentUser.id,
      customerName: customerName,
      barberId: barber ? barber.barberId : 0,
      serviceId: service.id,
      branchId: branch?.id || 10,
      startAt: startAt,
    };

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.isProcessing = false;
        this.router.navigate(['/booking/confirmation']);
      },
      error: (err) => {
        console.error('Booking failed', err);
        this.isProcessing = false;
        alert('Booking failed. Please try again.');
      },
    });
  }
}
