// artisan/src/lib/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { userService } from '@/lib/api/services';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }

        try {
          await userService.addToCart(product._id, quantity);
        } catch (error) {
          // Revert on error
          set({ items: currentItems });
          throw error;
        }
      },

      removeItem: async (productId: string) => {
        const currentItems = get().items;
        set({
          items: currentItems.filter((item) => item.product._id !== productId),
        });

        try {
          await userService.removeFromCart(productId);
        } catch (error) {
          set({ items: currentItems });
          throw error;
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const currentItems = get().items;
        set({
          items: currentItems.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        });

        try {
          // Backend uses PUT for cart item updates
          await userService.updateCartItem(productId, quantity);
        } catch (error) {
          set({ items: currentItems });
          throw error;
        }
      },

      clearCart: async () => {
        const currentItems = get().items;
        set({ items: [] });

        try {
          await userService.clearCart();
        } catch (error) {
          set({ items: currentItems });
          throw error;
        }
      },

      syncCart: async () => {
        set({ isLoading: true });
        try {
          const response = await userService.getCart();
          const cart = response.cart || [];
          const items: CartItem[] = cart
            .filter((item: any) => item.product)
            .map((item: any) => ({
              product: item.product,
              quantity: item.quantity,
            }));
          set({ items });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);