export interface User {
  _id: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  avatar?: string;
  address?: Address[];
  shop?: Shop;
  wishlist?: string[];
  cart?: CartItem[];
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Shop {
  _id: string;
  owner: string | User;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval';
  ratings: {
    average: number;
    count: number;
  };
  stats: {
    totalProducts: number;
    totalSales: number;
    totalOrders: number;
    totalRevenue: number;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  shop: string | Shop;
  seller: string | User;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category: string | Category;
  subcategory?: string | Category;
  images: ProductImage[];
  inventory: {
    sku?: string;
    stock: number;
    lowStockThreshold: number;
    trackInventory: boolean;
  };
  stock?: number; // Alias for inventory.stock
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock' | 'draft';
  featured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  rating?: number; // Alias for ratings.average
  reviewCount?: number; // Alias for ratings.count
  sales: {
    count: number;
    revenue: number;
  };
  views: number;
  shipping: {
    isFreeShipping: boolean;
    shippingCost: number;
    processingTime?: string;
  };
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  image?: string;
  isActive: boolean;
}

export interface CartItem {
  _id?: string;
  product: string | Product;
  quantity: number;
  addedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: string | User;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  payment: {
    method: 'card' | 'cash_on_delivery' | 'wallet';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id?: string;
  product: string | Product;
  shop: string | Shop;
  seller: string | User;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Review {
  _id: string;
  product: string | Product;
  user: string | User;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'order' | 'order_status' | 'shop' | 'inventory' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tags?: string[];
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
  page?: number;
  limit?: number;
}