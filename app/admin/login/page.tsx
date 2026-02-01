'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { LoadingState } from '@/components/ui/loading-state';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function AdminLoginPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const { admin, login, isLoading, error } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      setIsSubmitting(true);
      const success = await login({ username: username.trim(), password });
      setIsSubmitting(false);

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
    <BackgroundPattern>
      <div className="min-h-screen flex items-center justify-center py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* 헤더 */}
            <div className="text-center mb-8 sm:mb-10">
              <div
                className={`inline-flex items-center justify-center rounded-full bg-white/10 border border-white/20 mb-6 animate-fade-up ${
                  isMobile ? 'w-16 h-16' : 'w-20 h-20'
                }`}
              >
                <Lock className="w-full h-full text-white/90" />
              </div>
              <h1
                className={`font-extrabold text-white mb-3 animate-fade-up [animation-delay:100ms] ${
                  isMobile
                    ? 'text-2xl sm:text-3xl'
                    : isTablet
                    ? 'text-3xl sm:text-4xl'
                    : 'text-4xl sm:text-5xl'
                }`}
              >
                관리자 로그인
              </h1>
              <p
                className={`text-white/80 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                  isMobile ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                }`}
              >
                어드민 계정으로 로그인하세요.
              </p>
            </div>

            {/* 로그인 폼 카드 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-fade-up [animation-delay:300ms]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white font-semibold text-sm sm:text-base mb-2">
                    아이디
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-white/30 bg-white/90 text-navy-900 placeholder-navy-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="아이디를 입력하세요"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold text-sm sm:text-base mb-2">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/30 bg-white/90 text-navy-900 placeholder-navy-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                  />
                </div>

                {displayError && (
                  <div className="rounded-xl bg-red-500/20 border border-red-400/50 px-4 py-3 text-red-100 text-sm">
                    {displayError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="hero"
                  size={isMobile ? 'lg' : 'xl'}
                  className="w-full shadow-2xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      로그인
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/20">
                <Link href="/" className="block">
                  <Button
                    type="button"
                    variant="heroOutline"
                    size={isMobile ? 'lg' : 'xl'}
                    className="w-full shadow-xl"
                  >
                    메인으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
