import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'barber_shop_cart';

  // Cart items signal
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // Computed total items count
  totalItems = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  });

  // Computed total price
  totalPrice = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  });

  // Checkout state
  checkoutPhone = signal<string>('');
  checkoutAddress = signal<string>('');

  // Public readonly cart items
  items = this.cartItems.asReadonly();

  constructor() {
    // Load saved checkout data if any
    const savedPhone = localStorage.getItem('checkout_phone');
    const savedAddress = localStorage.getItem('checkout_address');
    if (savedPhone) this.checkoutPhone.set(savedPhone);
    if (savedAddress) this.checkoutAddress.set(savedAddress);
  }

  updateCheckoutInfo(phone: string, address: string) {
    this.checkoutPhone.set(phone);
    this.checkoutAddress.set(address);
    localStorage.setItem('checkout_phone', phone);
    localStorage.setItem('checkout_address', address);
  }

  // Add item to cart
  addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const currentCart = this.cartItems();
    const existingItemIndex = currentCart.findIndex((i) => i.productId === item.productId);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      this.cartItems.set(updatedCart);
    } else {
      // Add new item
      this.cartItems.set([...currentCart, { ...item, quantity }]);
    }

    this.saveCartToStorage();
  }

  // Remove item from cart
  removeFromCart(productId: number) {
    const updatedCart = this.cartItems().filter((item) => item.productId !== productId);
    this.cartItems.set(updatedCart);
    this.saveCartToStorage();
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedCart = this.cartItems().map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedCart);
    this.saveCartToStorage();
  }

  // Clear entire cart
  clearCart() {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  // Load cart from localStorage
  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      const items: CartItem[] = stored ? JSON.parse(stored) : [];
      // Sanitize items - ensure stock is valid
      return items.map((item) => ({
        ...item,
        stock: item.stock || 50,
      }));
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  // Save cart to localStorage
  private saveCartToStorage() {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
