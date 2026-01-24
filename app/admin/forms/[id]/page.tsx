'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/contexts/AuthContext';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import {
  activateAdminForm,
  createAdminFormQuestion,
  deactivateAdminForms,
  deleteAdminQuestion,
  fetchAdminFormDetail,
  openAdminFormResult,
  updateAdminQuestion,
  type AdminFormDetailResponse,
  type AdminQuestionCreateRequest,
  type AdminQuestionResponse,
} from '@/lib/api/admin';
import {
  ArrowRight,
  ClipboardList,
  Edit3,
  Loader2,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react';
import type { AxiosError } from 'axios';

// ============================================================================
// 메인 컴포넌트
// ============================================================================

interface QuestionDraft {
  label: string;
  description: string;
  required: boolean;
}

export default function AdminFormDetailPage() {
  const { isMobile, isTablet } = useResponsive();
  const { admin, isLoading: isAuthLoading, error: authError } = useAuth();
  const router = useRouter();
  const params = useParams();
  const formId = Number(params?.id);

  const [form, setForm] = useState<AdminFormDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState<QuestionDraft>({
    label: '',
    description: '',
    required: true,
  });
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<QuestionDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormUpdating, setIsFormUpdating] = useState(false);
  const [isResultUpdating, setIsResultUpdating] = useState(false);

  const loadForm = useCallback(async () => {
    if (!Number.isFinite(formId)) {
      setLoadError('잘못된 폼 ID입니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await fetchAdminFormDetail(formId);
      setForm(data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '폼 상세 정보를 불러오는 중 오류가 발생했습니다.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    void loadForm();
  }, [loadForm]);

  const sortedQuestions = useMemo(() => {
    if (!form?.questions) return [];
    return [...form.questions].sort((a, b) => a.orderNo - b.orderNo);
  }, [form?.questions]);

  const handleCreateQuestion = useCallback(async () => {
    if (!form) return;
    if (!newQuestion.label.trim()) {
      setActionError('질문 내용을 입력해주세요.');
      return;
    }

    setIsCreating(true);
    setActionError(null);
    try {
      const payload: AdminQuestionCreateRequest = {
        label: newQuestion.label.trim(),
        description: newQuestion.description.trim(),
        required: newQuestion.required,
      };
      const created = await createAdminFormQuestion(form.id, payload);
      setForm((prev) =>
        prev
          ? {
              ...prev,
              questions: [...prev.questions, created],
            }
          : prev,
      );
      setNewQuestion({ label: '', description: '', required: true });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '질문 생성에 실패했습니다.';
      setActionError(message);
    } finally {
      setIsCreating(false);
    }
  }, [form, newQuestion]);

  const startEdit = useCallback((question: AdminQuestionResponse) => {
    setEditingId(question.id);
    setEditDraft({
      label: question.label,
      description: question.description ?? '',
      required: question.required,
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditDraft(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!form || editingId === null || !editDraft) return;
    if (!editDraft.label.trim()) {
      setActionError('질문 내용을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    setActionError(null);
    try {
      const updated = await updateAdminQuestion(editingId, {
        label: editDraft.label.trim(),
        description: editDraft.description.trim(),
        required: editDraft.required,
      });

      setForm((prev) =>
        prev
          ? {
              ...prev,
              questions: prev.questions.map((question) =>
                question.id === updated.id ? updated : question,
              ),
            }
          : prev,
      );
      cancelEdit();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '질문 수정에 실패했습니다.';
      setActionError(message);
    } finally {
      setIsSaving(false);
    }
  }, [form, editingId, editDraft, cancelEdit]);

  const handleDelete = useCallback(
    async (questionId: number) => {
      if (!form) return;
      const confirmed = window.confirm('이 질문을 삭제하시겠어요?');
      if (!confirmed) return;

      setActionError(null);
      try {
        await deleteAdminQuestion(questionId);
        setForm((prev) =>
          prev
            ? {
                ...prev,
                questions: prev.questions.filter((q) => q.id !== questionId),
              }
            : prev,
        );
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          '질문 삭제에 실패했습니다.';
        setActionError(message);
      }
    },
    [form],
  );

  const handleActivateForm = useCallback(async () => {
    if (!form) return;
    const confirmed = window.confirm(
      '이 폼을 현재 모집 폼으로 설정하시겠어요? 다른 폼은 자동으로 비활성화됩니다.',
    );
    if (!confirmed) return;

    setIsFormUpdating(true);
    setActionError(null);
    try {
      await activateAdminForm(form.id);
      await loadForm();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '폼 활성화에 실패했습니다.';
      setActionError(message);
    } finally {
      setIsFormUpdating(false);
    }
  }, [form, loadForm]);

  const handleDeactivateForms = useCallback(async () => {
    const confirmed = window.confirm(
      '모집을 종료하시겠어요? 모든 폼이 비활성화됩니다.',
    );
    if (!confirmed) return;

    setIsFormUpdating(true);
    setActionError(null);
    try {
      await deactivateAdminForms();
      await loadForm();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '모집 종료에 실패했습니다.';
      setActionError(message);
    } finally {
      setIsFormUpdating(false);
    }
  }, [loadForm]);

  const handleOpenResult = useCallback(async () => {
    if (!form) return;
    const confirmed = window.confirm(
      '결과를 공개하시겠어요? 공개 후에는 되돌릴 수 없을 수 있습니다.',
    );
    if (!confirmed) return;

    setIsResultUpdating(true);
    setActionError(null);
    try {
      await openAdminFormResult(form.id);
      await loadForm();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        '결과 공개에 실패했습니다.';
      setActionError(message);
    } finally {
      setIsResultUpdating(false);
    }
  }, [form, loadForm]);

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
    return <LoadingState message="폼 상세 정보를 불러오는 중..." />;
  }

  if (!form || loadError) {
    return (
      <ErrorState
        title="폼 상세 정보를 불러올 수 없습니다"
        message={loadError || '폼 정보를 찾을 수 없습니다.'}
        showRetry
        onRetry={loadForm}
        retryLabel="다시 시도"
      />
    );
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
                {form.title}
              </h1>
              {form.description && (
                <p
                  className={`text-white/90 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                    isMobile
                      ? 'text-base sm:text-lg'
                      : isTablet
                      ? 'text-lg sm:text-xl'
                      : 'text-xl'
                  }`}
                >
                  {form.description}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs sm:text-sm">
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

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  variant="hero"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={handleActivateForm}
                  disabled={isFormUpdating || form.active}
                  className="shadow-2xl"
                >
                  {form.active ? '현재 모집 중' : '모집 폼 활성화'}
                </Button>
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={handleDeactivateForms}
                  disabled={isFormUpdating}
                  className="shadow-xl"
                >
                  모집 종료
                </Button>
                <Button
                  variant="heroOutline"
                  size={isMobile ? 'lg' : 'xl'}
                  onClick={handleOpenResult}
                  disabled={isResultUpdating || form.resultOpen}
                  className="shadow-xl"
                >
                  {form.resultOpen ? '결과 공개됨' : '결과 공개'}
                </Button>
              </div>
            </div>

            {actionError && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-100 text-sm sm:text-base">
                {actionError}
              </div>
            )}

            {/* 질문 추가 카드 */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center gap-3 text-white">
                <Plus className="w-6 h-6 text-gold-400" />
                <h2 className="text-lg sm:text-xl font-bold">새 질문 추가</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      질문 <span className="text-gold-400">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newQuestion.label}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="예: 지원동기를 작성해주세요"
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
                    value={newQuestion.description}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="예: 500자 이내"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="required"
                    type="checkbox"
                    checked={newQuestion.required}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        required: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-gold-500 bg-white/90 border-white/30 rounded focus:ring-gold-400"
                  />
                  <label htmlFor="required" className="text-white text-sm">
                    필수 질문
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    variant="hero"
                    size={isMobile ? 'lg' : 'xl'}
                    className="shadow-2xl"
                    onClick={handleCreateQuestion}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        추가 중...
                      </>
                    ) : (
                      '질문 추가하기'
                    )}
                  </Button>
                  <Button
                    variant="heroOutline"
                    size={isMobile ? 'lg' : 'xl'}
                    onClick={loadForm}
                    className="shadow-xl"
                  >
                    폼 새로고침
                  </Button>
                </div>
              </div>
            </div>

            {/* 질문 목록 */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg sm:text-xl">
                  질문 목록
                </h2>
                <span className="text-white/70 text-sm">
                  총 {sortedQuestions.length}개
                </span>
              </div>

              {sortedQuestions.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center text-white/80">
                  아직 등록된 질문이 없습니다. 위에서 질문을 추가해보세요.
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {sortedQuestions.map((question) => {
                    const isEditing = editingId === question.id;
                    return (
                      <div
                        key={question.id}
                        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 shadow-xl"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="px-3 py-1 rounded-full bg-white/10 text-white/70">
                                순서 {question.orderNo}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full ${
                                  question.required
                                    ? 'bg-gold-400/20 text-gold-100'
                                    : 'bg-white/10 text-white/70'
                                }`}
                              >
                                {question.required ? '필수' : '선택'}
                              </span>
                            </div>

                            {isEditing && editDraft ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={editDraft.label}
                                  onChange={(e) =>
                                    setEditDraft((prev) =>
                                      prev
                                        ? { ...prev, label: e.target.value }
                                        : prev,
                                    )
                                  }
                                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                                />
                                <textarea
                                  value={editDraft.description}
                                  onChange={(e) =>
                                    setEditDraft((prev) =>
                                      prev
                                        ? { ...prev, description: e.target.value }
                                        : prev,
                                    )
                                  }
                                  rows={2}
                                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                                />
                                <label className="flex items-center gap-3 text-white text-sm">
                                  <input
                                    type="checkbox"
                                    checked={editDraft.required}
                                    onChange={(e) =>
                                      setEditDraft((prev) =>
                                        prev
                                          ? { ...prev, required: e.target.checked }
                                          : prev,
                                      )
                                    }
                                    className="w-4 h-4 text-gold-500 bg-white/90 border-white/30 rounded focus:ring-gold-400"
                                  />
                                  필수 질문
                                </label>
                              </div>
                            ) : (
                              <>
                                <h3 className="text-white font-semibold text-base sm:text-lg">
                                  {question.label}
                                </h3>
                                {question.description && (
                                  <p className="text-white/80 text-sm sm:text-base">
                                    {question.description}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="hero"
                                  size="lg"
                                  onClick={handleSaveEdit}
                                  disabled={isSaving}
                                >
                                  {isSaving ? (
                                    <>
                                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                      저장 중...
                                    </>
                                  ) : (
                                    '저장'
                                  )}
                                </Button>
                                <Button
                                  variant="heroOutline"
                                  size="lg"
                                  onClick={cancelEdit}
                                >
                                  취소
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="hero"
                                  size="lg"
                                  onClick={() => startEdit(question)}
                                  className="shadow-xl"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  수정
                                </Button>
                                <Button
                                  variant="heroOutline"
                                  size="lg"
                                  onClick={() => handleDelete(question.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  삭제
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 하단 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="heroOutline"
                size={isMobile ? 'lg' : 'xl'}
                onClick={() => router.push('/admin/forms')}
                className="shadow-xl"
              >
                폼 목록으로
              </Button>
              <Link href="/admin">
                <Button variant="hero" size={isMobile ? 'lg' : 'xl'}>
                  어드민 홈
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
