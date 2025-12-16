import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, UiInputComponent, UiButtonComponent, ReactiveFormsModule],
  template: `
    <div
      class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Complete Profile</h2>
          <p class="mt-2 text-sm text-gray-600">
            Please provide your phone number to complete your registration.
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="completeProfileForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <app-ui-input
                label="First Name"
                type="text"
                formControlName="firstName"
                [required]="true"
              ></app-ui-input>

              <app-ui-input
                label="Last Name"
                type="text"
                formControlName="lastName"
                [required]="true"
              ></app-ui-input>
            </div>

            <app-ui-input
              label="Phone Number"
              type="tel"
              placeholder="+1234567890"
              formControlName="phoneNumber"
              [required]="true"
            ></app-ui-input>

            <app-ui-input
              label="Email"
              type="email"
              formControlName="email"
              [required]="true"
              [disabled]="true"
            ></app-ui-input>

            <app-ui-input
              label="Set Password"
              type="password"
              placeholder="******"
              formControlName="password"
              [required]="true"
            ></app-ui-input>
          </div>

          <div>
            <app-ui-button
              type="submit"
              [fullWidth]="true"
              [disabled]="completeProfileForm.invalid"
            >
              Complete Registration
            </app-ui-button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CompleteProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  languageService = inject(LanguageService);
  t = this.languageService.t;

  completeProfileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    ]),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.completeProfileForm.patchValue({
        firstName: currentUser.firstName || currentUser.name?.split(' ')[0] || '',
        lastName: currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '',
        email: currentUser.email,
      });
    } else {
      // If no user/session (e.g. reload), redirect to login
      this.router.navigate(['/auth/login']);
    }
  }

  onSubmit() {
    if (this.completeProfileForm.valid) {
      const { firstName, lastName, phoneNumber, password } = this.completeProfileForm.value;
      const currentUser = this.authService.currentUser();

      if (!currentUser) return;

      // We are essentially updating the profile, but for the sake of the requirement,
      // we might be calling a specific endpoint or just updateProfile.
      // Since it's "registering with Google then redirecting", we might treat it as an update
      // where we add the missing info.

      this.authService
        .updateUser(currentUser.id, {
          firstName: firstName!,
          lastName: lastName!,
          phoneNumber: phoneNumber!,
          email: currentUser.email,
        })
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.error('Profile completion failed', err);
          },
        });
    }
  }
}
