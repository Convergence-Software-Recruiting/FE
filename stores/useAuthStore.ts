'use client';

import { create } from 'zustand';
import {
  fetchAdminMe,
  loginAdmin,
  logoutAdmin,
  type AdminLoginRequest,
  type AdminMeResponse,
} from '@/lib/adminApi';

export interface AdminUser {
  id: number;
  username: string;
  role: string;
  raw: AdminMeResponse;
}

export interface AuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshAdmin: () => Promise<void>;
  login: (payload: AdminLoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  accessToken:
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_access_token')
      : null,
  refreshToken:
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_refresh_token')
      : null,

  async refreshAdmin() {
    set({ isLoading: true, error: null });
    try {
      const me = await fetchAdminMe();
      if (me) {
        const mapped: AdminUser = {
          id: me.id,
          username: me.username,
          role: me.role,
          raw: me,
        };
        set({
          admin: mapped,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        set({
          admin: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('useAuthStore.refreshAdmin error', error);
      set({
        admin: null,
        isLoading: false,
        isInitialized: true,
        error: error?.message ?? '어드민 정보를 불러오는 중 오류가 발생했습니다.',
      });
    }
  },

  async login(payload: AdminLoginRequest) {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, refreshToken } = await loginAdmin(payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_access_token', accessToken);
        localStorage.setItem('admin_refresh_token', refreshToken);
      }
      set({ accessToken, refreshToken });
      await get().refreshAdmin();
      return true;
    } catch (error: any) {
      console.error('useAuthStore.login error', error);
      set({
        error: error?.message ?? '로그인에 실패했습니다.',
        isLoading: false,
      });
      return false;
    }
  },

  async logout() {
    set({ isLoading: true, error: null });
    try {
      await logoutAdmin();
    } catch (error: any) {
      console.error('useAuthStore.logout error', error);
      set({ error: error?.message ?? '로그아웃에 실패했습니다.' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
      }
      set({ admin: null, accessToken: null, refreshToken: null, isLoading: false });
    }
  },
}));

