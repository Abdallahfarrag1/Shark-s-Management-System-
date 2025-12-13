import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { OrderService } from '../../../core/services/order.service';
import { OrderDto } from '../../../core/models/order.model';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, DeleteConfirmationModalComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().ordersManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageOrders }}
          </p>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
            {{ langService.t().allOrders }}
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
                  ID
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
                  Total
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Payment
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @if (isLoading()) {
              <tr>
                <td colspan="7" class="px-4 py-8 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                    ></div>
                  </div>
                </td>
              </tr>
              } @else if (orders().length === 0) {
              <tr>
                <td
                  colspan="7"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noOrdersFound }}
                </td>
              </tr>
              } @else { @for (order of orders(); track order.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ order.id }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.customerName || 'N/A' }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.total }} EGP
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ order.paymentMethod }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ formatDateTime(order.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="order.status === 'Completed'"
                    [class.badge-warning]="order.status === 'Pending'"
                    [class.badge-danger]="order.status === 'Cancelled'"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm"
                      (click)="viewOrder(order.id)"
                    >
                      View
                    </button>
                    @if (order.status !== 'Completed') {
                    <button
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                      (click)="completeOrder(order)"
                    >
                      Complete
                    </button>
                    }
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(order)"
                    >
                      Delete
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
        [entityType]="'Order'"
        [entityName]="selectedOrder()?.id?.toString() || ''"
        (confirmed)="confirmDelete()"
        (cancelled)="closeDeleteModal()"
      />

      <!-- Order Details Modal -->
      @if (showDetailsModal()) {
      <div class="modal-backdrop fade-in" (click)="closeDetailsModal()">
        <div class="modal w-full max-w-2xl p-6 slide-in-up" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ langService.t().orderDetails }} #{{ selectedOrder()?.id }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDateTime(selectedOrder()?.createdAt || '') }}
              </p>
            </div>
            <button
              (click)="closeDetailsModal()"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Customer Info -->
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-gray-900 mb-3">
              {{ langService.t().customerInformation }}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">{{ langService.t().name }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.customerName || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-600">{{ langService.t().phone }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.phoneNumber }}</span>
              </div>
              <div class="md:col-span-2">
                <span class="text-gray-600">{{ langService.t().address }}:</span>
                <span class="ml-2 font-medium">{{ selectedOrder()?.address }}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-3">{{ langService.t().orderItems }}</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">
                      {{ langService.t().product }}
                    </th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-600">
                      {{ langService.t().price }}
                    </th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-600">
                      {{ langService.t().qty }}
                    </th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-600">
                      {{ langService.t().subtotal }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  @for (item of selectedOrder()?.items || []; track item.id) {
                  <tr>
                    <td class="px-4 py-3 text-sm">{{ item.name }}</td>
                    <td class="px-4 py-3 text-sm text-right">{{ item.price }} EGP</td>
                    <td class="px-4 py-3 text-sm text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-sm text-right font-medium">
                      {{ item.subtotal }} EGP
                    </td>
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">{{ langService.t().paymentMethod }}:</span>
              <span class="font-medium">{{ selectedOrder()?.paymentMethod }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">{{ langService.t().status }}:</span>
              <span
                class="badge"
                [class.badge-success]="selectedOrder()?.status === 'Completed'"
                [class.badge-warning]="selectedOrder()?.status === 'Pending'"
                [class.badge-danger]="selectedOrder()?.status === 'Cancelled'"
              >
                {{ selectedOrder()?.status }}
              </span>
            </div>
            <div class="border-t pt-2 mt-2">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold">{{ langService.t().total }}:</span>
                <span class="text-lg font-bold text-primary-600"
                  >{{ selectedOrder()?.total }} EGP</span
                >
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6">
            <button (click)="closeDetailsModal()" class="btn-outline flex-1">
              {{ langService.t().close }}
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private toastService = signal(inject(ToastService)).asReadonly();
  private orderService = signal(inject(OrderService)).asReadonly();
  langService = inject(LanguageService);

  orders = signal<OrderDto[]>([]);
  isLoading = signal(true);
  showDeleteModal = signal(false);
  showDetailsModal = signal(false);
  selectedOrder = signal<OrderDto | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService()
      .getAllOrders()
      .subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.toastService().error('Error', 'Failed to load orders');
          this.isLoading.set(false);
        },
      });
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

  completeOrder(order: OrderDto) {
    this.orderService()
      .updateOrderStatus(order.id, 'Completed')
      .subscribe({
        next: () => {
          this.toastService().success('Success', `Order #${order.id} marked as completed`);
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error updating order:', error);
          this.toastService().error('Error', 'Failed to update order status');
        },
      });
  }

  openDeleteModal(order: OrderDto) {
    this.selectedOrder.set(order);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedOrder.set(null);
  }

  confirmDelete() {
    const order = this.selectedOrder();
    if (!order) return;

    this.orderService()
      .deleteOrder(order.id)
      .subscribe({
        next: () => {
          this.toastService().success('Deleted', `Order #${order.id} has been deleted`);
          this.closeDeleteModal();
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.toastService().error('Error', 'Failed to delete order');
          this.closeDeleteModal();
        },
      });
  }

  viewOrder(id: number) {
    const order = this.orders().find((o) => o.id === id);
    if (order) {
      this.selectedOrder.set(order);
      this.showDetailsModal.set(true);
    }
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
  }
}
