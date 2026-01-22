"use client";

/**
 * 글로벌 Provider 모음
 *
 * - 여기에서 AuthProvider, ThemeProvider 등 전역 상태/설정을 감쌉니다.
 * - 현재는 AuthProvider만 감싸지만, 나중에 Provider가 늘어나더라도
 *   이 파일만 수정하면 되도록 구성했습니다.
 */

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

