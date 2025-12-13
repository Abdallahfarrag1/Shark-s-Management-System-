import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Branch, BranchExtended } from '../../../core/services/branch.service';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
        <input
          [(ngModel)]="branch.name"
          name="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Branch Name"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="location">Location</label>
        <input
          [(ngModel)]="branch.location"
          name="location"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="location"
          type="text"
          placeholder="Location"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">Phone</label>
        <input
          [(ngModel)]="branch.phone"
          name="phone"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="text"
          placeholder="Phone"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="managerId">Manager ID</label>
        <input
          [(ngModel)]="branch.managerId"
          name="managerId"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="managerId"
          type="text"
          placeholder="Manager ID"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="image">Image</label>
        <input
          type="file"
          (change)="onFileSelected($event)"
          accept="image/*"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="image"
        />
        @if (imagePreview()) {
        <div class="mt-2">
          <img
            [src]="imagePreview()!"
            loading="lazy"
            [alt]="'Preview'"
            class="w-32 h-32 object-cover rounded"
          />
        </div>
        }
      </div>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          (click)="onCancel()"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          [disabled]="isSaving()"
        >
          {{ isSaving() ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class BranchFormComponent implements OnInit {
  @Input() branch: Partial<BranchExtended> = { name: '', location: '', phone: '' };
  @Output() save = new EventEmitter<FormData>();
  @Output() cancel = new EventEmitter<void>();

  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;
  isSaving = signal(false);

  ngOnInit() {
    // Set image preview if branch has an existing image
    if (this.branch.image) {
      this.imagePreview.set(this.branch.image);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    this.isSaving.set(true);

    // Create FormData
    const formData = new FormData();
    formData.append('Name', this.branch.name || '');
    formData.append('Location', this.branch.location || '');

    if (this.branch.managerId) {
      formData.append('ManagerId', this.branch.managerId.toString());
    }

    // Add the image file if selected
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this.save.emit(formData);
  }

  onCancel() {
    this.cancel.emit();
  }
}
