'use client';

import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from './button';
import { BackgroundPattern } from './background-pattern';
import { CheckCircle } from 'lucide-react';

interface SuccessStateProps {
  title: string;
  message: string;
  code?: string;
  codeLabel?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 성공 상태 컴포넌트
 */
export function SuccessState({
  title,
  message,
  code,
  codeLabel = '결과 조회 코드',
  primaryAction,
  secondaryAction,
}: SuccessStateProps) {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();

  return (
    <BackgroundPattern>
      <div className="flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle
              className={`text-gold-400 mx-auto mb-6 animate-fade-up ${
                isMobile ? 'w-16 h-16' : 'w-20 h-20'
              }`}
            />
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:100ms] ${
                isMobile
                  ? 'text-3xl sm:text-4xl'
                  : isTablet
                  ? 'text-4xl sm:text-5xl'
                  : 'text-5xl sm:text-6xl'
              }`}
            >
              {title}
            </h1>

            {code && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 mb-8 sm:mb-12 animate-fade-up [animation-delay:200ms]">
                <p className="text-white/70 text-sm sm:text-base mb-2">
                  {codeLabel}
                </p>
                <p className="text-gold-400 font-bold text-2xl sm:text-3xl font-mono">
                  {code}
                </p>
                <p className="text-white/60 text-xs sm:text-sm mt-4">
                  이 코드를 저장해두시면 나중에 지원 결과를 조회하실 수 있습니다.
                </p>
              </div>
            )}

            <p
              className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:${code ? '300' : '200'}ms] ${
                isMobile
                  ? 'text-base sm:text-lg'
                  : isTablet
                  ? 'text-lg sm:text-xl'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {message}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:400ms]">
              {primaryAction && (
                <Button
                  variant="hero"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={primaryAction.onClick}
                  className="shadow-2xl"
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={secondaryAction.onClick}
                  className="shadow-xl"
                >
                  {secondaryAction.label}
                </Button>
              )}
              {!primaryAction && !secondaryAction && (
                <Button
                  variant="hero"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={() => router.push('/')}
                  className="shadow-2xl"
                >
                  메인으로 돌아가기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
