'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { LoadingState } from '@/components/ui/loading-state';
import {
  fetchApplicationResult,
  type ApplicationResultResponse,
} from '@/lib/api/application';
import { Search, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import type { AxiosError } from 'axios';

// ============================================================================
// 타입 정의
// ============================================================================

type ApplicationStatus =
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PENDING'
  | '합격'
  | '불합격'
  | '대기중'
  | 'UNKNOWN';

interface StatusConfig {
  icon: React.ReactNode;
  text: string;
  color: string;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

function getStatusConfig(status?: string): StatusConfig {
  const upperStatus = (status?.toUpperCase() ?? 'UNKNOWN') as ApplicationStatus;

  switch (upperStatus) {
    case 'ACCEPTED':
    case '합격':
      return {
        icon: <CheckCircle className="w-12 h-12 text-gold-400" />,
        text: '합격',
        color: 'text-gold-400',
      };
    case 'REJECTED':
    case '불합격':
      return {
        icon: <XCircle className="w-12 h-12 text-red-400" />,
        text: '불합격',
        color: 'text-red-400',
      };
    case 'PENDING':
    case '대기중':
    default:
      return {
        icon: <Clock className="w-12 h-12 text-white/60" />,
        text: '심사 중',
        color: 'text-white/80',
      };
  }
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ApplicationResultPage() {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const [resultCode, setResultCode] = useState('');
  const [result, setResult] = useState<ApplicationResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedCode = resultCode.trim();

      if (!trimmedCode) {
        setError('결과 조회 코드를 입력해주세요.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await fetchApplicationResult({ resultCode: trimmedCode });
        setResult(data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        if (axiosError.response?.status === 404) {
          setError('조회 결과를 찾을 수 없습니다. 코드를 확인해주세요.');
        } else {
          setError(
            axiosError.response?.data?.message ||
              axiosError.message ||
              '지원 결과를 조회하는 중 오류가 발생했습니다.',
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [resultCode],
  );

  const statusConfig = result ? getStatusConfig(result.status) : null;

  return (
    <BackgroundPattern>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <Search
              className={`text-white/80 mx-auto mb-4 animate-fade-up ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
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
              지원 결과 조회
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
              지원서 제출 시 발급받은 결과 조회 코드를 입력해주세요.
            </p>
          </div>

          {/* 조회 폼 */}
          <form
            onSubmit={handleSearch}
            className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl mb-6 sm:mb-8"
          >
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold text-sm sm:text-base mb-2 block">
                  결과 조회 코드 <span className="text-gold-400">*</span>
                </span>
                <input
                  type="text"
                  value={resultCode}
                  onChange={(e) => setResultCode(e.target.value.toUpperCase())}
                  placeholder="결과 조회 코드를 입력하세요 (예: A7K9)"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent font-mono text-center text-lg"
                />
                <p className="text-white/60 text-xs sm:text-sm mt-2">
                  지원서 제출 시 발급받은 결과 조회 코드를 입력해주세요.
                </p>
              </label>

              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-100 text-sm sm:text-base">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="hero"
                size={isMobile ? 'lg' : 'xl'}
                disabled={isLoading}
                className="w-full shadow-2xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    조회 중...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    결과 조회하기
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* 결과 표시 */}
          {result && statusConfig && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl animate-fade-up">
              <div className="text-center mb-6">
                {statusConfig.icon}
                <h2
                  className={`font-bold mt-4 mb-2 ${statusConfig.color} ${
                    isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                  }`}
                >
                  {statusConfig.text}
                </h2>
                {result.applicationId && (
                  <p className="text-white/70 text-sm sm:text-base">
                    지원서 ID: {result.applicationId}
                  </p>
                )}
              </div>

              {result.result && (
                <div className="mt-6 p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {result.result}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={() => router.push('/')}
                  className="shadow-xl"
                >
                  메인으로 돌아가기
                </Button>
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="text-center mt-6 sm:mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white"
            >
              ← 메인으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
