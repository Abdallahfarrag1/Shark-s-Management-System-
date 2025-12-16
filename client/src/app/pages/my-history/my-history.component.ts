import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { BranchService, Branch } from '../../core/services/branch.service';
import { OrderDto } from '../../core/models/order.model';
import { BookingDto, BookingStatus } from '../../core/models/models';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-my-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">{{ t().myHistory }}</h1>

      <!-- Tabs -->
      <div class="flex gap-4 mb-8 border-b">
        <button
          (click)="activeTab.set('bookings')"
          [class.border-primary-600]="activeTab() === 'bookings'"
          [class.text-primary-600]="activeTab() === 'bookings'"
          [class.text-gray-500]="activeTab() !== 'bookings'"
          class="pb-2 px-4 font-medium border-b-2 transition hover:text-gray-700"
        >
          {{ t().myBookings }}
        </button>
        <button
          (click)="activeTab.set('orders')"
          [class.border-primary-600]="activeTab() === 'orders'"
          [class.text-primary-600]="activeTab() === 'orders'"
          [class.text-gray-500]="activeTab() !== 'orders'"
          class="pb-2 px-4 font-medium border-b-2 border-transparent transition hover:text-gray-700"
        >
          {{ t().myOrders }}
        </button>
      </div>

      <!-- Bookings Tab -->
      @if (activeTab() === 'bookings') {
      <div>
        @if (isLoadingBookings()) {
        <p class="text-gray-500">{{ t().loadingBookings }}</p>
        } @else if (bookings().length === 0) {
        <div class="text-center py-16">
          <p class="text-gray-600">{{ t().noBookingsYet }}</p>
        </div>
        } @else {
        <div class="space-y-4">
          @for (booking of bookings(); track booking.id) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h3 class="text-lg font-bold mb-2">{{ t().serialCode }}: #{{ booking.id }}</h3>
                <h4 class="text-lg font-semibold text-primary-600">
                  {{ booking.serviceName || booking.serviceId }}
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-2 text-gray-600">
                  <p>
                    {{ t().date }}:
                    <span class="font-medium text-gray-800">{{
                      booking.startAt | date : 'medium'
                    }}</span>
                  </p>
                  <p>
                    {{ t().branch }}:
                    <span class="font-medium text-gray-800">{{
                      getBranchName(booking.branchId)
                    }}</span>
                  </p>
                  <p>
                    {{ t().barber }}:
                    <span class="font-medium text-gray-800">
                      @if (booking.barberId === 0) { {{ t().notSpecified }} } @else {
                      {{ booking.barberName || booking.barberId }}
                      }
                    </span>
                  </p>
                  <p>
                    {{ t().amount }}:
                    <span class="font-medium text-gray-800"
                      >{{ booking.servicePrice }} {{ t().currency }}</span
                    >
                  </p>
                </div>
              </div>

              <span
                class="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                [ngClass]="{
                  'bg-green-100 text-green-800':
                    booking.status === 'Confirmed' || booking.status === BookingStatus.CONFIRMED,
                  'bg-yellow-100 text-yellow-800':
                    booking.status === 'Pending' || booking.status === BookingStatus.PENDING,
                  'bg-gray-100 text-gray-800':
                    booking.status === 'Completed' || booking.status === BookingStatus.COMPLETED,
                  'bg-red-100 text-red-800':
                    booking.status === 'Cancelled' || booking.status === BookingStatus.CANCELLED
                }"
              >
                {{ booking.status }}
              </span>
            </div>
          </div>
          }
        </div>
        }
      </div>
      }

      <!-- Orders Tab -->
      @if (activeTab() === 'orders') {
      <div>
        @if (isLoadingOrders()) {
        <p class="text-gray-500">{{ t().loadingOrders }}</p>
        } @else if (orders().length === 0) {
        <div class="text-center py-16">
          <p class="text-gray-600">{{ t().noOrdersYet }}</p>
        </div>
        } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold">{{ t().orderNumber }} #{{ order.id }}</h3>
                <p class="text-gray-600 text-sm">{{ order.createdAt | date : 'medium' }}</p>

                <div class="mt-2 text-sm text-gray-600">
                  <p>
                    {{ t().address }}: <span class="font-medium">{{ order.address }}</span>
                  </p>
                  <p>
                    {{ t().phone }}: <span class="font-medium">{{ order.phoneNumber }}</span>
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold">{{ order.total }} {{ t().currency }}</p>
                <span
                  class="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="border-t pt-4 space-y-2">
              @for (item of order.items; track item.productId) {
              <div class="flex justify-between text-sm">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>{{ item.price * item.quantity }} {{ t().currency }}</span>
              </div>
              }
            </div>
          </div>
          }
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class MyHistoryComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private branchService = inject(BranchService);
  public langService = inject(LanguageService);
  t = this.langService.t;

  // Expose BookingStatus enum to template
  BookingStatus = BookingStatus;

  activeTab = signal<'bookings' | 'orders'>('bookings');
  orders = signal<OrderDto[]>([]);
  bookings = signal<BookingDto[]>([]);
  branches = signal<Branch[]>([]);
  isLoadingOrders = signal(false);
  isLoadingBookings = signal(false);

  ngOnInit() {
    this.loadUserHistory();
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);
      },
      error: (err) => console.error('Failed to load branches', err),
    });
  }

  getBranchName(branchId: number): string {
    const branch = this.branches().find((b) => b.id === branchId);
    return branch ? branch.name : `Branch #${branchId}`;
  }

  loadUserHistory() {
    const userId = this.authService.userId;

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    this.isLoadingBookings.set(true);
    this.isLoadingOrders.set(true);

    this.userService.getUserHistory(userId).subscribe({
      next: (data) => {
        this.orders.set(data.orders || []);
        this.bookings.set(data.bookings || []);
        this.isLoadingBookings.set(false);
        this.isLoadingOrders.set(false);
      },
      error: (error: any) => {
        console.error('Error loading user history:', error);
        this.isLoadingBookings.set(false);
        this.isLoadingOrders.set(false);
      },
    });
  }
}
