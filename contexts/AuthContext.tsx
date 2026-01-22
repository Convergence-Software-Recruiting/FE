'use client';

/**
 * AuthContext.tsx
 *
 * - 기존에 Context + useState 로 구현했던 어드민 상태 관리를
 *   Zustand 스토어(`useAuthStore`) 래핑 형태로 단순화한 버전입니다.
 * - 실제 전역 상태는 전부 `stores/useAuthStore.ts` 에 있고,
 *   여기서는 "초기 한 번 me 호출" + "useAuth 훅"만 제공합니다.
 */

import { ReactNode, useEffect } from 'react';
import { useAuthStore, type AuthState, type AdminUser } from '@/stores/useAuthStore';

/**
 * 앱 전체를 감싸는 AuthProvider
 *
 * - Zustand 자체는 Provider가 필요 없지만,
 *   앱 최초 진입 시 `/api/admin/me` 를 한 번 호출해서
 *   이미 로그인된 세션이 있는지 확인하기 위해 래퍼를 둡니다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshAdmin = useAuthStore((state) => state.refreshAdmin);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      void refreshAdmin();
    }
  }, [isInitialized, isLoading, refreshAdmin]);

  return <>{children}</>;
}

/**
 * 컴포넌트에서 사용할 인증 상태/액션 타입
 *
 * - `useAuthStore`의 상태와 동일하지만, 추후 필요 시 확장 여지를 남깁니다.
 */
export interface AuthContextType extends AuthState {
  admin: AdminUser | null;
}

/**
 * 전역 어드민 상태를 사용하는 훅
 *
 * - 내부적으로 Zustand 스토어를 그대로 반환합니다.
 * - 사용법: `const { admin, isLoading, login, logout } = useAuth();`
 */
export function useAuth(): AuthContextType {
  return useAuthStore();
}
