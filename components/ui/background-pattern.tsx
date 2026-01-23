'use client';

import { useResponsive } from '@/hooks/useResponsive';
import { gradientFooter } from '@/lib/colors';

interface BackgroundPatternProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 공통 배경 패턴 컴포넌트
 * 메인 페이지 스타일의 그라데이션 배경과 패턴을 제공합니다.
 */
export function BackgroundPattern({
  children,
  className = '',
}: BackgroundPatternProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <section
      className={`relative min-h-screen bg-gradient-hero overflow-hidden ${className}`}
    >
      {/* 그라데이션 배경 */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: gradientFooter }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
      </div>

      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute top-20 left-10 bg-gold-500 rounded-full blur-[120px] animate-pulse ${
            isMobile ? 'w-48 h-48' : isTablet ? 'w-64 h-64' : 'w-72 h-72'
          }`}
        />
        <div
          className={`absolute bottom-20 right-10 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s] ${
            isMobile ? 'w-64 h-64' : isTablet ? 'w-80 h-80' : 'w-96 h-96'
          }`}
        />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
