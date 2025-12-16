import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, map } from 'rxjs';
import { BranchService, BranchExtended } from '../../../core/services/branch.service';
import { BookingService } from '../../../core/services/booking.service';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';

@Component({
  selector: 'app-branch-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, UiButtonComponent],
  template: `
    @if (branch() | async; as branch) {
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="w-full md:w-1/3">
            <img
              [src]="
                branch.image ||
                'https://png.pngtree.com/background/20250116/original/pngtree-modern-barbershop-interior-with-empty-black-chairs-wooden-walls-and-mirrors-picture-image_16212968.jpg'
              "
              [alt]="branch.name"
              class="w-full h-64 object-cover rounded-lg shadow-md bg-gray-100"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{{ branch.name }}</h1>
            <p class="text-gray-500 mb-4 flex items-center gap-2">
              <span>📍</span> {{ branch.location }}
            </p>
            <p class="text-gray-700 mb-6">{{ branch.description }}</p>
            <app-ui-button (click)="bookAppointment(branch)" size="lg">
              Book Appointment
            </app-ui-button>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="container mx-auto px-4 py-12 text-center">
      <h2 class="text-2xl font-bold text-gray-700">Branch not found</h2>
      <app-ui-button routerLink="/branches" variant="outline" class="mt-4"
        >Back to List</app-ui-button
      >
    </div>
    }
  `,
})
export class BranchDetailComponent {
  branchService = inject(BranchService);
  id = input<string>();

  authService = inject(AuthService);
  router = inject(Router);

  bookingService = inject(BookingService);

  // Using a getter because input signal is not available in constructor for computed immediately in some versions,
  // but in latest Angular it is. However, `branchService.getBranch` is synchronous.
  // Let's use a computed property.

  // Note: 'id' comes from route params withComponentInputBinding

  branch = computed(() => {
    const branchId = this.id();
    return branchId
      ? (this.branchService.getBranch(branchId) as Observable<BranchExtended>)
      : undefined;
  });

  bookAppointment(branch: BranchExtended) {
    this.bookingService.selectedBranch.set(branch);
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/booking/service']); // Navigate to first step usually, or just /booking if it redirects
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/booking/service' },
      });
    }
  }
}
