'use client';

import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Search, Lock } from 'lucide-react';

export default function ApplicationResultPage() {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();

  return (
    <BackgroundPattern>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <Lock
              className={`text-white/60 mx-auto mb-4 ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}
            />
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 ${
                isMobile
                  ? 'text-2xl sm:text-3xl'
                  : isTablet
                    ? 'text-3xl sm:text-4xl'
                    : 'text-4xl sm:text-5xl'
              }`}
            >
              지원 결과 조회
            </h1>
            <p
              className={`text-white/80 leading-relaxed ${
                isMobile ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
              }`}
            >
              결과 조회는 일시적으로 비활성화되어 있습니다.
              <br />
              결과는 추후 별도 안내드리겠습니다.
            </p>
          </div>

          <Button
            variant="hero"
            size={isMobile ? 'lg' : 'xl'}
            onClick={() => router.push('/')}
            className="shadow-2xl"
          >
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    </BackgroundPattern>
  );
}
