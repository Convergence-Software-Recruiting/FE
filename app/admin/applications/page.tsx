'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, FileText, Lock, RefreshCw } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  fetchAdminApplications,
  type AdminApplicationSummary,
} from '@/lib/api/admin';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function formatStatus(status: string): string {
  switch (status) {
    case 'RECEIVED':
      return '접수 완료';
    case 'UNDER_REVIEW':
      return '검토 중';
    case 'ACCEPTED':
      return '합격';
    case 'REJECTED':
      return '불합격';
    default:
      return status;
  }
}

export default function AdminApplicationsPage() {
  const { isMobile, isTablet } = useResponsive();
  const { admin, isLoading: isAuthLoading, error: authError } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<AdminApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAdminApplications();
      setApplications(data);
    } catch (err) {
      console.error('[AdminApplicationsPage] 목록 조회 실패:', err);
      setError('지원서 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const sortedApplications = useMemo(
    () =>
      [...applications].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    [applications],
  );

  if (isAuthLoading) {
    return <LoadingState message="어드민 정보를 불러오는 중..." />;
  }

  if (!admin || authError) {
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
                {authError ? '접근 권한 없음' : '로그인이 필요합니다'}
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
                {authError
                  ? '이 페이지에 접근할 권한이 없습니다.'
                  : '어드민 페이지에 접근하려면 로그인이 필요합니다.'}
                <br />
                <span className="text-gold-300 font-medium">
                  {authError
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

  if (isLoading) {
    return <LoadingState message="지원서 목록을 불러오는 중..." />;
  }

  if (error) {
    return (
      <BackgroundPattern>
        <div className="flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorState
              title="지원서 목록을 불러오는 중 오류가 발생했습니다."
              message={error}
              showRetry={true}
              onRetry={loadApplications}
              retryLabel="다시 시도"
            />
          </div>
        </div>
      </BackgroundPattern>
    );
  }

  return (
    <BackgroundPattern>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
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
                지원서 목록
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
                접수된 지원서를 확인하고 상세 정보를 열람할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-white/80 text-sm sm:text-base">
                  총 {sortedApplications.length}건의 지원서
                </span>
                <p className="text-white/60 text-xs sm:text-sm">
                  최신 제출 순으로 정렬되어 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'lg' : 'default'}
                  onClick={loadApplications}
                  className="shadow-xl px-3 py-2 sm:px-3 sm:py-2"
                  aria-label="목록 새로고침"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? 'sm' : 'default'}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => router.push('/admin/forms')}
                >
                  모집 폼 관리
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? 'sm' : 'default'}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => router.push('/admin')}
                >
                  어드민 홈
                </Button>
              </div>
            </div>

            {sortedApplications.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center text-white/80">
                아직 접수된 지원서가 없습니다.
              </div>
            ) : (
              <>
                {/* 모바일 카드 뷰 */}
                <div className="grid gap-4 sm:hidden">
                  {sortedApplications.map((app) => (
                    <div
                      key={app.applicationId}
                      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {app.name}
                          </p>
                          <p className="text-white/70 text-xs">
                            {app.studentNo} · {app.major} · {app.grade}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                          {formatStatus(app.status)}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs">
                        제출 시각 {formatDate(app.submittedAt)}
                      </p>
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/applications/${app.applicationId}`}
                          className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy-900 hover:bg-white transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          상세 보기
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크톱 테이블 뷰 */}
                <div className="hidden sm:block bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr className="text-left text-xs sm:text-sm text-white/70">
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">이름</th>
                        <th className="px-3 py-2">학번</th>
                        <th className="px-3 py-2">전공</th>
                        <th className="px-3 py-2">학년</th>
                        <th className="px-3 py-2">상태</th>
                        <th className="px-3 py-2">제출 시각</th>
                        <th className="px-3 py-2 text-right">상세</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {sortedApplications.map((app) => (
                        <tr key={app.applicationId} className="text-xs sm:text-sm">
                          <td className="px-3 py-3 text-white/80">
                            {app.applicationId}
                          </td>
                          <td className="px-3 py-3 text-white">{app.name}</td>
                          <td className="px-3 py-3 text-white/80">
                            {app.studentNo}
                          </td>
                          <td className="px-3 py-3 text-white/80">
                            {app.major}
                          </td>
                          <td className="px-3 py-3 text-white/80">{app.grade}</td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                              {formatStatus(app.status)}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-white/70">
                            {formatDate(app.submittedAt)}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Link
                              href={`/admin/applications/${app.applicationId}`}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/20 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              상세 보기
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}

