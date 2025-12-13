import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-staff-queue',
  standalone: true,
  imports: [CommonModule, UiCardComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Walk-in Queue</h2>
        <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full"
          >3 Waiting</span
        >
      </div>

      <!-- Next Customer Card -->
      <app-ui-card class="border-l-4 border-l-green-500 bg-green-50">
        <div class="p-6 text-center">
          <p class="text-sm text-green-700 font-medium mb-2">NEXT CUSTOMER</p>
          <div
            class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-green-600 mx-auto shadow-sm mb-4"
          >
            A12
          </div>
          <h3 class="text-xl font-bold text-gray-900">Walk-in Guest</h3>
          <p class="text-gray-600 mb-6">Haircut • 30 min</p>

          <button
            class="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span>📢</span> Call Customer
          </button>
        </div>
      </app-ui-card>

      <!-- Waiting List -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider">Up Next</h3>

        @for (item of queue; track item.id) {
        <div
          class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <span class="font-mono font-bold text-gray-500">#{{ item.ticket }}</span>
            <div>
              <h4 class="font-bold text-gray-900">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">{{ item.service }}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="block text-sm font-bold text-gray-700">{{ item.waitTime }}m</span>
            <span class="text-[10px] text-gray-400">WAIT</span>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class StaffQueueComponent {
  queue = [
    { id: 2, ticket: 'A13', name: 'John Doe', service: 'Beard Trim', waitTime: 15 },
    { id: 3, ticket: 'A14', name: 'Mike Ross', service: 'Full Package', waitTime: 35 },
    { id: 4, ticket: 'A15', name: 'Harvey Specter', service: 'Shave', waitTime: 50 },
  ];
}
