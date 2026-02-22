'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  fetchAdminApplicationDetail,
  fetchAdminFormDetail,
  updateAdminApplicationMemo,
  updateAdminApplicationStatus,
  type AdminApplicationDetail,
} from '@/lib/api/admin';

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'RECEIVED', label: '접수 완료' },
  { value: 'UNDER_REVIEW', label: '검토 중' },
  { value: 'PASS', label: '합격' },
  { value: 'FAIL', label: '불합격' },
];

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'RECEIVED':
      return 'bg-sky-400/20 text-sky-100';
    case 'UNDER_REVIEW':
      return 'bg-amber-400/20 text-amber-100';
    case 'PASS':
      return 'bg-emerald-400/20 text-emerald-100';
    case 'FAIL':
      return 'bg-rose-500/20 text-rose-100';
    default:
      return 'bg-white/10 text-white/80';
  }
}

function formatMajor(major: string): string {
  switch (major) {
    case 'CONVERGENCE_SOFTWARE':
      return '융합소프트웨어학부';
    case 'APPLIED_SOFTWARE':
      return '응용소프트웨어전공';
    case 'DATA_SCIENCE':
      return '데이터사이언스전공';
    case 'ARTIFICIAL_INTELLIGENCE':
      return 'AI 전공';
    default:
      return major;
  }
}

function formatGrade(grade: string): string {
  switch (grade) {
    case 'GRADE_1':
      return '1학년';
    case 'GRADE_2':
      return '2학년';
    case 'GRADE_3':
      return '3학년';
    case 'GRADE_4':
      return '4학년';
    default:
      return grade;
  }
}

function formatDepartment(department: string): string {
  switch (department) {
    case 'PLANNING':
      return '기획국';
    case 'EXTERNAL_COOPERATION':
      return '대외협력국';
    case 'WELFARE':
      return '복지국';
    case 'SECRETARIAT':
      return '사무국';
    case 'PUBLIC_RELATIONS':
      return '홍보국';
    default:
      return department;
  }
}

function formatGender(gender: string): string {
  switch (gender) {
    case 'MALE':
      return '남성';
    case 'FEMALE':
      return '여성';
    default:
      return gender;
  }
}

export default function AdminApplicationDetailPage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const { admin, isLoading: isAuthLoading, error: authError } = useAuth();

  const [application, setApplication] = useState<AdminApplicationDetail | null>(
    null,
  );
  const [questionLabels, setQuestionLabels] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [adminMemo, setAdminMemo] = useState('');
  const [isSavingMemo, setIsSavingMemo] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(applicationId)) {
      setError('유효하지 않은 지원서 ID입니다.');
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setQuestionLabels({});
        const data = await fetchAdminApplicationDetail(applicationId);
        let labels: Record<number, string> = {};
        try {
          const formDetail = await fetchAdminFormDetail(data.formId);
          labels = formDetail.questions.reduce<Record<number, string>>(
            (acc, question) => {
              acc[question.id] = question.label;
              return acc;
            },
            {},
          );
        } catch (labelError) {
          console.error('[AdminApplicationDetailPage] 질문 라벨 조회 실패:', labelError);
        }
        setQuestionLabels(labels);
        setApplication(data);
        setStatus(data.status);
        setAdminMemo(data.adminMemo ?? '');
      } catch (err) {
        console.error('[AdminApplicationDetailPage] 상세 조회 실패:', err);
        setError('지원서 상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [applicationId]);

  const selectedStatusLabel = useMemo(
    () => STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status,
    [status],
  );

  const handleChangeStatus = async (nextStatus: string) => {
    if (!application) return;
    if (nextStatus === status) return;

    setIsUpdatingStatus(true);
    setError(null);
    const statusLabel = STATUS_OPTIONS.find((s) => s.value === nextStatus)?.label ?? nextStatus;
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AdminApplicationDetailPage] 상태 변경 요청:', {
          applicationId: application.applicationId,
          status: nextStatus,
        });
      }
      await updateAdminApplicationStatus(application.applicationId, nextStatus);
      setStatus(nextStatus);
      setApplication({ ...application, status: nextStatus });
      toast.success('상태가 변경되었습니다', {
        description: `지원서 상태가 "${statusLabel}"로 변경되었습니다.`,
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    } catch (err: unknown) {
      console.error('[AdminApplicationDetailPage] 상태 변경 실패:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        '지원서 상태를 변경하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error('상태 변경 실패', {
        description: errorMessage,
        icon: <XCircle className="w-5 h-5" />,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveMemo = async () => {
    if (!application) return;

    setIsSavingMemo(true);
    setError(null);
    try {
      await updateAdminApplicationMemo(application.applicationId, adminMemo);
      setApplication({ ...application, adminMemo });
      toast.success('메모가 저장되었습니다', {
        description: '지원서 메모가 성공적으로 저장되었습니다.',
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    } catch (err: unknown) {
      console.error('[AdminApplicationDetailPage] 메모 저장 실패:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        axiosError.response?.data?.message ||
        '지원서 메모를 저장하는 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error('메모 저장 실패', {
        description: errorMessage,
        icon: <XCircle className="w-5 h-5" />,
      });
    } finally {
      setIsSavingMemo(false);
    }
  };

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
    return <LoadingState message="지원서 상세 정보를 불러오는 중..." />;
  }

  if (error || !application) {
    return (
      <BackgroundPattern>
        <div className="flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorState
              title="지원서 상세 정보를 불러오는 중 오류가 발생했습니다."
              message={error ?? '지원서를 찾을 수 없습니다.'}
              showRetry={true}
              onRetry={() => router.push('/admin/applications')}
              retryLabel="목록으로 돌아가기"
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
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText
                  className={`text-white/80 animate-fade-up ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}
                />
                <div className="space-y-2">
                  <h1
                    className={`font-extrabold text-white animate-fade-up [animation-delay:100ms] ${
                      isMobile
                        ? 'text-2xl sm:text-3xl'
                        : isTablet
                        ? 'text-3xl sm:text-4xl'
                        : 'text-4xl sm:text-5xl'
                    }`}
                  >
                    지원서 상세
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mt-1">
                    제출 시각 {formatDateTime(application.submittedAt)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${getStatusBadgeClass(
                        status,
                      )}`}
                    >
                      현재 상태: {selectedStatusLabel}
                    </span>
                    <span className="text-white/60 text-xs sm:text-xs">
                      아래에서 상태를 변경하면 바로 저장됩니다.
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'xl' : 'lg'}
                  onClick={() => router.push('/admin/applications')}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  목록으로
                </Button>
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'xl' : 'lg'}
                  onClick={() => router.push('/admin')}
                >
                  어드민 홈
                </Button>
              </div>
            </div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
                <h2 className="text-white font-bold text-lg sm:text-xl mb-2">
                  기본 정보
                </h2>
                <dl className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">이름</dt>
                    <dd className="text-white font-medium">{application.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">학번</dt>
                    <dd className="text-white/90">{application.studentNo}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">전공</dt>
                    <dd className="text-white/90">{formatMajor(application.major)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">학년</dt>
                    <dd className="text-white/90">{formatGrade(application.grade)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">전화번호</dt>
                    <dd className="text-white/90">{application.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">생년월일</dt>
                    <dd className="text-white/90">{application.birthDate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">성별</dt>
                    <dd className="text-white/90">
                      {formatGender(application.gender)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">결과코드</dt>
                    <dd className="text-white/90 font-mono">
                      {application.resultCode}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">1지망</dt>
                    <dd className="text-white/90">
                      {formatDepartment(application.firstChoice)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">2지망</dt>
                    <dd className="text-white/90">
                      {formatDepartment(application.secondChoice)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70 w-24">3지망</dt>
                    <dd className="text-white/90">
                      {formatDepartment(application.thirdChoice)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 items-start sm:items-center">
                    <dt className="text-white/70 w-24">상태</dt>
                    <dd className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${getStatusBadgeClass(
                            status,
                          )}`}
                        >
                          {selectedStatusLabel}
                        </span>
                        {isUpdatingStatus && (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <select
                          value={status}
                          onChange={(e) =>
                            void handleChangeStatus(e.target.value)
                          }
                          disabled={isUpdatingStatus}
                          className="rounded-full bg-white/90 text-navy-900 text-xs sm:text-sm px-3 py-1 border border-white/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-white/60 text-[11px] sm:text-xs">
                          선택 즉시 서버에 저장됩니다.
                        </p>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
                <h2 className="text-white font-bold text-lg sm:text-xl mb-2">
                  관리자 메모
                </h2>
                <p className="text-white/70 text-xs sm:text-sm mb-2">
                  이 지원서에 대한 내부 메모를 남길 수 있습니다. 지원자에게는
                  공개되지 않습니다.
                </p>
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-2xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder="예: 1차 면접 대상, 추가 질문 필요 등"
                />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    {error && (
                      <div className="text-red-200 text-xs sm:text-sm">
                        {error}
                      </div>
                    )}
                    <p className="text-white/50 text-[11px] sm:text-xs">
                      현재 글자 수: {adminMemo.length.toLocaleString()}자
                    </p>
                  </div>
                  <div className="flex justify-end">
                  <Button
                    variant="hero"
                    size={isMobile ? 'xl' : 'lg'}
                    onClick={handleSaveMemo}
                    disabled={isSavingMemo}
                    className="shadow-xl"
                  >
                    {isSavingMemo ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      '메모 저장'
                    )}
                  </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
              <h2 className="text-white font-bold text-lg sm:text-xl">
                문항별 답변
              </h2>
              {application.answers.length === 0 ? (
                <p className="text-white/80 text-sm">
                  등록된 답변이 없습니다. (백엔드 응답을 확인해 주세요.)
                </p>
              ) : (
                <div className="space-y-4">
                  {application.answers.map((answer) => (
                    <div
                      key={answer.questionId}
                      className="bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-5"
                    >
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-white/60 text-[11px] sm:text-xs font-medium tracking-wide">
                            질문
                          </p>
                          <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                            {questionLabels[answer.questionId]
                              ? questionLabels[answer.questionId]
                              : `질문 ID ${answer.questionId}`}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/10 border border-white/20 p-3 sm:p-4">
                          <p className="text-white/60 text-[11px] sm:text-xs font-medium tracking-wide">
                            답변
                          </p>
                          <p className="mt-1 text-white text-sm sm:text-base whitespace-pre-line leading-relaxed">
                            {answer.value?.trim() ? answer.value : '미입력'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
