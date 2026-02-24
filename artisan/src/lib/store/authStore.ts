// artisan/src/lib/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { apiClient } from '@/lib/api/client';
import { authService } from '@/lib/api/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          const user = response.user;
          const token = response.token;
          apiClient.setToken(token);
          set({ user, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: any) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          const user = response.user;
          const token = response.token;
          apiClient.setToken(token);
          set({ user, token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => set({ user }),

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          apiClient.setToken(token);
          const response = await authService.getMe();
          set({ user: response.user, isAuthenticated: true });
        } catch {
          apiClient.clearToken();
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);