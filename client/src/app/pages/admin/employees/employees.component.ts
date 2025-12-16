import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { LanguageService } from '../../../core/services/language.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import {
  BarberScheduleFormComponent,
  DaySchedule,
} from '../../../components/forms/barber-schedule-form/barber-schedule-form.component';
import { BranchService, Branch } from '../../../core/services/branch.service';
import {
  BarberService,
  BarberSchedule,
  DayScheduleData,
} from '../../../core/services/barber.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string;
  role: string;
  branch: string;
  branchId: number;
  status: string;
  rating: number;
  schedule?: DaySchedule[];
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DeleteConfirmationModalComponent,
    BarberScheduleFormComponent,
    UiSkeletonComponent,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().employeesManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().manageStaff }}
          </p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ langService.t().addEmployee }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().totalEmployees }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1" [style.color]="'var(--text-primary)'">
            {{ employees().length }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().activeToday }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-green-600">
            {{ getActiveEmployees() }}
          </h3>
        </div>
        <div class="card p-4 md:p-6">
          <p class="text-xs md:text-sm" [style.color]="'var(--text-secondary)'">
            {{ langService.t().onLeave }}
          </p>
          <h3 class="text-2xl md:text-3xl font-bold mt-1 text-orange-600">
            {{ getOnLeaveEmployees() }}
          </h3>
        </div>
      </div>

      <!-- Employees List -->
      <div class="card">
        <div class="p-4 md:p-6 border-b" [style.border-color]="'var(--border-light)'">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
              {{ langService.t().allEmployees }}
            </h2>
            <div class="flex gap-2">
              <!-- Name Filter -->
              <input
                type="text"
                [(ngModel)]="nameFilter"
                [placeholder]="langService.t().filterByName"
                class="input text-sm py-2 px-3 w-full sm:w-64"
              />
              <button class="btn-outline text-sm" (click)="exportData()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {{ langService.t().export }}
              </button>
            </div>
          </div>
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
                  {{ langService.t().name }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().phone }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().role }}
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
              @if (isLoading()) { @for (item of [1, 2, 3, 4, 5]; track item) {
              <tr>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="200px" height="40px"></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="120px" height="20px"></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="80px" height="20px"></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="150px" height="20px"></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <app-ui-skeleton
                    width="80px"
                    height="24px"
                    className="rounded-full"
                  ></app-ui-skeleton>
                </td>
                <td class="px-4 py-3">
                  <app-ui-skeleton width="100px" height="32px"></app-ui-skeleton>
                </td>
              </tr>
              } } @else { @for (employee of filteredEmployees(); track employee.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors cursor-pointer"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    @if (employee.photo) {
                    <img
                      [src]="employee.photo"
                      loading="lazy"
                      class="w-10 h-10 rounded-full object-cover"
                      [alt]="employee.firstName + ' ' + employee.lastName"
                    />
                    } @else {
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style="background: var(--color-primary-500)"
                    >
                      {{ employee.firstName.charAt(0) }}
                    </div>
                    }
                    <span class="font-medium" [style.color]="'var(--text-primary)'"
                      >{{ employee.firstName }} {{ employee.lastName }}</span
                    >
                  </div>
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.phone }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.role }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ employee.branch }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="badge"
                    [class.badge-success]="employee.status === 'Active'"
                    [class.badge-warning]="employee.status === 'On Leave'"
                  >
                    {{ employee.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      (click)="openEditModal(employee)"
                    >
                      {{ langService.t().edit }}
                    </button>
                    <button
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="openDeleteModal(employee)"
                    >
                      {{ langService.t().delete }}
                    </button>
                  </div>
                </td>
              </tr>
              } @empty {
              <tr>
                <td
                  colspan="6"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noEmployeesFound }} "{{ nameFilter() }}"
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Employee Modal -->
        @if (showModal()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          (click)="closeModal()"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            [style.background-color]="'var(--bg-secondary)'"
            (click)="$event.stopPropagation()"
          >
            <div
              class="p-6 border-b flex items-center justify-between"
              [style.border-color]="'var(--border-light)'"
            >
              <h3 class="text-xl font-bold" [style.color]="'var(--text-primary)'">
                {{ isEditMode() ? langService.t().editEmployee : langService.t().addNewEmployee }}
              </h3>
              <button
                (click)="closeModal()"
                class="transition-colors hover:opacity-70"
                [style.color]="'var(--text-tertiary)'"
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
            <div class="p-6">
              <form (ngSubmit)="saveEmployee()" class="space-y-6">
                <!-- Photo Upload -->
                <div class="md:col-span-2">
                  <label
                    class="block text-sm font-medium mb-2"
                    [style.color]="'var(--text-primary)'"
                    >{{ langService.t().employeePhoto }}</label
                  >
                  <div
                    class="flex items-center gap-4 p-4 rounded-lg border border-dashed"
                    [style.border-color]="'var(--border-light)'"
                    [style.background-color]="'var(--bg-tertiary)'"
                  >
                    @if (formData().photo) {
                    <img
                      [src]="formData().photo"
                      loading="lazy"
                      class="w-20 h-20 rounded-full object-cover shadow-md"
                    />
                    } @else {
                    <div
                      class="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-md"
                      style="background: var(--color-primary-500)"
                    >
                      👤
                    </div>
                    }
                    <div class="flex-1">
                      <input
                        type="file"
                        #fileInput
                        (change)="onFileSelected($event)"
                        accept="image/*"
                        class="hidden"
                      />
                      <button
                        type="button"
                        (click)="fileInput.click()"
                        class="btn-outline text-sm w-full md:w-auto px-6 py-2"
                      >
                        {{ langService.t().choosePhoto }}
                      </button>
                      <p class="text-xs mt-2" [style.color]="'var(--text-secondary)'">
                        Recommended: Square image, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- First Name -->
                  <div>
                    <label
                      class="block text-sm font-medium mb-2"
                      [style.color]="'var(--text-primary)'"
                      >First Name <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      [(ngModel)]="formData().firstName"
                      name="firstName"
                      required
                      class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      [style.border-color]="'var(--border-light)'"
                      [style.background-color]="'var(--bg-input)'"
                      placeholder="Enter first name"
                    />
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label
                      class="block text-sm font-medium mb-2"
                      [style.color]="'var(--text-primary)'"
                      >Last Name <span class="text-red-500">*</span></label
                    >
                    <input
                      type="text"
                      [(ngModel)]="formData().lastName"
                      name="lastName"
                      required
                      class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      [style.border-color]="'var(--border-light)'"
                      [style.background-color]="'var(--bg-input)'"
                      placeholder="Enter last name"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label
                      class="block text-sm font-medium mb-2"
                      [style.color]="'var(--text-primary)'"
                      >{{ langService.t().phoneNumber }} <span class="text-red-500">*</span></label
                    >
                    <input
                      type="tel"
                      [(ngModel)]="formData().phone"
                      name="phone"
                      required
                      class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      [style.border-color]="'var(--border-light)'"
                      [style.background-color]="'var(--bg-input)'"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <!-- Branch -->
                  <div>
                    <label
                      class="block text-sm font-medium mb-2"
                      [style.color]="'var(--text-primary)'"
                      >{{ langService.t().branch }} <span class="text-red-500">*</span></label
                    >
                    <select
                      [(ngModel)]="formData().branchId"
                      name="branchId"
                      required
                      class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      [style.border-color]="'var(--border-light)'"
                      [style.background-color]="'var(--bg-input)'"
                    >
                      <option value="">{{ langService.t().selectBranch }}</option>
                      @for (branch of availableBranches(); track branch.id) {
                      <option [ngValue]="branch.id">{{ branch.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <!-- Working Schedule -->
                <div class="pt-4 border-t" [style.border-color]="'var(--border-light)'">
                  <h4 class="text-md font-semibold mb-4" [style.color]="'var(--text-primary)'">
                    Working Schedule
                  </h4>
                  <app-barber-schedule-form
                    [schedules]="formData().schedule || []"
                    (schedulesChange)="onScheduleChange($event)"
                  ></app-barber-schedule-form>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 pt-4 border-t" [style.border-color]="'var(--border-light)'">
                  <button type="button" (click)="closeModal()" class="btn-outline flex-1 py-3">
                    {{ langService.t().cancel }}
                  </button>
                  <button
                    type="submit"
                    class="btn-primary flex-1 py-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    {{ isEditMode() ? langService.t().update : langService.t().create }}
                    {{ langService.t().employees }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        }

        <!-- Delete Confirmation Modal -->
        @if (showDeleteModal()) {
        <app-delete-confirmation-modal
          [entityType]="'employee'"
          [entityName]="employeeToDelete()?.firstName + ' ' + employeeToDelete()?.lastName || ''"
          (confirmed)="confirmDelete()"
          (cancelled)="closeDeleteModal()"
        />
        }
      </div>
    </div>
  `,
})
export class EmployeesComponent implements OnInit {
  private toastService = inject(ToastService);
  private branchService = inject(BranchService);
  private barberService = inject(BarberService);
  langService = inject(LanguageService);

  employees = signal<Employee[]>([]);

  availableBranches = signal<Branch[]>([]);

  nameFilter = signal('');
  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  employeeToDelete = signal<Employee | null>(null);
  formData = signal<Partial<Employee>>({});

  filteredEmployees = computed(() => {
    const filter = this.nameFilter().toLowerCase().trim();
    if (!filter) return this.employees();
    return this.employees().filter((emp) =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(filter)
    );
  });

  getActiveEmployees() {
    return this.employees().filter((e) => e.status === 'Active').length;
  }

  getOnLeaveEmployees() {
    return this.employees().filter((e) => e.status === 'On Leave').length;
  }

  getAvgRating() {
    const total = this.employees().reduce((sum, e) => sum + e.rating, 0);
    return this.employees().length ? (total / this.employees().length).toFixed(1) : '0.0';
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ status: 'Active', role: 'Barber', rating: 4.5 });
    this.showModal.set(true);
  }

  openEditModal(employee: Employee) {
    this.isEditMode.set(true);
    this.formData.set({ ...employee });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData.set({});
  }

  onScheduleChange(schedule: DaySchedule[]) {
    this.formData.update((data) => ({ ...data, schedule }));
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.update((data) => ({ ...data, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  saveEmployee() {
    const data = this.formData();
    if (!data.firstName || !data.lastName || !data.phone || !data.branchId) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    const branchId = Number(data.branchId);
    const branch = this.availableBranches().find((b) => b.id === branchId);

    if (!branch) {
      this.toastService.error('Error', 'Invalid branch selected');
      return;
    }

    if (this.isEditMode()) {
      // Update existing barber via API
      const barberData = {
        id: data.id,
        firstName: data.firstName!,
        lastName: data.lastName!,
        phoneNumber: data.phone!,
        branchId: branchId,
      };

      this.barberService.updateBarber(data.id!, barberData).subscribe({
        next: (updatedBarber) => {
          // Convert schedule data to API format
          const scheduleData = this.convertScheduleToApiFormat(data.schedule || []);

          // Update barber schedule
          this.barberService.updateBarberSchedule(data.id!, scheduleData).subscribe({
            next: () => {
              // Update local state
              this.employees.update((employees) =>
                employees.map((e) =>
                  e.id === data.id
                    ? ({
                        ...e,
                        firstName: updatedBarber.firstName,
                        lastName: updatedBarber.lastName,
                        phone: updatedBarber.phoneNumber,
                        branchId: updatedBarber.branchId,
                        branch: branch.name,
                        schedule: data.schedule,
                        photo: data.photo, // Preserve photo if changed locally (mock)
                      } as Employee)
                    : e
                )
              );
              this.toastService.success('Success', 'Employee and schedule updated successfully');
              this.closeModal();
            },
            error: (error) => {
              console.error('Error updating schedule:', error);
              this.toastService.error('Warning', 'Employee updated but schedule failed');
              // Still update UI for barber details
              this.employees.update((employees) =>
                employees.map((e) =>
                  e.id === data.id
                    ? ({
                        ...e,
                        firstName: updatedBarber.firstName,
                        lastName: updatedBarber.lastName,
                        phone: updatedBarber.phoneNumber,
                        branchId: updatedBarber.branchId,
                        branch: branch.name,
                        photo: data.photo,
                      } as Employee)
                    : e
                )
              );
              this.closeModal();
            },
          });
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.toastService.error('Error', 'Failed to update employee');
        },
      });
    } else {
      // Create new barber via API
      const barberData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        phoneNumber: data.phone!,
        branchId: branchId,
      };

      this.barberService.createBarber(barberData).subscribe({
        next: (createdBarber) => {
          // Convert schedule data to API format
          const scheduleData = this.convertScheduleToApiFormat(data.schedule || []);

          // Update barber schedule
          this.barberService.updateBarberSchedule(createdBarber.id!, scheduleData).subscribe({
            next: () => {
              // Add to local state for UI
              const newEmployee: Employee = {
                id: createdBarber.id!,
                firstName: data.firstName!,
                lastName: data.lastName!,
                phone: data.phone!,
                photo: data.photo,
                role: data.role || 'Barber',
                branch: branch.name,
                branchId: data.branchId!,
                status: 'Active',
                rating: 4.5,
                schedule: data.schedule,
              };
              this.employees.update((employees) => [...employees, newEmployee]);
              this.toastService.success('Success', 'Employee and schedule created successfully');
              this.closeModal();
            },
            error: (error) => {
              console.error('Error creating schedule:', error);
              this.toastService.error('Warning', 'Employee created but schedule failed');
              // Still add to UI without schedule
              const newEmployee: Employee = {
                id: createdBarber.id!,
                firstName: data.firstName!,
                lastName: data.lastName!,
                phone: data.phone!,
                photo: data.photo,
                role: data.role || 'Barber',
                branch: branch.name,
                branchId: data.branchId!,
                status: 'Active',
                rating: 4.5,
              };
              this.employees.update((employees) => [...employees, newEmployee]);
              this.closeModal();
            },
          });
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.toastService.error('Error', 'Failed to create employee');
        },
      });
    }
  }

  convertScheduleToApiFormat(schedule: DaySchedule[]): BarberSchedule {
    const days: { [key: string]: DayScheduleData } = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    schedule.forEach((daySchedule) => {
      const dayName = dayNames[daySchedule.dayOfWeek];
      days[dayName] = {
        isWorking: daySchedule.enabled,
        startTime: daySchedule.startTime || '',
        endTime: daySchedule.endTime || '',
      };
    });

    return { days };
  }

  ngOnInit() {
    this.loadData();
  }

  isLoading = signal(true);

  loadData() {
    this.isLoading.set(true);
    // Load branches first, then barbers
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.availableBranches.set(branches);

        // Fetch barbers after branches are loaded
        this.barberService.getBarbers().subscribe({
          next: (barbers) => {
            const employees: Employee[] = barbers.map((barber) => {
              const branch = branches.find((b) => b.id === barber.branchId);
              return {
                id: barber.id!,
                firstName: barber.firstName,
                lastName: barber.lastName,
                phone: barber.phoneNumber,
                role: 'Barber', // Default role
                branch: branch ? branch.name : 'Unknown Branch',
                branchId: barber.branchId,
                status: 'Active', // Default status
                rating: 5.0, // Default rating
                photo: undefined,
              };
            });
            this.employees.set(employees);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error loading barbers:', error);
            this.toastService.error('Error', 'Failed to load barbers');
            this.isLoading.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.toastService.error('Error', 'Failed to load branches');
        this.isLoading.set(false);
      },
    });
  }

  openDeleteModal(employee: Employee) {
    this.employeeToDelete.set(employee);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.employeeToDelete.set(null);
  }

  confirmDelete() {
    const employee = this.employeeToDelete();
    if (employee) {
      this.barberService.deleteBarber(employee.id).subscribe({
        next: () => {
          this.employees.update((employees) => employees.filter((e) => e.id !== employee.id));
          this.toastService.success(
            'Deleted',
            `Employee "${employee.firstName} ${employee.lastName}" has been deleted`
          );
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.toastService.error('Error', 'Failed to delete employee');
          this.closeDeleteModal();
        },
      });
    }
  }

  exportData() {
    this.toastService.success('Export', 'Employees data exported successfully');
  }
}
