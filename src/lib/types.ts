export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  featured: boolean;
  tags: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "mpesa" | "pay_on_pickup";

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  mpesaReceipt?: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
};

export type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
};

export type CategoryFormInput = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type ProductFormInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categorySlug: string;
  featured: boolean;
  tags: string[];
  imageUrls: string[];
};

export type OrderUpdateInput = {
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  mpesaReceipt?: string;
};
