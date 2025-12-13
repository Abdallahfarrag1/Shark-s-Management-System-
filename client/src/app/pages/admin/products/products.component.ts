import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../core/services/product.service';
import { ProductFormComponent } from '../../../components/forms/product-form/product-form.component';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent, UiSkeletonComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  langService = inject(LanguageService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  showProductForm = signal(false);
  selectedProduct = signal<Product | null>(null);

  searchTerm = signal('');

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) => p.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products received from API:', products);
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }

  openAddProductModal() {
    this.selectedProduct.set(null);
    this.showProductForm.set(true);
  }

  openEditProductModal(product: Product) {
    this.selectedProduct.set(product);
    this.showProductForm.set(true);
  }

  closeProductModal() {
    this.showProductForm.set(false);
    this.selectedProduct.set(null);
  }

  handleProductSave() {
    this.closeProductModal();
    this.loadProducts();
  }

  deleteProduct(product: Product) {
    if (!product.id || !confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      },
    });
  }
}
