import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { BranchService, Branch } from '../../../core/services/branch.service';
import { BookingDto } from '../../../core/models/models';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().bookingsManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageBookings }}
          </p>
        </div>
        <div class="flex gap-2">
          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchId"
              [placeholder]="langService.t().searchBookingId"
              class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
              [style.background-color]="'var(--bg-secondary)'"
              [style.color]="'var(--text-primary)'"
              [style.border-color]="'var(--border-light)'"
            />
            <svg
              class="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
            {{ langService.t().recentBookings }}
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="border-b"
              [style.border-color]="'var(--border-light)'"
              [style.background-color]="'var(--bg-tertiary)'"
            >
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().id }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().branch }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().customer }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().service }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().barber }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().dateTime }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().status }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().actions }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @if (isLoading()) {
              <tr>
                <td colspan="8" class="px-4 py-8 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                    ></div>
                  </div>
                </td>
              </tr>
              } @else if (filteredBookings().length === 0) {
              <tr>
                <td
                  colspan="8"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noBookingsFound }}
                </td>
              </tr>
              } @else { @for (booking of filteredBookings(); track booking.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  #{{ booking.id }}
                </td>
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ getBranchName(booking.branchId) }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.customerName || 'N/A' }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.serviceName }} ({{ booking.servicePrice }} EGP)
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ booking.barberName }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ formatDateTime(booking.startAt) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="booking.status === 'Confirmed'"
                    [class.badge-warning]="booking.status === 'Pending'"
                    [class.badge-danger]="booking.status === 'Cancelled'"
                  >
                    {{ booking.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    @if (booking.status !== 'Completed') {
                    <button
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                      (click)="completeBooking(booking)"
                    >
                      {{ langService.t().complete }}
                    </button>
                    }
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(booking)"
                    >
                      {{ langService.t().delete }}
                    </button>
                  </div>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <app-delete-confirmation-modal
        [isOpen]="showDeleteModal()"
        [entityType]="'Booking'"
        [entityName]="selectedBooking()?.id?.toString() || ''"
        (confirmed)="confirmDelete()"
        (cancelled)="closeDeleteModal()"
      />
    </div>
  `,
})
export class BookingsComponent implements OnInit {
  private toastService = signal(new ToastService()).asReadonly();
  private bookingService = signal(inject(BookingService)).asReadonly();
  private authService = signal(inject(AuthService)).asReadonly();
  private branchService = inject(BranchService);
  langService = inject(LanguageService);

  bookings = signal<BookingDto[]>([]);
  branches = signal<Branch[]>([]);
  searchId = signal('');

  filteredBookings = computed(() => {
    const term = this.searchId().toLowerCase();
    const allBookings = this.bookings();

    if (!term) return allBookings;

    return allBookings.filter((booking) => booking.id.toString().includes(term));
  });

  isLoading = signal(true);
  showDeleteModal = signal(false);
  selectedBooking = signal<BookingDto | null>(null);

  ngOnInit() {
    this.loadBookings();
    this.loadBranches();
  }

  loadBookings() {
    this.isLoading.set(true);
    const managedBranchId = this.authService().managedBranchId;

    this.bookingService()
      .getAllBookings(managedBranchId || undefined)
      .subscribe({
        next: (bookings) => {
          this.bookings.set(bookings);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.toastService().error('Error', 'Failed to load bookings');
          this.isLoading.set(false);
        },
      });
  }

  loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);
      },
      error: (error) => {
        console.error('Error loading branches:', error);
      },
    });
  }

  getBranchName(branchId: number): string {
    const branch = this.branches().find((b) => Number(b.id) === branchId);
    return branch ? branch.name : `Branch #${branchId}`;
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  completeBooking(booking: BookingDto) {
    this.bookingService()
      .updateBookingStatus(booking.id, 'Completed')
      .subscribe({
        next: () => {
          this.toastService().success('Success', `Booking #${booking.id} marked as completed`);
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error updating booking:', error);
          this.toastService().error('Error', 'Failed to update booking status');
        },
      });
  }

  openDeleteModal(booking: BookingDto) {
    this.selectedBooking.set(booking);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedBooking.set(null);
  }

  confirmDelete() {
    const booking = this.selectedBooking();
    if (!booking) return;

    this.bookingService()
      .deleteBooking(booking.id)
      .subscribe({
        next: () => {
          this.toastService().success('Deleted', `Booking #${booking.id} has been deleted`);
          this.closeDeleteModal();
          this.loadBookings();
        },
        error: (error) => {
          console.error('Error deleting booking:', error);
          this.toastService().error('Error', 'Failed to delete booking');
          this.closeDeleteModal();
        },
      });
  }

  createBooking() {
    this.toastService().info('New Booking', 'Booking creation form will open here');
  }

  viewBooking(id: number) {
    this.toastService().info('View Booking', `Viewing booking ${id}`);
  }
}
