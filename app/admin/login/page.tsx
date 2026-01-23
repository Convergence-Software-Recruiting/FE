'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function AdminLoginPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { admin, login, isLoading, error } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (!isLoading && admin) {
      router.replace('/admin');
    }
  }, [admin, isLoading, router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLocalError(null);

      if (!username.trim() || !password.trim()) {
        setLocalError('아이디와 비밀번호를 모두 입력해 주세요.');
        return;
      }

      const success = await login({ username: username.trim(), password });
      if (!success) {
        setLocalError(
          '로그인에 실패했습니다. 아이디/비밀번호를 다시 확인해 주세요.',
        );
        return;
      }

      router.replace('/admin');
    },
    [username, password, login, router],
  );

  // 로딩 또는 이미 로그인된 상태
  if (isLoading || admin) {
    return <LoadingState message="로그인 상태 확인 중..." />;
  }

  const displayError = localError || error;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-background via-white to-navy-50/50 ${
        isMobile ? 'py-12' : 'py-20'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/80 border border-navy-50 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1
            className={`font-bold text-navy-900 mb-6 ${
              isMobile ? 'text-2xl' : 'text-3xl'
            }`}
          >
            Admin 로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-navy-800">
                아이디
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 bg-white/80"
                placeholder="username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-navy-800">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-navy-400 bg-white/80"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {displayError && (
              <p className="text-sm text-red-600">{displayError}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2"
              variant="default"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
