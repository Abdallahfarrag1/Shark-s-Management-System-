import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barber } from '../../../core/services/barber.service';

@Component({
  selector: 'app-barber-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="space-y-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
            >First Name</label
          >
          <input
            [(ngModel)]="barber.firstName"
            name="firstName"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            [style.background-color]="'var(--bg-input)'"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-primary)'"
            id="firstName"
            type="text"
            placeholder="First Name"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
            >Last Name</label
          >
          <input
            [(ngModel)]="barber.lastName"
            name="lastName"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            [style.background-color]="'var(--bg-input)'"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-primary)'"
            id="lastName"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>

        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
            >Phone Number</label
          >
          <input
            [(ngModel)]="barber.phoneNumber"
            name="phoneNumber"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            [style.background-color]="'var(--bg-input)'"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-primary)'"
            id="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            required
          />
        </div>

        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'"
            >Branch ID</label
          >
          <input
            [(ngModel)]="barber.branchId"
            name="branchId"
            class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            [style.background-color]="'var(--bg-input)'"
            [style.border-color]="'var(--border-light)'"
            [style.color]="'var(--text-primary)'"
            id="branchId"
            type="number"
            placeholder="Branch ID"
            required
          />
        </div>
      </div>

      <div
        class="flex items-center justify-end pt-4 border-t"
        [style.border-color]="'var(--border-light)'"
      >
        <button
          class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
          type="submit"
        >
          Save Barber
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class BarberFormComponent {
  @Input() barber: Barber = { firstName: '', lastName: '', phoneNumber: '', branchId: 0 };
  @Output() save = new EventEmitter<Barber>();

  onSubmit() {
    this.save.emit(this.barber);
  }
}
