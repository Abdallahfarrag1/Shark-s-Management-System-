export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
}
