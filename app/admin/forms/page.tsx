'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  createAdminForm,
  deleteAdminForm,
  fetchAdminForms,
  type AdminFormResponse,
} from '@/lib/api/admin';
import {
  ClipboardList,
  FilePlus2,
  Loader2,
  ArrowRight,
  Lock,
  Trash2,
} from 'lucide-react';
import type { AxiosError } from 'axios';

// ============================================================================
// 메인 컴포넌트
// ============================================================================

function getDeleteErrorMessage(err: unknown): string {
  const axiosError = err as AxiosError<{ message?: string }>;
  if (axiosError.response?.status === 404) {
    return '이미 삭제되었거나 존재하지 않는 모집 폼입니다.';
  }
  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    '모집 폼 삭제 중 오류가 발생했습니다.'
  );
}

export default function AdminFormsPage() {
  const { isMobile, isTablet } = useResponsive();
  const { admin, isLoading: isAuthLoading, error: authError } = useAuth();
  const router = useRouter();

  const [forms, setForms] = useState<AdminFormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminFormResponse | null>(null);
  const [isDeletingForm, setIsDeletingForm] = useState(false);

  const loadForms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAdminForms();
      setForms(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '폼 목록을 불러오는 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadForms();
  }, [loadForms]);

  const sortedForms = useMemo(() => {
    return [...forms].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [forms]);

  const handleCreateForm = useCallback(async () => {
    if (!title.trim()) {
      setError('폼 제목을 입력해주세요.');
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const created = await createAdminForm({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      setForms((prev) => [created, ...prev]);
      router.push(`/admin/forms/${created.id}`);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '폼 생성에 실패했습니다.';
      setError(message);
    } finally {
      setIsCreating(false);
    }
  }, [title, description, router]);

  const handleDeleteForm = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeletingForm(true);
    setError(null);
    try {
      await deleteAdminForm(deleteTarget.id);
      setForms((prev) => prev.filter((form) => form.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(getDeleteErrorMessage(err));
    } finally {
      setIsDeletingForm(false);
    }
  }, [deleteTarget]);

  // ============================================================================
  // 렌더링
  // ============================================================================

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

  if (isLoading) {
    return <LoadingState message="모집 폼을 불러오는 중..." />;
  }

  return (
    <BackgroundPattern>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
            {/* 헤더 */}
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
                모집 폼 관리
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
                모집 폼을 생성하고 질문을 구성해보세요.
              </p>
            </div>

            {/* 상단 액션 + 폼 생성 카드 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
                <div className="flex items-center gap-3">
                  <FilePlus2 className="w-6 h-6 text-gold-400" />
                  <h2 className="text-lg sm:text-xl font-bold">새 모집 폼 만들기</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="heroOutline"
                    size={isMobile ? 'sm' : 'default'}
                    className="shadow-xl"
                    onClick={() => router.push('/admin/applications')}
                  >
                    지원서 목록 보기
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

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      제목 <span className="text-gold-400">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 2026 1학기 비대위 모집 폼"
                    className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      설명
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="폼 설명을 입력하세요"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 text-red-100 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    variant="hero"
                    size={isMobile ? 'lg' : 'xl'}
                    className="shadow-2xl"
                    onClick={handleCreateForm}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      '폼 생성하기'
                    )}
                  </Button>
                  <Button
                    variant="heroOutline"
                    size={isMobile ? 'lg' : 'xl'}
                    onClick={loadForms}
                    className="shadow-xl"
                  >
                    목록 새로고침
                  </Button>
                </div>
              </div>
            </div>

            {/* 폼 목록 */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg sm:text-xl">
                  등록된 폼
                </h2>
                <span className="text-white/70 text-sm">
                  총 {sortedForms.length}개
                </span>
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-3 text-red-100 text-sm">
                  {error}
                </div>
              )}

              {sortedForms.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center text-white/80">
                  아직 등록된 폼이 없습니다. 위에서 새 폼을 만들어보세요.
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {sortedForms.map((form) => (
                    <div
                      key={form.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 shadow-xl"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-white font-bold text-lg sm:text-xl">
                            {form.title}
                          </h3>
                          {form.description && (
                            <p className="text-white/80 text-sm sm:text-base">
                              {form.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                            <span
                              className={`px-3 py-1 rounded-full ${
                                form.active
                                  ? 'bg-emerald-400/20 text-emerald-100'
                                  : 'bg-white/10 text-white/70'
                              }`}
                            >
                              {form.active ? '모집 중' : '비활성'}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full ${
                                form.resultOpen
                                  ? 'bg-blue-400/20 text-blue-100'
                                  : 'bg-white/10 text-white/70'
                              }`}
                            >
                              {form.resultOpen ? '결과 공개' : '결과 비공개'}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">
                              생성일 {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href={`/admin/forms/${form.id}`}>
                            <Button variant="hero" size="lg" className="shadow-xl">
                              폼/질문 설정
                            </Button>
                          </Link>
                          <Button
                            variant="heroOutline"
                            size="lg"
                            onClick={() => setDeleteTarget(form)}
                            className="border-red-300 text-red-200 hover:border-red-400 hover:bg-red-500/20 hover:text-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            삭제
                          </Button>
                          <Link href="/admin">
                            <Button variant="heroOutline" size="lg">
                              어드민 홈
                            </Button>
                          </Link>
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
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="모집 폼을 삭제하시겠어요?"
        description={`삭제 시 질문/지원서/지원 답변이 모두 영구 삭제됩니다.${
          deleteTarget ? `\n\n대상: ${deleteTarget.title}` : ''
        }`}
        confirmText="삭제"
        cancelText="취소"
        isLoading={isDeletingForm}
        onConfirm={handleDeleteForm}
        onClose={() => {
          if (!isDeletingForm) setDeleteTarget(null);
        }}
      />
    </BackgroundPattern>
  );
}
