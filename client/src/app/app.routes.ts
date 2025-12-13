import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AdminGuard } from './core/guards/admin.guard';
import { BranchManagerGuard } from './core/guards/branch-manager.guard';
import { BarberGuard } from './core/guards/barber.guard';
import { GuestGuard } from './core/guards/guest.guard';

// ============================================
// ROUTE CONFIGURATION
// ============================================

export const routes: Routes = [
  // Public Routes (Main Layout)
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/landing-page/landing-page.component').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'store',
        loadComponent: () => import('./pages/store/store.component').then((m) => m.StoreComponent),
      },
      {
        path: 'hairstyle-recommender',
        loadComponent: () =>
          import('./pages/hairstyle-recommender/hairstyle-recommender.component').then(
            (m) => m.HairstyleRecommenderComponent
          ),
      },

      // Branches
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/branches/branch-list/branch-list.component').then(
            (m) => m.BranchListComponent
          ),
      },
      {
        path: 'branches/:id',
        loadComponent: () =>
          import('./pages/branches/branch-detail/branch-detail.component').then(
            (m) => m.BranchDetailComponent
          ),
      },

      // Cart & Checkout
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },

      // My History
      {
        path: 'my-history',
        loadComponent: () =>
          import('./pages/my-history/my-history.component').then((m) => m.MyHistoryComponent),
      },

      // FAQ
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq.component').then((m) => m.FaqComponent),
      },

      // Contact
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.component').then((m) => m.ContactComponent),
      },

      // Booking Flow
      {
        path: 'booking',
        loadComponent: () =>
          import('./pages/booking/booking-flow/booking-flow.component').then(
            (m) => m.BookingFlowComponent
          ),
        children: [
          { path: '', redirectTo: 'service', pathMatch: 'full' },
          {
            path: 'service',
            loadComponent: () =>
              import('./pages/booking/steps/select-service/select-service.component').then(
                (m) => m.SelectServiceComponent
              ),
          },
          {
            path: 'date-time',
            loadComponent: () =>
              import('./pages/booking/steps/select-date-time/select-date-time.component').then(
                (m) => m.SelectDateTimeComponent
              ),
          },
          {
            path: 'barber',
            loadComponent: () =>
              import('./pages/booking/steps/select-barber/select-barber.component').then(
                (m) => m.SelectBarberComponent
              ),
          },
          {
            path: 'payment',
            loadComponent: () =>
              import('./pages/booking/steps/payment/payment.component').then(
                (m) => m.PaymentComponent
              ),
          },
          {
            path: 'confirmation',
            loadComponent: () =>
              import('./pages/booking/steps/confirmation/confirmation.component').then(
                (m) => m.ConfirmationComponent
              ),
          },
        ],
      },

      // User Dashboard
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./pages/dashboard/my-bookings/my-bookings.component').then(
            (m) => m.MyBookingsComponent
          ),
      },

      // Authentication
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
        canActivate: [() => inject(GuestGuard).canActivate()],
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [() => inject(GuestGuard).canActivate()],
      },
      {
        path: 'auth/complete-profile',
        loadComponent: () =>
          import('./pages/auth/complete-profile/complete-profile.component').then(
            (m) => m.CompleteProfileComponent
          ),
        canActivate: [() => inject(GuestGuard).canActivate()],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/auth/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },

  // Live Queue Display (Standalone - No Layout)
  {
    path: 'live-queue/:branchId',
    loadComponent: () =>
      import('./pages/public/live-queue/live-queue.component').then((m) => m.LiveQueueComponent),
  },

  // Super Admin Routes
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [() => inject(AdminGuard).canActivate()],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./pages/admin/branches/branches.component').then((m) => m.BranchesComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./pages/admin/employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/admin/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/admin/products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/admin/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/admin/orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/users/users.component').then((m) => m.UsersComponent),
      },
    ],
  },

  // Branch Admin Routes
  {
    path: 'branch-admin',
    loadComponent: () =>
      import('./components/layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [() => inject(BranchManagerGuard).canActivate()],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/branch-admin/dashboard/branch-dashboard.component').then(
            (m) => m.BranchDashboardComponent
          ),
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/branch-admin/queue-manager/queue-manager.component').then(
            (m) => m.QueueManagerComponent
          ),
      },
      // TODO: Add more branch-admin routes (schedule, staff, analytics, promotions, etc.)
    ],
  },

  // Branch Panel Routes
  {
    path: 'branch-panel',
    loadComponent: () =>
      import('./components/layout/branch-panel-layout/branch-panel-layout.component').then(
        (m) => m.BranchPanelLayoutComponent
      ),
    // Using BranchManagerGuard for now, user can adjust if needed
    canActivate: [() => inject(BranchManagerGuard).canActivate()],
    children: [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/admin/bookings/bookings.component').then((m) => m.BookingsComponent),
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/branch-admin/queue-manager/queue-manager.component').then(
            (m) => m.QueueManagerComponent
          ),
      },
      {
        path: 'surveys',
        loadComponent: () =>
          import('./pages/branch-panel/surveys/surveys.component').then((m) => m.SurveysComponent),
      },
    ],
  },

  // Staff/Barber Routes
  {
    path: 'staff',
    loadComponent: () =>
      import('./components/layout/staff-layout/staff-layout.component').then(
        (m) => m.StaffLayoutComponent
      ),
    canActivate: [() => inject(BarberGuard).canActivate()],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/staff/dashboard/staff-dashboard.component').then(
            (m) => m.StaffDashboardComponent
          ),
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/staff/queue/staff-queue.component').then((m) => m.StaffQueueComponent),
      },
      // TODO: Add more staff routes (performance, availability, etc.)
    ],
  },

  // Public Queue System Routes
  {
    path: 'public',
    children: [
      {
        path: 'queue-display',
        loadComponent: () =>
          import('./pages/public/queue-display/queue-display.component').then(
            (m) => m.QueueDisplayComponent
          ),
      },
      {
        path: 'qr',
        loadComponent: () =>
          import('./pages/public/qr-landing/qr-landing.component').then(
            (m) => m.QrLandingComponent
          ),
      },
      {
        path: 'feedback/:branchId',
        loadComponent: () =>
          import('./pages/public/branch-feedback/branch-feedback.component').then(
            (m) => m.BranchFeedbackComponent
          ),
      },
      // TODO: Add more public routes (walk-in, queue-status, etc.)
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
