import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { QueueService } from '../../../core/services/queue.service';
import { AuthService } from '../../../core/services/auth.service';
import { Chair, QueueItem } from '../../../core/models/queue.models';
import { interval, Subscription, switchMap } from 'rxjs';
import { BarberService, Barber } from '../../../core/services/barber.service';
import { ToastService } from '../../../core/services/toast.service';
import { BookingService } from '../../../core/services/booking.service';
import { CreateBookingRequest } from '../../../core/models/models';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-queue-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
  ],
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
      <!-- 1. Chairs Section (Left) -->
      <div
        class="md:w-1/3 flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
      >
        <div class="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800">{{ langService.t().chairs }}</h2>
          <span class="px-2 py-1 bg-gray-100 text-xs rounded-full"
            >{{ chairs().length }} {{ langService.t().activeChairs }}</span
          >
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          @for (chair of chairs(); track chair.id) {
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-gray-900">{{ chair.name }}</h3>
                <p class="text-xs text-gray-500">
                  {{ chair.assignedBarberName || langService.t().noBarber }}
                </p>
              </div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                [ngClass]="
                  chair.status === 'Occupied'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                {{ chair.status === 'Occupied' ? langService.t().occupied : langService.t().free }}
              </span>
            </div>

            @if (chair.status === 'Occupied' && chair.currentBooking) {
            <div class="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">👤</span>
                <span class="font-bold text-blue-900">{{ chair.currentBooking.customerName }}</span>
              </div>
              <div class="text-xs text-blue-700 flex justify-between">
                <span>{{ chair.currentBooking.serviceName }}</span>
                <span>{{ chair.currentBooking.bookingTime | date : 'shortTime' }}</span>
              </div>
            </div>
            } @else {
            <div
              class="mb-4 p-4 text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-md"
            >
              {{ langService.t().free }}
            </div>
            }

            <div class="flex gap-2">
              @if (chair.status === 'Occupied') {
              <app-ui-button
                (click)="completeSession(chair.id)"
                variant="primary"
                size="sm"
                class="flex-1"
              >
                {{ langService.t().complete }}
              </app-ui-button>
              } @else {
              <app-ui-button
                [disabled]="true"
                variant="secondary"
                size="sm"
                class="flex-1 opacity-50 cursor-not-allowed"
              >
                {{ langService.t().free }}
              </app-ui-button>
              }

              <button
                (click)="removeChair(chair.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Remove Chair"
              >
                🗑️
              </button>
            </div>
          </div>
          } @if (chairs().length === 0) {
          <div class="text-center py-10 text-gray-400">
            <p>{{ langService.t().noDataFound }}</p>
          </div>
          }
        </div>
      </div>

      <!-- 2. Waiting Queue Section (Middle) -->
      <div
        class="md:w-1/3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      >
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-gray-800">{{ langService.t().waitingQueue }}</h2>
          <div class="flex gap-2">
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
              >{{ queue().length }} {{ langService.t().waiting }}</span
            >
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-0">
          @for (item of queue(); track item.id) {
          <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900">{{ item.customerName }}</span>
                @if (item.priority > 3) {
                <span class="text-yellow-500 text-xs">⭐ {{ item.priority }}</span>
                }
              </div>
              <span class="text-xs text-gray-500">{{ item.bookingTime | date : 'shortTime' }}</span>
            </div>

            <div class="flex justify-between items-end">
              <div class="text-sm text-gray-600">
                <p>{{ item.serviceName }}</p>
                @if (item.preferredBarberName) {
                <p class="text-xs text-purple-600">
                  {{ langService.t().pref }}: {{ item.preferredBarberName }}
                </p>
                }
              </div>

              <button
                (click)="openAssignModal(item)"
                class="px-3 py-1 bg-white border border-primary-500 text-primary-600 text-xs font-medium rounded hover:bg-primary-50 transition-colors"
              >
                {{ langService.t().assign }} →
              </button>
            </div>
          </div>
          } @if (queue().length === 0) {
          <div class="text-center py-12 text-gray-400">
            <span class="text-4xl block mb-2">☕</span>
            <p>{{ langService.t().queueEmpty }}</p>
          </div>
          }
        </div>
      </div>

      <!-- 3. Actions Panel (Right) -->
      <div class="md:w-1/3 flex flex-col gap-6 overflow-y-auto pr-1">
        <!-- Live Queue Display -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-3">{{ langService.t().liveQueueDisplay }}</h3>
            <app-ui-button [fullWidth]="true" (click)="openLiveQueue()">
              📺 {{ langService.t().openLiveQueue }}
            </app-ui-button>
          </div>
        </app-ui-card>

        <!-- Actions -->
        <app-ui-card>
          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-800">{{ langService.t().actions }}</h3>
              <button (click)="loadData()" class="text-sm text-primary-600 hover:text-primary-700">
                ↻ {{ langService.t().refresh }}
              </button>
            </div>

            <div class="space-y-3">
              <app-ui-button [fullWidth]="true" (click)="showAddChair = !showAddChair">
                {{ showAddChair ? langService.t().cancelAdd : langService.t().addNewChair }}
              </app-ui-button>

              @if (showAddChair) {
              <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
                <form [formGroup]="chairForm" (ngSubmit)="onAddChair()">
                  <app-ui-input
                    [label]="langService.t().chairName"
                    formControlName="name"
                    placeholder="e.g. Chair 5"
                    class="mb-2"
                  ></app-ui-input>
                  <div class="relative mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{
                      langService.t().assignedBarber
                    }}</label>
                    <div class="relative">
                      <input
                        type="text"
                        [value]="
                          selectedBarberName().length > 0 && !isDropdownOpen()
                            ? selectedBarberName()
                            : searchTerm()
                        "
                        (input)="onSearchInput($event)"
                        (focus)="isDropdownOpen.set(true)"
                        [placeholder]="langService.t().searchBarberName"
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      @if (isDropdownOpen()) {
                      <div
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto"
                      >
                        @for (barber of filteredBarbers(); track barber.id) {
                        <div
                          (click)="selectBarber(barber)"
                          class="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                          {{ barber.firstName }} {{ barber.lastName }}
                        </div>
                        } @if (filteredBarbers().length === 0) {
                        <div class="p-2 text-gray-500 text-sm text-center">
                          {{ langService.t().noBarbersFound }}
                        </div>
                        }
                      </div>
                      }
                    </div>
                  </div>
                  <app-ui-button
                    type="submit"
                    size="sm"
                    [fullWidth]="true"
                    [disabled]="chairForm.invalid"
                    >{{ langService.t().create }}</app-ui-button
                  >
                </form>
              </div>
              }
            </div>
          </div>
        </app-ui-card>

        <!-- Walk-in Booking -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-4">{{ langService.t().walkInBooking }}</h3>
            <form [formGroup]="walkInForm" (ngSubmit)="onCreateWalkIn()">
              <div class="grid grid-cols-2 gap-2 mb-3">
                <app-ui-input
                  [label]="langService.t().firstName"
                  formControlName="firstName"
                  placeholder="John"
                ></app-ui-input>
                <app-ui-input
                  [label]="langService.t().lastName"
                  formControlName="lastName"
                  placeholder="Doe"
                ></app-ui-input>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  langService.t().service
                }}</label>
                <select
                  formControlName="serviceId"
                  class="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">{{ langService.t().selectService }}</option>
                  @for (serviceItem of services(); track serviceItem.id) {
                  <option [ngValue]="serviceItem.id">
                    {{ serviceItem.name }} - {{ serviceItem.price }} {{ langService.t().currency }}
                  </option>
                  }
                </select>
              </div>
              <app-ui-button type="submit" [fullWidth]="true" [disabled]="walkInForm.invalid">
                {{ langService.t().createWalkIn }}
              </app-ui-button>
            </form>
          </div>
        </app-ui-card>

        <!-- Manual Enqueue -->
        <app-ui-card>
          <div class="p-4">
            <h3 class="font-bold text-gray-800 mb-4">{{ langService.t().manualEnqueue }}</h3>
            <form [formGroup]="enqueueForm" (ngSubmit)="onEnqueue()">
              <app-ui-input
                [label]="langService.t().bookingId"
                formControlName="bookingId"
                type="number"
                placeholder="Booking #"
                class="mb-3"
              ></app-ui-input>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  langService.t().priority
                }}</label>
                <select
                  formControlName="priority"
                  class="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option [ngValue]="0">0 - Normal</option>
                  <option [ngValue]="3">3 - Medium</option>
                  <option [ngValue]="5">5 - High</option>
                  <option [ngValue]="8">8 - VIP</option>
                  <option [ngValue]="10">10 - Urgent</option>
                </select>
              </div>
              <app-ui-button type="submit" [fullWidth]="true" [disabled]="enqueueForm.invalid">{{
                langService.t().addToQueue
              }}</app-ui-button>
            </form>
          </div>
        </app-ui-card>
      </div>
    </div>

    <!-- Assign Modal -->
    @if (selectedBooking) {
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold mb-4">
          {{ langService.t().assignCustomer }} {{ selectedBooking.customerName }}
        </h3>
        <p class="text-gray-600 mb-4">{{ langService.t().selectChairToAssign }}</p>

        <div class="space-y-2 mb-6 max-h-60 overflow-y-auto">
          @for (chair of chairs(); track chair.id) {
          <button
            (click)="confirmAssign(chair.id)"
            class="w-full p-3 text-left rounded-lg border transition-all flex justify-between items-center group"
            [ngClass]="
              chair.status === 'Empty'
                ? 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                : 'border-red-100 bg-red-50 opacity-70'
            "
          >
            <div>
              <span class="font-bold block">{{ chair.name }}</span>
              <span class="text-xs text-gray-500">{{
                chair.assignedBarberName || langService.t().noBarber
              }}</span>
            </div>
            @if (chair.status === 'Empty') {
            <span class="text-green-600 text-sm font-medium group-hover:block hidden">{{
              langService.t().assign
            }}</span>
            } @else {
            <span class="text-red-500 text-xs">{{ langService.t().occupied }}</span>
            }
          </button>
          }
        </div>

        <div class="flex justify-end">
          <app-ui-button variant="secondary" (click)="selectedBooking = null">{{
            langService.t().close
          }}</app-ui-button>
        </div>
      </div>
    </div>
    }
  `,
})
export class QueueManagerComponent implements OnInit, OnDestroy {
  langService = inject(LanguageService); // Injected Language Service
  private queueService = inject(QueueService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  chairs = signal<Chair[]>([]);
  queue = signal<QueueItem[]>([]);

  // State
  selectedBooking: QueueItem | null = null;
  showAddChair = false;

  barbers = signal<Barber[]>([]);
  filteredBarbers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.barbers().filter((b) =>
      (b.firstName + ' ' + b.lastName).toLowerCase().includes(term)
    );
  });
  searchTerm = signal('');
  isDropdownOpen = signal(false);
  selectedBarberName = signal(''); // For display input

  // Forms
  chairForm = this.fb.group({
    name: ['', Validators.required],
    assignedBarberId: [null as number | null],
  });

  enqueueForm = this.fb.group({
    bookingId: [null as number | null, Validators.required],
    priority: [0, Validators.required],
  });

  private refreshSubscription?: Subscription;
  private branchId: number = 0;
  private barberService = inject(BarberService);
  private bookingService = inject(BookingService);

  services = signal<Array<{ id: number; name: string; price: number }>>([]);

  // Walk-in form
  walkInForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    serviceId: [null as number | null, Validators.required],
  });

  ngOnInit() {
    this.branchId = this.authService.managedBranchId || 10;

    // Initial Load
    this.loadData();

    // Load Barbers for Dropdown
    // Load Barbers for Dropdown from Bookings (Live Data)
    if (this.branchId) {
      this.bookingService.getAllBookings(this.branchId).subscribe({
        next: (bookings) => {
          const uniqueBarbersMap = new Map<number, Barber>();
          bookings.forEach((b) => {
            // Ensure we have a valid barberId (ignoring 0 or null if any)
            if (b.barberId && !uniqueBarbersMap.has(b.barberId)) {
              const nameParts = b.barberName ? b.barberName.split(' ') : ['Unknown'];
              const firstName = nameParts[0];
              const lastName = nameParts.slice(1).join(' ') || '';

              uniqueBarbersMap.set(b.barberId, {
                id: b.barberId,
                firstName,
                lastName,
                phoneNumber: '', // Not available in BookingDto, but needed for interface
                branchId: this.branchId,
              });
            }
          });
          this.barbers.set(Array.from(uniqueBarbersMap.values()));
        },
        error: (err) => console.error('Error loading barbers from bookings', err),
      });
    }

    // Load Services for Walk-in Form
    this.bookingService.getServices().subscribe({
      next: (services) => {
        this.services.set(services);
      },
      error: (err) => console.error('Error loading services', err),
    });

    // Auto Refresh every 5s
    this.refreshSubscription = interval(5000).subscribe(() => this.loadData());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  // Dropdown Logic
  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  selectBarber(barber: Barber) {
    this.chairForm.patchValue({ assignedBarberId: barber.id });
    this.selectedBarberName.set(`${barber.firstName} ${barber.lastName}`);
    this.isDropdownOpen.set(false);
    this.searchTerm.set('');
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.isDropdownOpen.set(true);
    // If user clears input, clear selection specific logic could go here
    if (input.value === '') {
      this.chairForm.patchValue({ assignedBarberId: null });
    }
  }

  loadData() {
    console.log('Loading Data... Branch ID:', this.branchId);
    if (!this.branchId) {
      console.warn('No Branch ID found, skipping load.');
      return;
    }

    this.queueService.getChairs(this.branchId).subscribe({
      next: (data) => this.chairs.set(data),
      error: (err) => console.error('Error loading chairs', err),
    });

    this.queueService.getQueue(this.branchId).subscribe({
      next: (data) => this.queue.set(data),
      error: (err) => console.error('Error loading queue', err),
    });
  }

  // --- Actions ---

  openAssignModal(booking: QueueItem) {
    this.selectedBooking = booking;
  }

  confirmAssign(chairId: number) {
    if (!this.selectedBooking) return;

    const req = {
      chairId,
      bookingId: this.selectedBooking.bookingId,
    };

    this.queueService.assignToChair(req).subscribe({
      next: () => {
        this.toastService.success('Success', `Assigned to Chair #${chairId}`);
        this.selectedBooking = null;
        this.loadData(); // Immediate refresh
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to assign booking');
        console.error(err);
      },
    });
  }

  completeSession(chairId: number) {
    this.queueService.completeChair(chairId).subscribe({
      next: (res) => {
        this.toastService.success('Completed', 'Session completed');
        if (res.newAssignedBookingId) {
          this.toastService.info(
            'Queue Update',
            `Auto-assigned booking #${res.newAssignedBookingId}`
          );
        }
        this.loadData();
      },
      error: (err) => {
        this.toastService.error('Error', 'Failed to complete session');
        console.error(err);
      },
    });
  }

  removeChair(chairId: number) {
    if (confirm('Are you sure you want to remove this chair?')) {
      this.queueService.deleteChair(chairId).subscribe({
        next: (deleted) => {
          if (deleted) {
            this.toastService.success('Deleted', 'Chair removed');
            this.loadData();
          } else {
            this.toastService.error('Error', 'Chair is occupied or in use');
          }
        },
        error: (err) => this.toastService.error('Error', 'Failed to remove chair'),
      });
    }
  }

  onAddChair() {
    if (this.chairForm.invalid || !this.branchId) return;

    const req = {
      branchId: this.branchId,
      name: this.chairForm.value.name!,
      assignedBarberId: this.chairForm.value.assignedBarberId || undefined,
    };

    this.queueService.createChair(req).subscribe({
      next: () => {
        this.toastService.success('Success', 'Chair added');
        this.showAddChair = false;
        this.chairForm.reset();
        this.selectedBarberName.set(''); // Reset dropdown display
        this.loadData();
      },
      error: (err) => this.toastService.error('Error', 'Failed to add chair'),
    });
  }

  onEnqueue() {
    if (this.enqueueForm.invalid) return;

    const req = {
      branchId: this.branchId,
      bookingId: this.enqueueForm.value.bookingId!,
      priority: this.enqueueForm.value.priority!,
    };

    this.queueService.enqueueBooking(req).subscribe({
      next: () => {
        this.toastService.success('Success', 'Booking added to queue');
        this.enqueueForm.reset({ priority: 0 });
        this.loadData();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to enqueue';
        this.toastService.error('Error', errorMsg);
      },
    });
  }

  openLiveQueue() {
    const url = `/live-queue/${this.branchId}`;
    window.open(url, '_blank');
  }

  onCreateWalkIn() {
    if (this.walkInForm.invalid || !this.branchId) return;

    const firstName = this.walkInForm.value.firstName!;
    const lastName = this.walkInForm.value.lastName!;
    const serviceId = this.walkInForm.value.serviceId!;

    const payload: CreateBookingRequest = {
      customerId: 'walk-in',
      customerName: `${firstName} ${lastName}`,
      barberId: 0,
      serviceId: serviceId,
      branchId: this.branchId,
      startAt: new Date().toISOString(),
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => {
        this.toastService.success('Success', `Walk-in booking created for ${payload.customerName}`);
        this.walkInForm.reset();
        // Optionally auto-enqueue the new booking
        if (booking.id) {
          this.queueService
            .enqueueBooking({
              branchId: this.branchId,
              bookingId: booking.id,
              priority: 0,
            })
            .subscribe({
              next: () => {
                this.toastService.success('Queued', 'Walk-in customer added to queue');
                this.loadData();
              },
              error: (err) => console.error('Error enqueueing', err),
            });
        }
      },
      error: (err) => {
        console.error('Error creating walk-in booking', err);
        this.toastService.error('Error', 'Failed to create walk-in booking');
      },
    });
  }
}
