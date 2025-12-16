import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';
import { UiButtonComponent } from '../../../components/shared/ui-button.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { UiCardComponent } from '../../../components/shared/ui-card.component';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
    UiInputComponent,
    UiCardComponent,
    ReactiveFormsModule,
    DeleteConfirmationModalComponent,
  ],
  template: `
    <div class="min-h-screen bg-white py-12">
      <div class="container mx-auto px-4 max-w-3xl">
        <!-- Header -->
        <div class="mb-10 text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-secondary mb-4 border border-secondary/20"
          >
            <span class="text-3xl font-bold">{{ user()?.firstName?.charAt(0) || 'U' }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ user()?.firstName }} {{ user()?.lastName }}
          </h1>
          <p class="text-gray-500">
            {{ user()?.email }}
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex justify-center mb-8 border-b border-gray-200">
          <button
            (click)="activeTab = 'general'"
            class="px-6 py-3 text-sm font-medium transition-colors relative"
            [ngClass]="
              activeTab === 'general' ? 'text-secondary' : 'text-gray-500 hover:text-gray-700'
            "
          >
            {{ t().profile }}
            @if (activeTab === 'general') {
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
            }
          </button>
          <button
            (click)="activeTab = 'security'"
            class="px-6 py-3 text-sm font-medium transition-colors relative"
            [ngClass]="
              activeTab === 'security' ? 'text-secondary' : 'text-gray-500 hover:text-gray-700'
            "
          >
            {{ t().security }} @if (activeTab === 'security') {
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
            }
          </button>
        </div>

        <!-- Tab Content -->
        <div class="space-y-6">
          @if (activeTab === 'general') {
          <app-ui-card class="p-6 md:p-8 bg-white shadow-sm border border-gray-100">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-1">{{ t().personalDetails }}</h2>
              <p class="text-sm text-gray-500">{{ t().updateAccountInfo }}</p>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <app-ui-input
                  [label]="t().firstNameLabel"
                  formControlName="firstName"
                ></app-ui-input>
                <app-ui-input [label]="t().lastNameLabel" formControlName="lastName"></app-ui-input>
              </div>

              <app-ui-input
                [label]="t().emailLabel"
                formControlName="email"
                type="email"
              ></app-ui-input>

              <app-ui-input
                [label]="t().phoneNumberLabel"
                formControlName="phoneNumber"
                type="tel"
              ></app-ui-input>

              <div class="flex justify-end pt-4">
                <app-ui-button
                  type="submit"
                  [disabled]="profileForm.invalid || isProfileProcessing"
                >
                  @if (isProfileProcessing) { {{ t().saving }} } @else { {{ t().saveChanges }} }
                </app-ui-button>
              </div>
            </form>
          </app-ui-card>
          } @if (activeTab === 'security') {
          <div class="space-y-6">
            <app-ui-card class="p-6 md:p-8 bg-white shadow-sm border border-gray-100">
              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-900 mb-1">{{ t().changePassword }}</h2>
                <p class="text-sm text-gray-500">
                  {{ t().updatePasswordInfo }}
                </p>
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-5">
                <app-ui-input
                  [label]="t().currentPassword"
                  formControlName="currentPassword"
                  type="password"
                  placeholder="••••••••"
                ></app-ui-input>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <app-ui-input
                      [label]="t().newPassword"
                      formControlName="newPassword"
                      type="password"
                      placeholder="••••••••"
                      [error]="
                        passwordForm.get('newPassword')?.touched &&
                        passwordForm.get('newPassword')?.invalid
                          ? t().weakPassword
                          : ''
                      "
                    ></app-ui-input>

                    <!-- Password Requirements Feedback -->
                    @if (passwordForm.get('newPassword')?.value) {
                    <div class="text-sm space-y-1 bg-gray-50 p-3 rounded-md">
                      <p class="font-medium text-gray-700 mb-2">
                        {{ t().passwordRequirementsTitle }}
                      </p>
                      <div
                        class="flex items-center gap-2"
                        [class.text-green-600]="checkPassword('minLength')"
                        [class.text-gray-500]="!checkPassword('minLength')"
                      >
                        @if (checkPassword('minLength')) { <span>✓</span> } @else { <span>○</span> }
                        {{ t().reqMinLength }}
                      </div>
                      <div
                        class="flex items-center gap-2"
                        [class.text-green-600]="checkPassword('uppercase')"
                        [class.text-gray-500]="!checkPassword('uppercase')"
                      >
                        @if (checkPassword('uppercase')) { <span>✓</span> } @else { <span>○</span> }
                        {{ t().reqUppercase }}
                      </div>
                      <div
                        class="flex items-center gap-2"
                        [class.text-green-600]="checkPassword('lowercase')"
                        [class.text-gray-500]="!checkPassword('lowercase')"
                      >
                        @if (checkPassword('lowercase')) { <span>✓</span> } @else { <span>○</span> }
                        {{ t().reqLowercase }}
                      </div>
                      <div
                        class="flex items-center gap-2"
                        [class.text-green-600]="checkPassword('number')"
                        [class.text-gray-500]="!checkPassword('number')"
                      >
                        @if (checkPassword('number')) { <span>✓</span> } @else { <span>○</span> }
                        {{ t().reqNumber }}
                      </div>
                      <div
                        class="flex items-center gap-2"
                        [class.text-green-600]="checkPassword('special')"
                        [class.text-gray-500]="!checkPassword('special')"
                      >
                        @if (checkPassword('special')) { <span>✓</span> } @else { <span>○</span> }
                        {{ t().reqSpecial }}
                      </div>
                    </div>
                    }
                  </div>

                  <app-ui-input
                    [label]="t().confirmNewPassword"
                    formControlName="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    [error]="passwordForm.errors?.['passwordMismatch'] && (passwordForm.get('confirmPassword')?.touched || passwordForm.get('confirmPassword')?.dirty) ? t().passwordsDoNotMatch : ''"
                  ></app-ui-input>
                </div>

                <div class="flex justify-end pt-4">
                  <app-ui-button
                    type="submit"
                    [disabled]="passwordForm.invalid || isPasswordProcessing || !isPasswordValid()"
                  >
                    @if (isPasswordProcessing) { {{ t().updating }} } @else {
                    {{ t().updatePassword }} }
                  </app-ui-button>
                </div>
              </form>
            </app-ui-card>

            <div
              class="rounded-xl shadow-sm overflow-hidden p-6 border border-red-200 bg-red-50 text-red-900"
            >
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 class="text-lg font-bold text-red-700 mb-1">
                    {{ t().deleteAccount }}
                  </h3>
                  <p class="text-sm text-red-600/80">{{ t().permanentDeleteWarning }}</p>
                </div>
                <app-ui-button
                  variant="outline"
                  class="border-red-300 text-red-600 hover:bg-red-100 w-full sm:w-auto"
                  (click)="showDeleteModal = true"
                >
                  {{ t().deleteAccount }}
                </app-ui-button>
              </div>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <app-delete-confirmation-modal
        [isOpen]="showDeleteModal"
        entityType="Account"
        [entityName]="user()?.email || t().myAccount"
        (confirmed)="onDeleteAccount()"
        (cancelled)="showDeleteModal = false"
      ></app-delete-confirmation-modal>
    </div>
  `,
})
export class ProfileComponent {
  authService = inject(AuthService);
  languageService = inject(LanguageService);
  toastService = inject(ToastService);

  t = this.languageService.t;
  user = this.authService.currentUser;

  activeTab: 'general' | 'security' = 'general'; // State for tabs
  isProfileProcessing = false;
  isPasswordProcessing = false;
  showDeleteModal = false;

  // Split into two forms for clarity
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl(''),
  });

  passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  constructor() {
    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        this.profileForm.patchValue({
          firstName: currentUser.firstName || localStorage.getItem('firstName') || '',
          lastName: currentUser.lastName || localStorage.getItem('lastName') || '',
          email: currentUser.email || localStorage.getItem('email') || '',
          phoneNumber: currentUser.phoneNumber || localStorage.getItem('phoneNumber') || '',
        });
      } else {
        // Fallback to local storage if signal is empty (e.g. fresh reload)
        this.profileForm.patchValue({
          firstName: localStorage.getItem('firstName') || '',
          lastName: localStorage.getItem('lastName') || '',
          email: localStorage.getItem('email') || '',
          phoneNumber: localStorage.getItem('phoneNumber') || '',
        });
      }
    });
  }

  // Password Validation Logic
  passwordValidators = {
    minLength: (val: string) => val.length >= 6,
    uppercase: (val: string) => /[A-Z]/.test(val),
    lowercase: (val: string) => /[a-z]/.test(val),
    number: (val: string) => /[0-9]/.test(val),
    special: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
  };

  checkPassword(criterion: keyof typeof this.passwordValidators): boolean {
    const val = this.passwordForm.get('newPassword')?.value || '';
    return this.passwordValidators[criterion](val);
  }

  isPasswordValid(): boolean {
    const val = this.passwordForm.get('newPassword')?.value || '';
    return Object.values(this.passwordValidators).every((validator) => validator(val));
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  onUpdateProfile() {
    if (this.profileForm.invalid || this.isProfileProcessing) return;

    const userId = this.authService.userId;
    if (!userId) {
      this.toastService.error(this.t().error, this.t().userIdNotFound);
      return;
    }

    this.isProfileProcessing = true;
    const formVal = this.profileForm.value;

    this.authService
      .updateUser(userId, {
        firstName: formVal.firstName!,
        lastName: formVal.lastName!,
        email: formVal.email!,
        phoneNumber: formVal.phoneNumber || '',
      })
      .subscribe({
        next: () => {
          this.toastService.success(this.t().success, this.t().profileUpdatedSuccess);
          this.isProfileProcessing = false;
        },
        error: (err) => {
          console.error('Update failed', err);
          this.toastService.error(
            this.t().error,
            err.error?.message || this.t().updateProfileFailed
          );
          this.isProfileProcessing = false;
        },
      });
  }

  onChangePassword() {
    if (this.passwordForm.invalid || this.isPasswordProcessing || !this.isPasswordValid()) {
      if (!this.isPasswordValid()) {
        this.toastService.error(this.t().weakPassword, this.t().passwordRequirementsError);
      }
      return;
    }

    const userId = this.authService.userId;
    if (!userId) return;

    this.isPasswordProcessing = true;
    const formVal = this.passwordForm.value;

    this.authService
      .changePassword(userId, {
        currentPassword: formVal.currentPassword!,
        newPassword: formVal.newPassword!,
      })
      .subscribe({
        next: () => {
          this.toastService.success(this.t().success, this.t().passwordChangedSuccess);
          this.passwordForm.reset();
          this.isPasswordProcessing = false;
        },
        error: (err) => {
          console.error('Password change failed', err);
          this.toastService.error(
            this.t().error,
            err.error?.message || this.t().changePasswordFailed
          );
          this.isPasswordProcessing = false;
        },
      });
  }

  onDeleteAccount() {
    const userId = this.authService.userId;
    if (!userId) return;

    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.success(this.t().success, this.t().accountDeletedSuccess);
        // Logout handled in service
      },
      error: (err) => {
        console.error('Delete failed', err);
        this.toastService.error(this.t().error, this.t().deleteFailed);
        this.showDeleteModal = false;
      },
    });
  }
}
