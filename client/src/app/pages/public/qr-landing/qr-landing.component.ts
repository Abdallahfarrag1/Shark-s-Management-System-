import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-qr-landing',
  standalone: true,
  imports: [CommonModule, UiButtonComponent, UiCardComponent],
  template: `
    <div
      class="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center max-w-md mx-auto"
    >
      <div class="text-center mb-8">
        <span class="text-6xl">✂️</span>
        <h1 class="text-2xl font-bold mt-4 text-gray-900">BarberChain</h1>
        <p class="text-gray-500">Downtown Elite Branch</p>
      </div>

      <div class="w-full space-y-4">
        <!-- Rate Us Card -->
        <app-ui-card class="overflow-hidden">
          <div class="bg-primary p-6 text-center text-white">
            <h2 class="text-xl font-bold mb-2">How was your cut?</h2>
            <p class="text-gray-300 text-sm mb-4">Rate your experience today</p>
            <div class="flex justify-center gap-2 text-3xl mb-4">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <app-ui-button variant="secondary" [fullWidth]="true">Submit Review</app-ui-button>
          </div>
        </app-ui-card>

        <!-- Offers Card -->
        <app-ui-card>
          <div class="p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🔥</span> Today's Offers
            </h2>

            <div class="space-y-3">
              <div
                class="border border-dashed border-secondary bg-yellow-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 class="font-bold text-gray-800">Free Beard Trim</h3>
                  <p class="text-xs text-gray-500">With any Haircut + Wash</p>
                </div>
                <button class="text-secondary font-bold text-sm">CLAIM</button>
              </div>

              <div
                class="border border-dashed border-gray-300 bg-gray-50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 class="font-bold text-gray-800">20% Off Products</h3>
                  <p class="text-xs text-gray-500">Valid on all styling gels</p>
                </div>
                <button class="text-gray-600 font-bold text-sm">CLAIM</button>
              </div>
            </div>
          </div>
        </app-ui-card>

        <div class="text-center mt-8">
          <a href="#" class="text-sm text-gray-400 underline">View Full Menu</a>
        </div>
      </div>
    </div>
  `,
})
export class QrLandingComponent {}
