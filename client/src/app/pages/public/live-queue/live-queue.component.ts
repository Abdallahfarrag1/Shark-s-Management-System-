import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from '../../../core/services/queue.service';
import { interval, Subscription } from 'rxjs';

interface LiveChairStatus {
  id: number;
  name: string;
  assignedBarberId: number;
  assignedBarberName: string;
  occupied: boolean;
  currentBookingId: number | null;
  currentCustomerName: string | null;
}

@Component({
  selector: 'app-live-queue',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Simple Grid of Chairs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (chair of chairs(); track chair.id) {
          <div
            class="bg-white rounded-lg shadow p-6 border-4"
            [class.border-red-500]="chair.occupied"
            [class.border-green-500]="!chair.occupied"
          >
            <!-- Chair Number -->
            <div class="text-center mb-4">
              <div
                class="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-2"
                [class.bg-red-100]="chair.occupied"
                [class.text-red-700]="chair.occupied"
                [class.bg-green-100]="!chair.occupied"
                [class.text-green-700]="!chair.occupied"
              >
                {{ chair.name }}
              </div>
              <h3 class="text-xl font-bold text-gray-900">Chair {{ chair.name }}</h3>
            </div>

            <!-- Barber Name -->
            <div class="text-center mb-4">
              <p class="text-sm text-gray-600">Barber</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ chair.assignedBarberName }}
              </p>
            </div>

            <!-- Status -->
            <div class="text-center mb-4">
              <div
                class="inline-block px-6 py-2 rounded-full text-lg font-bold"
                [class.bg-red-500]="chair.occupied"
                [class.text-white]="chair.occupied"
                [class.bg-green-500]="!chair.occupied"
                [class.text-white]="!chair.occupied"
              >
                {{ chair.occupied ? 'BUSY' : 'FREE' }}
              </div>
            </div>

            <!-- Customer Name (if occupied) -->
            @if (chair.occupied && chair.currentCustomerName) {
            <div class="text-center pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">Current Customer</p>
              <p class="text-lg font-bold text-gray-900">
                {{ chair.currentCustomerName }}
              </p>
            </div>
            }
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LiveQueueComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private route = inject(ActivatedRoute);

  chairs = signal<LiveChairStatus[]>([]);
  private refreshSubscription?: Subscription;
  private branchId: number = 0;

  ngOnInit() {
    // Get branchId from route params
    this.route.params.subscribe((params) => {
      this.branchId = +params['branchId'];
      if (this.branchId) {
        this.loadLiveQueue();

        // Auto-refresh every 5 seconds
        this.refreshSubscription = interval(5000).subscribe(() => {
          this.loadLiveQueue();
        });
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  loadLiveQueue() {
    this.queueService.getLiveQueue(this.branchId).subscribe({
      next: (data) => {
        this.chairs.set(data);
      },
      error: (err) => {
        console.error('Error loading live queue:', err);
      },
    });
  }
}
