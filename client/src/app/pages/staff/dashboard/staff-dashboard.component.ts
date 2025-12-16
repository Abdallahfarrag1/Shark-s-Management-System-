import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardComponent } from '../../../components/shared/ui-card.component';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, UiCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Today's Summary -->
      <div class="grid grid-cols-2 gap-4">
        <app-ui-card class="bg-blue-600 text-white border-none">
          <div class="p-4 text-center">
            <h3 class="text-2xl font-bold">8</h3>
            <p class="text-xs text-blue-100 uppercase tracking-wider">Bookings</p>
          </div>
        </app-ui-card>
        <app-ui-card class="bg-green-600 text-white border-none">
          <div class="p-4 text-center">
            <h3 class="text-2xl font-bold">\${{ 320 }}</h3>
            <p class="text-xs text-green-100 uppercase tracking-wider">Tips</p>
          </div>
        </app-ui-card>
      </div>

      <!-- Upcoming Schedule -->
      <div>
        <h3 class="font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span>Today's Schedule</span>
          <span class="text-xs font-normal text-gray-500">26 Nov, 2025</span>
        </h3>

        <div class="space-y-4 relative">
          <!-- Timeline Line -->
          <div class="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

          @for (apt of appointments; track apt.id) {
          <div class="relative pl-10">
            <!-- Time Dot -->
            <div
              class="absolute left-[13px] top-6 w-2 h-2 rounded-full border-2 border-white shadow-sm z-10"
              [class.bg-green-500]="apt.status === 'Completed'"
              [class.bg-blue-500]="apt.status === 'In Progress'"
              [class.bg-gray-300]="apt.status === 'Upcoming'"
            ></div>

            <app-ui-card
              [class.border-l-4]="true"
              [class.border-l-blue-500]="apt.status === 'In Progress'"
            >
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-bold text-lg text-gray-800">{{ apt.time }}</span>
                  <span
                    class="text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wide"
                    [class.bg-green-100]="apt.status === 'Completed'"
                    [class.text-green-800]="apt.status === 'Completed'"
                    [class.bg-blue-100]="apt.status === 'In Progress'"
                    [class.text-blue-800]="apt.status === 'In Progress'"
                    [class.bg-gray-100]="apt.status === 'Upcoming'"
                    [class.text-gray-600]="apt.status === 'Upcoming'"
                  >
                    {{ apt.status }}
                  </span>
                </div>
                <h4 class="font-bold text-gray-900">{{ apt.customer }}</h4>
                <p class="text-sm text-gray-500 mb-3">{{ apt.service }} • {{ apt.duration }} min</p>

                @if (apt.status === 'In Progress') {
                <div class="flex gap-2">
                  <button
                    class="flex-1 bg-green-600 text-white py-2 rounded-md text-sm font-medium shadow-sm active:scale-95 transition-transform"
                  >
                    Complete
                  </button>
                </div>
                } @else if (apt.status === 'Upcoming' && isNext(apt)) {
                <button
                  class="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium shadow-sm active:scale-95 transition-transform"
                >
                  Start Service
                </button>
                }
              </div>
            </app-ui-card>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class StaffDashboardComponent {
  appointments = [
    {
      id: 1,
      time: '10:00 AM',
      customer: 'John Doe',
      service: 'Haircut',
      duration: 30,
      status: 'Completed',
    },
    {
      id: 2,
      time: '10:45 AM',
      customer: 'Mike Ross',
      service: 'Beard Trim',
      duration: 15,
      status: 'Completed',
    },
    {
      id: 3,
      time: '11:30 AM',
      customer: 'Harvey Specter',
      service: 'Full Package',
      duration: 60,
      status: 'In Progress',
    },
    {
      id: 4,
      time: '01:00 PM',
      customer: 'Louis Litt',
      service: 'Shave',
      duration: 20,
      status: 'Upcoming',
    },
    {
      id: 5,
      time: '02:30 PM',
      customer: 'Donna Paulsen',
      service: 'Hair Dye',
      duration: 90,
      status: 'Upcoming',
    },
  ];

  isNext(apt: any) {
    return apt.id === 4; // Mock logic
  }
}
