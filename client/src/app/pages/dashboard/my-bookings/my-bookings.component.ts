import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, UiCardComponent, UiButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Bookings</h1>

      <div class="space-y-6">
        <!-- Upcoming Booking -->
        <h2 class="text-xl font-bold text-gray-700">Upcoming</h2>
        <app-ui-card>
          <div
            class="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold"
                  >CONFIRMED</span
                >
                <span class="text-gray-500 text-sm">#BK-12345</span>
              </div>
              <h3 class="text-xl font-bold">Classic Haircut</h3>
              <p class="text-gray-600">Downtown Elite Branch</p>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📅 Nov 28, 2025</span>
                <span>⏰ 14:00</span>
                <span>👤 Ahmed Ali</span>
              </div>
            </div>
            <div class="flex gap-3">
              <app-ui-button variant="outline" size="sm">Reschedule</app-ui-button>
              <app-ui-button
                variant="outline"
                size="sm"
                class="text-red-600 border-red-200 hover:bg-red-50"
                >Cancel</app-ui-button
              >
            </div>
          </div>
        </app-ui-card>

        <!-- Past Bookings -->
        <h2 class="text-xl font-bold text-gray-700 mt-8">Past</h2>
        <app-ui-card>
          <div
            class="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-75"
          >
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-bold"
                  >COMPLETED</span
                >
                <span class="text-gray-500 text-sm">#BK-98765</span>
              </div>
              <h3 class="text-xl font-bold">Beard Trim</h3>
              <p class="text-gray-600">Zamalek Classic Branch</p>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>📅 Oct 15, 2025</span>
                <span>⏰ 10:30</span>
                <span>👤 Karim Hassan</span>
              </div>
            </div>
            <div>
              <app-ui-button variant="secondary" size="sm">Rate Service</app-ui-button>
            </div>
          </div>
        </app-ui-card>
      </div>
    </div>
  `,
})
export class MyBookingsComponent {}
