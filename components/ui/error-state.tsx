'use client';

import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from './button';
import { BackgroundPattern } from './background-pattern';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * 에러 상태 컴포넌트
 */
export function ErrorState({
  title = '오류가 발생했습니다',
  message,
  showRetry = false,
  onRetry,
  retryLabel = '다시 시도',
}: ErrorStateProps) {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();

  return (
    <BackgroundPattern>
      <div className="flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle
              className={`text-white/80 mx-auto mb-6 ${
                isMobile ? 'w-16 h-16' : 'w-20 h-20'
              }`}
            />
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up ${
                isMobile
                  ? 'text-3xl sm:text-4xl'
                  : isTablet
                  ? 'text-4xl sm:text-5xl'
                  : 'text-5xl sm:text-6xl'
              }`}
            >
              {title}
            </h1>
            <p
              className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:100ms] ${
                isMobile
                  ? 'text-base sm:text-lg'
                  : isTablet
                  ? 'text-lg sm:text-xl'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {message}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:200ms]">
              <Button
                variant="heroOutline"
                size={isMobile ? 'lg' : 'xl'}
                onClick={() => router.push('/')}
                className="shadow-xl"
              >
                메인으로 돌아가기
              </Button>
              {showRetry && onRetry && (
                <Button
                  variant="hero"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={onRetry}
                  className="shadow-xl"
                >
                  {retryLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
