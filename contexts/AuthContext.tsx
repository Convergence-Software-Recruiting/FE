'use client';

// AuthContext는 클라이언트 컴포넌트여야 합니다
// Next.js App Router에서는 'use client' 지시어가 필요합니다

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  // Auth 관련 타입 정의
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth 로직 구현
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

