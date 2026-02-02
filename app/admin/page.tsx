'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ClipboardList, LogOut } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { LoadingState } from '@/components/ui/loading-state';

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function AdminPage() {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const { admin, isLoading, error, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // 로딩 상태
  if (isLoading) {
    return <LoadingState message="어드민 정보를 불러오는 중..." />;
  }

  // 로그인 안 된 상태 또는 에러 상태
  if (!admin || error) {
    return (
      <BackgroundPattern>
        <div className="flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div
                className={`mb-6 sm:mb-8 animate-fade-up ${
                  isMobile ? 'w-16 h-16' : 'w-20 h-20'
                }`}
              >
                <Lock className="w-full h-full text-white/80 mx-auto" />
              </div>
              <h1
                className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:100ms] ${
                  isMobile
                    ? 'text-3xl sm:text-4xl'
                    : isTablet
                    ? 'text-4xl sm:text-5xl'
                    : 'text-5xl sm:text-6xl'
                }`}
              >
                {error ? '접근 권한 없음' : '로그인이 필요합니다'}
              </h1>
              <p
                className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                  isMobile
                    ? 'text-base sm:text-lg'
                    : isTablet
                    ? 'text-lg sm:text-xl'
                    : 'text-xl sm:text-2xl'
                }`}
              >
                {error
                  ? '이 페이지에 접근할 권한이 없습니다.'
                  : '어드민 페이지에 접근하려면 로그인이 필요합니다.'}
                <br />
                <span className="text-gold-300 font-medium">
                  {error
                    ? '올바른 계정으로 로그인해 주세요.'
                    : '로그인 페이지로 이동하여 인증해 주세요.'}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:300ms]">
                <Link href="/admin/login">
                  <Button
                    variant="hero"
                    size={isMobile ? 'lg' : 'xl'}
                    className="group shadow-2xl"
                  >
                    로그인하기
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="heroOutline"
                    size={isMobile ? 'lg' : 'xl'}
                    className="shadow-xl"
                  >
                    메인으로
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </BackgroundPattern>
    );
  }

  // 로그인된 상태 - 어드민 정보 표시
  return (
    <BackgroundPattern>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <ClipboardList
                className={`text-white/80 mx-auto mb-4 animate-fade-up ${
                  isMobile ? 'w-12 h-12' : 'w-16 h-16'
                }`}
              />
              <h1
                className={`font-extrabold text-white mb-3 sm:mb-4 animate-fade-up [animation-delay:100ms] ${
                  isMobile
                    ? 'text-3xl sm:text-4xl'
                    : isTablet
                    ? 'text-4xl sm:text-5xl'
                    : 'text-5xl sm:text-6xl'
                }`}
              >
                관리자 대시보드
              </h1>
              <p
                className={`text-white/90 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                  isMobile
                    ? 'text-base sm:text-lg'
                    : isTablet
                    ? 'text-lg sm:text-xl'
                    : 'text-xl'
                }`}
              >
                모집 폼과 질문을 관리합니다.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm sm:text-base">
                  현재 로그인된 관리자
                </p>
                {admin.role && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs sm:text-sm">
                    {admin.role}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-white text-lg sm:text-xl font-bold">
                  {admin.username}
                </p>
                <p className="text-white/70 text-sm sm:text-base">
                  ID: {admin.id}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                <Link href="/admin/forms">
                  <Button variant="hero" size={isMobile ? 'lg' : 'xl'} className="shadow-xl">
                    모집 폼 관리
                  </Button>
                </Link>
                <Link href="/admin/applications">
                  <Button
                    variant="heroOutline"
                    size={isMobile ? 'lg' : 'xl'}
                    className="shadow-xl"
                  >
                    지원서 관리
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size={isMobile ? 'lg' : 'xl'}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    메인으로
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
