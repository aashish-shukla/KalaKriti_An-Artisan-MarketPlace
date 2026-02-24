// artisan/src/lib/api/services.ts
import { apiClient } from './client';
import type { PaginatedApiResponse } from './client';
import type {
  User,
  Product,
  Order,
  Shop,
  Review,
  Category,
  Notification,
  SearchFilters,
} from '@/types';

// ─── Auth Service ─────────────────────────────────────────────
export const authService = {
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
    shopDetails?: { name: string; description: string };
  }) => apiClient.post<{ user: User; token: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<{ user: User; token: string }>('/auth/login', data),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post(`/auth/reset-password/${token}`, { password }),

  getMe: () => apiClient.get<{ user: User }>('/auth/me'),
};

// ─── Product Service ──────────────────────────────────────────
export const productService = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    featured?: boolean;
    shop?: string;
  }) => {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.category) queryParams.category = params.category;
    if (params?.minPrice) queryParams.minPrice = params.minPrice;
    if (params?.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params?.search) queryParams.search = params.search;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.featured !== undefined) queryParams.featured = params.featured;
    if (params?.shop) queryParams.shop = params.shop;

    return apiClient.get<PaginatedApiResponse<Product>>('/products', {
      params: queryParams,
    });
  },

  getProduct: (id: string) =>
    apiClient.get<{ product: Product }>(`/products/${id}`),

  createProduct: (data: Partial<Product>) =>
    apiClient.post<{ product: Product }>('/products', data),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<{ product: Product }>(`/products/${id}`, data),

  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),

  searchProducts: (filters: SearchFilters) => {
    const params: Record<string, string | number | boolean> = {};
    if (filters.query) params.search = filters.query;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.sortBy) {
      const sortMap: Record<string, string> = {
        newest: '-createdAt',
        price_asc: 'price',
        price_desc: '-price',
        popular: '-sales.count',
        rating: '-ratings.average',
        relevance: '-createdAt',
      };
      params.sort = sortMap[filters.sortBy] || '-createdAt';
    }

    return apiClient.get<PaginatedApiResponse<Product>>('/products', { params });
  },
};

// ─── Order Service ────────────────────────────────────────────
export const orderService = {
  createOrder: (data: {
    items: { product: string; quantity: number }[];
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
  }) => {
    // Backend expects payment.method, not flat paymentMethod
    const payload = {
      items: data.items,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      payment: {
        method: data.paymentMethod,
      },
    };
    return apiClient.post<{ order: Order }>('/orders', payload);
  },

  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<PaginatedApiResponse<Order>>('/orders', {
      params: params as Record<string, string | number | boolean>,
    }),

  getOrder: (id: string) =>
    apiClient.get<{ order: Order }>(`/orders/${id}`),

  // Backend uses PUT for order status, not PATCH
  updateOrderStatus: (id: string, data: { status: string; note?: string }) =>
    apiClient.put<{ order: Order }>(`/orders/${id}/status`, data),

  cancelOrder: (id: string, reason?: string) =>
    apiClient.put<{ order: Order }>(`/orders/${id}/cancel`, { reason }),
};

// ─── Shop Service ─────────────────────────────────────────────
export const shopService = {
  getShops: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedApiResponse<Shop>>('/shops', {
      params: params as Record<string, string | number | boolean>,
    }),

  getShop: (id: string) =>
    apiClient.get<{ shop: Shop }>(`/shops/${id}`),

  createShop: (data: Partial<Shop>) =>
    apiClient.post<{ shop: Shop }>('/shops', data),

  updateShop: (id: string, data: Partial<Shop>) =>
    apiClient.put<{ shop: Shop }>(`/shops/${id}`, data),

  getShopProducts: (shopId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedApiResponse<Product>>(`/shops/${shopId}/products`, {
      params: params as Record<string, string | number | boolean>,
    }),
};

// ─── Review Service ───────────────────────────────────────────
export const reviewService = {
  getProductReviews: (productId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedApiResponse<Review>>(`/reviews/product/${productId}`, {
      params: params as Record<string, string | number | boolean>,
    }),

  createReview: (data: {
    product: string;
    rating: number;
    title?: string;
    comment: string;
  }) => apiClient.post<{ review: Review }>('/reviews', data),

  updateReview: (id: string, data: Partial<Review>) =>
    apiClient.put<{ review: Review }>(`/reviews/${id}`, data),

  deleteReview: (id: string) => apiClient.delete(`/reviews/${id}`),
};

// ─── User Service ─────────────────────────────────────────────
export const userService = {
  getProfile: () =>
    apiClient.get<{ user: User }>('/users/profile'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<{ user: User }>('/users/profile', data),

  // Cart endpoints - backend uses PUT for updates at /cart/:productId
  getCart: () =>
    apiClient.get<{ cart: any[] }>('/users/cart'),

  addToCart: (productId: string, quantity: number = 1) =>
    apiClient.post<{ cart: any[] }>('/users/cart', { productId, quantity }),

  updateCartItem: (productId: string, quantity: number) =>
    apiClient.put<{ cart: any[] }>(`/users/cart/${productId}`, { quantity }),

  removeFromCart: (productId: string) =>
    apiClient.delete<{ cart: any[] }>(`/users/cart/${productId}`),

  clearCart: () =>
    apiClient.delete('/users/cart'),

  // Wishlist endpoints - backend uses URL params, not body
  getWishlist: () =>
    apiClient.get<{ wishlist: Product[] }>('/users/wishlist'),

  addToWishlist: (productId: string) =>
    apiClient.post(`/users/wishlist/${productId}`),

  removeFromWishlist: (productId: string) =>
    apiClient.delete(`/users/wishlist/${productId}`),
};

// ─── Category Service ─────────────────────────────────────────
export const categoryService = {
  getCategories: (params?: { parent?: string }) =>
    apiClient.get<Category[]>('/categories', {
      params: params as Record<string, string | number | boolean>,
    }),

  getCategory: (id: string) =>
    apiClient.get<{ category: Category }>(`/categories/${id}`),
};

// ─── Notification Service ─────────────────────────────────────
export const notificationService = {
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    apiClient.get<PaginatedApiResponse<Notification>>('/notifications', {
      params: params as Record<string, string | number | boolean>,
    }),

  markAsRead: (id: string) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/read-all'),

  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),
};