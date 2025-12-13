import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { DeleteConfirmationModalComponent } from '../../../components/shared/delete-confirmation-modal/delete-confirmation-modal.component';
import { BranchService, Branch, BranchExtended } from '../../../core/services/branch.service';
import { UserService, User } from '../../../core/services/user.service';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent, UiSkeletonComponent],
  templateUrl: './branches.component.html',
})
export class BranchesComponent implements OnInit {
  private toastService = inject(ToastService);
  private branchService = inject(BranchService);
  private userService = inject(UserService);
  langService = inject(LanguageService);

  branches = signal<BranchExtended[]>([]);
  nonAdminUsers = signal<User[]>([]);
  managerSearchTerm = signal('');
  showManagerDropdown = signal(false);
  selectedManager = signal<User | null>(null);

  // Computed signal for filtered managers based on search term
  filteredManagers = computed(() => {
    const searchTerm = this.managerSearchTerm().toLowerCase();
    if (!searchTerm) return this.nonAdminUsers();
    return this.nonAdminUsers().filter((user) => user.email.toLowerCase().includes(searchTerm));
  });

  showModal = signal(false);
  showDeleteModal = signal(false);
  isEditMode = signal(false);
  branchToDelete = signal<BranchExtended | null>(null);
  formData = signal<Partial<BranchExtended>>({});

  searchTerm = signal('');

  // Computed signal for filtered branches
  filteredBranches = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.branches();
    return this.branches().filter(
      (b) => b.name.toLowerCase().includes(term) || b.location.toLowerCase().includes(term)
    );
  });

  getActiveBranches() {
    return this.branches().filter((b) => b.status === 'Active').length;
  }

  getInactiveBranches() {
    return this.branches().filter((b) => b.status === 'Inactive').length;
  }

  getAvgRevenue() {
    const total = this.branches().reduce((sum, b) => sum + (b.revenue || 0), 0);
    return this.branches().length > 0 ? Math.round(total / this.branches().length) : 0;
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.formData.set({ status: 'Active', staff: 0, revenue: 0 });
    this.selectedManager.set(null);
    this.managerSearchTerm.set('');
    this.showModal.set(true);
  }

  openEditModal(branch: BranchExtended) {
    this.isEditMode.set(true);
    this.formData.set({ ...branch });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.formData.set({});
    this.selectedManager.set(null);
    this.managerSearchTerm.set('');
    this.showManagerDropdown.set(false);
    this.selectedImageFile = null;
  }

  selectedImageFile: File | null = null;

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Store the actual file for upload
      this.selectedImageFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.update((data) => ({ ...data, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  saveBranch() {
    const data = this.formData();
    const manager = this.selectedManager();

    if (!data.name || !data.location || !manager) {
      this.toastService.error('Validation Error', 'Please fill all required fields');
      return;
    }

    // Create FormData for the API
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Location', data.location);
    formData.append('ManagerId', manager.id);

    // Add image file if selected
    if (this.selectedImageFile) {
      formData.append('Image', this.selectedImageFile);
    }

    if (this.isEditMode() && data.id) {
      // Update existing branch
      this.branchService.updateBranch(data.id, formData).subscribe({
        next: (updated) => {
          this.branches.update((branches) =>
            branches.map((b) =>
              b.id === data.id
                ? ({ ...b, ...updated, managerName: manager.email } as BranchExtended)
                : b
            )
          );
          this.toastService.success('Success', 'Branch updated successfully');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating branch:', error);
          this.toastService.error('Error', 'Failed to update branch');
        },
      });
    } else {
      // Create new branch
      this.branchService.createBranch(formData).subscribe({
        next: (created) => {
          const newBranch: BranchExtended = {
            ...created,
            managerName: manager.email,
            photo: data.photo,
            staff: 0,
            status: 'Active',
            revenue: 0,
          };
          this.branches.update((branches) => [...branches, newBranch]);
          this.toastService.success('Success', 'Branch created successfully');
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating branch:', error);
          this.toastService.error('Error', 'Failed to create branch');
        },
      });
    }
  }

  openDeleteModal(branch: BranchExtended) {
    this.branchToDelete.set(branch);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.branchToDelete.set(null);
  }

  confirmDelete() {
    const branch = this.branchToDelete();
    if (branch) {
      this.branchService.deleteBranch(branch.id).subscribe({
        next: () => {
          this.branches.update((branches) => branches.filter((b) => b.id !== branch.id));
          this.toastService.success('Deleted', `Branch "${branch.name}" has been deleted`);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting branch:', error);
          this.toastService.error('Error', 'Failed to delete branch');
          this.closeDeleteModal();
        },
      });
    }
  }

  exportData() {
    this.toastService.success('Export', 'Branches data exported successfully');
  }

  selectManager(user: User) {
    this.selectedManager.set(user);
    this.managerSearchTerm.set('');
    this.showManagerDropdown.set(false);
  }

  clearManagerSelection() {
    this.selectedManager.set(null);
    this.managerSearchTerm.set('');
  }

  toggleManagerDropdown() {
    this.showManagerDropdown.update((show) => !show);
  }

  isLoading = signal(true); // Default to true on init

  ngOnInit() {
    // Load branches from service
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        // Map Branch[] to BranchExtended[] with default values
        // Note: API Branch only has id, name, location
        const extendedBranches: BranchExtended[] = branches.map((branch) => ({
          ...branch, // spreads id, name, location
          ...branch, // spreads id, name, location, managerEmail
          managerName: branch.managerEmail || '', // Map managerEmail to managerName for display
          photo: undefined, // Extended property - default value
          staff: 0, // Extended property - default value
          status: 'Active', // Extended property - default value
          revenue: 0, // Extended property - default value
        }));
        this.branches.set(extendedBranches);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.toastService.error('Error', 'Failed to load branches');
        this.isLoading.set(false);
      },
    });

    // Load non-admin users for manager selection
    this.userService.getNonAdminUsers().subscribe({
      next: (users) => {
        this.nonAdminUsers.set(users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.error('Error', 'Failed to load users');
      },
    });
  }
}
