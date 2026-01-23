'use client';

import { Loader2 } from 'lucide-react';
import { BackgroundPattern } from './background-pattern';

interface LoadingStateProps {
  message?: string;
}

/**
 * 로딩 상태 컴포넌트
 */
export function LoadingState({ message = '로딩 중...' }: LoadingStateProps) {
  return (
    <BackgroundPattern>
      <div className="flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-white/80 animate-spin mx-auto mb-4" />
            <p className="text-white/90 text-lg">{message}</p>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
