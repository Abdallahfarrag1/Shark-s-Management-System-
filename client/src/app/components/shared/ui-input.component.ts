import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5">
      <label *ngIf="label()" class="text-sm font-medium text-gray-700">
        {{ label() }} <span *ngIf="required()" class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [formControl]="control"
          [class.border-red-500]="hasError()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
          (blur)="onTouched()"
        />
        <!-- Optional Icon Slot -->
        <div
          class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-gray-400"
        >
          <ng-content select="[icon]"></ng-content>
        </div>
      </div>
      <span *ngIf="hasError()" class="text-xs text-red-500 mt-0.5">
        {{ errorMessage() }}
      </span>
    </div>
  `,
})
export class UiInputComponent implements ControlValueAccessor {
  label = input('');
  type = input('text');
  placeholder = input('');
  required = input(false);
  error = input<string | null>(null);

  control = new FormControl('');

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  hasError() {
    return (this.control.invalid && this.control.touched) || this.error();
  }

  errorMessage() {
    if (this.error()) return this.error();
    if (this.control.hasError('required')) return 'This field is required';
    if (this.control.hasError('email')) return 'Invalid email address';
    if (this.control.hasError('minlength'))
      return `Minimum length is ${this.control.errors?.['minlength'].requiredLength}`;
    return 'Invalid value';
  }
}
