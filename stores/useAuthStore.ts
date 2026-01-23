'use client';

import { create } from 'zustand';
import {
  fetchAdminMe,
  loginAdmin,
  logoutAdmin,
  type AdminLoginRequest,
  type AdminMeResponse,
} from '@/lib/adminApi';
import type { AxiosError } from 'axios';

// ============================================================================
// 타입 정의
// ============================================================================

export interface AdminUser {
  id: number;
  username: string;
  role: string;
  raw: AdminMeResponse;
}

export interface AuthState {
  // 상태
  admin: AdminUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  // 액션
  refreshAdmin: () => Promise<void>;
  login: (payload: AdminLoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

function getStoredToken(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function setStoredToken(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

function removeStoredToken(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

function mapAdminUser(me: AdminMeResponse): AdminUser {
  return {
    id: me.id,
    username: me.username,
    role: me.role,
    raw: me,
  };
}

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    '알 수 없는 오류가 발생했습니다.'
  );
}

// ============================================================================
// Zustand 스토어
// ============================================================================

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  admin: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  accessToken: getStoredToken('admin_access_token'),
  refreshToken: getStoredToken('admin_refresh_token'),

  // 어드민 정보 새로고침
  async refreshAdmin() {
    set({ isLoading: true, error: null });
    try {
      const me = await fetchAdminMe();
      if (me) {
        set({
          admin: mapAdminUser(me),
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuthStore] refreshAdmin error:', error);
      }
      set({
        admin: null,
        isLoading: false,
        isInitialized: true,
        error: getErrorMessage(error),
      });
    }
  },

  // 로그인
  async login(payload: AdminLoginRequest) {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, refreshToken } = await loginAdmin(payload);
      setStoredToken('admin_access_token', accessToken);
      setStoredToken('admin_refresh_token', refreshToken);
      set({ accessToken, refreshToken });
      await get().refreshAdmin();
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuthStore] login error:', error);
      }
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      return false;
    }
  },

  // 로그아웃
  async logout() {
    set({ isLoading: true, error: null });
    try {
      await logoutAdmin();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAuthStore] logout error:', error);
      }
      set({ error: getErrorMessage(error) });
    } finally {
      removeStoredToken('admin_access_token');
      removeStoredToken('admin_refresh_token');
      set({
        admin: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    }
  },
}));
