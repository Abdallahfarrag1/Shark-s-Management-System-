import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, UiInputComponent, UiButtonComponent, ReactiveFormsModule],
  template: `
    <div
      class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">{{ t().signInTitle }}</h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ t().or }}
            <a routerLink="/auth/register" class="font-medium text-primary hover:text-gray-800">
              {{ t().createNewAccount }}
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <!-- ... existing form fields ... -->
          <div class="space-y-4">
            <app-ui-input
              [label]="t().emailLabel"
              type="email"
              [placeholder]="t().emailPlaceholder"
              formControlName="email"
              [required]="true"
            ></app-ui-input>

            <app-ui-input
              [label]="t().passwordLabel"
              type="password"
              [placeholder]="t().passwordPlaceholder"
              formControlName="password"
              [required]="true"
            ></app-ui-input>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                {{ t().rememberMe }}
              </label>
            </div>

            <!-- Forgot password link removed as requested -->
          </div>

          <div>
            <app-ui-button type="submit" [fullWidth]="true" [disabled]="loginForm.invalid">
              {{ t().signInButton }}
            </app-ui-button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  t = this.languageService.t;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (response) => {
          if (response.isAuthenticated) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this.toastService.error('Login Failed', 'Invalid email or password. Please try again.');
        },
      });
    } else {
      this.toastService.error('Invalid Form', 'Please fill in all required fields correctly.');
      this.loginForm.markAllAsTouched();
    }
  }
}
