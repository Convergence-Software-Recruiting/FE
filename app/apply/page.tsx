"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { SuccessState } from "@/components/ui/success-state";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  fetchActiveForm,
  submitApplication,
  type ActiveFormResponse,
  type ApplicationSubmitRequest,
  type ApplicationSubmitResponse,
  type FormQuestion,
} from "@/lib/api/application";
import { FileText, User, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

// ============================================================================
// 타입 정의
// ============================================================================

interface PersonalInfo {
  name: string;
  studentNo: string;
  major: string;
  grade: string;
  phone: string;
}

const MAJOR_OPTIONS = [
  { value: "CONVERGENCE_SOFTWARE_UNDERGRAD", label: "융합소프트웨어 학부(학부생)" },
  { value: "APPLIED_SOFTWARE", label: "응용소프트웨어전공" },
  { value: "DATA_SCIENCE", label: "데이터사이언스 전공" },
  { value: "AI", label: "AI 전공" },
] as const;

const MAJOR_TO_API: Record<string, string> = {
  CONVERGENCE_SOFTWARE_UNDERGRAD: "CONVERGENCE_SOFTWARE",
  APPLIED_SOFTWARE: "CONVERGENCE_SOFTWARE",
  DATA_SCIENCE: "CONVERGENCE_SOFTWARE",
  AI: "CONVERGENCE_SOFTWARE",
};

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ApplyPage() {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();

  // 상태 관리
  const [form, setForm] = useState<ActiveFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);

  // 개인정보 필드
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    studentNo: "",
    major: MAJOR_OPTIONS[0].value,
    grade: "",
    phone: "",
  });

  // 질문 답변
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // ============================================================================
  // 데이터 로딩
  // ============================================================================

  const loadForm = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activeForm = await fetchActiveForm();
      setForm(activeForm);
      if (!activeForm) {
        setError("현재 모집 중인 지원서가 없습니다.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "지원서를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setForm(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadForm();
  }, [loadForm]);

  // ============================================================================
  // 폼 핸들러
  // ============================================================================

  const handlePersonalInfoChange = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleAnswerChange = useCallback(
    (questionId: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [],
  );

  const validateForm = useCallback((): string | null => {
    if (!form) return "폼을 불러오는 중입니다.";

    // 필수 필드 검증
    if (
      !personalInfo.name.trim() ||
      !personalInfo.studentNo.trim() ||
      !personalInfo.major ||
      !personalInfo.grade ||
      !personalInfo.phone.trim()
    ) {
      return "필수 정보를 모두 입력해주세요.";
    }

    // 필수 질문 답변 검증
    const requiredQuestions = form.questions.filter((q) => q.required);
    const missingAnswers = requiredQuestions.filter(
      (q) => !answers[q.id] || !answers[q.id].trim(),
    );
    if (missingAnswers.length > 0) {
      return "필수 질문에 모두 답변해주세요.";
    }

    return null;
  }, [form, personalInfo, answers]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form) return;

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const payload: ApplicationSubmitRequest = {
        name: personalInfo.name.trim(),
        studentNo: personalInfo.studentNo.trim(),
        major: MAJOR_TO_API[personalInfo.major] ?? "CONVERGENCE_SOFTWARE",
        grade: personalInfo.grade,
        phone: personalInfo.phone.trim(),
        answers: Object.entries(answers)
          .filter(([_, value]) => value && value.trim())
          .map(([questionId, value]) => ({
            questionId: Number(questionId),
            value: value.trim(),
          })),
      };

      try {
        if (process.env.NODE_ENV === "development") {
          console.log("[apply] submitting payload:", payload);
        }
        const response: ApplicationSubmitResponse =
          await submitApplication(payload);
        setResultCode(response.resultCode);
        setSubmitSuccess(true);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
        const serverMessage = data?.message;
        const errors = data?.errors;
        if (status === 409) {
          setError("이미 지원서를 제출하셨습니다.");
        } else if (status === 400) {
          const detail = serverMessage
            || (errors && Object.values(errors).flat().length > 0
              ? Object.values(errors!).flat().join(" ")
              : null);
          setError(detail || "입력 정보를 확인해주세요.");
          if (process.env.NODE_ENV === "development") {
            console.error("[apply 400] payload:", payload, "response:", data);
          }
        } else {
          setError(
            serverMessage ||
              axiosError.message ||
              "지원서 제출에 실패했습니다.",
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, personalInfo, answers, validateForm],
  );

  // ============================================================================
  // 계산된 값
  // ============================================================================

  const sortedQuestions = useMemo(() => {
    if (!form?.questions) return [];
    return [...form.questions].sort((a, b) => a.orderNo - b.orderNo);
  }, [form?.questions]);

  // ============================================================================
  // 렌더링
  // ============================================================================

  // 로딩 상태
  if (isLoading) {
    return <LoadingState message="지원서를 불러오는 중..." />;
  }

  // 활성 폼 없음 또는 에러
  if (!form && !isLoading) {
    const isError = error?.includes("오류") ?? false;
    return (
      <ErrorState
        title={isError ? "오류가 발생했습니다" : "모집 기간이 아닙니다"}
        message={error || "현재 모집 중인 지원서가 없습니다."}
        showRetry={isError}
        onRetry={loadForm}
        retryLabel="다시 시도"
      />
    );
  }

  if (submitSuccess && resultCode) {
    return (
      <SuccessState
        title="지원서 제출 완료"
        message="지원서가 성공적으로 제출되었습니다. 결과는 추후 안내드리겠습니다."
        code={resultCode}
        primaryAction={{
          label: "메인으로 돌아가기",
          onClick: () => router.push("/"),
        }}
      />
    );
  }

  // 지원서 작성 폼
  if (!form) return null;

  return (
    <BackgroundPattern>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <FileText
              className={`text-white/80 mx-auto mb-4 animate-fade-up ${
                isMobile ? "w-12 h-12" : "w-16 h-16"
              }`}
            />
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:100ms] ${
                isMobile
                  ? "text-3xl sm:text-4xl"
                  : isTablet
                    ? "text-4xl sm:text-5xl"
                    : "text-5xl sm:text-6xl"
              }`}
            >
              {form.title}
            </h1>
            {form.description && (
              <p
                className={`text-white/90 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                  isMobile
                    ? "text-base sm:text-lg"
                    : isTablet
                      ? "text-lg sm:text-xl"
                      : "text-xl"
                }`}
              >
                {form.description}
              </p>
            )}
          </div>

          {/* 폼 */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 sm:space-y-8"
          >
            {/* 개인정보 섹션 */}
            <PersonalInfoSection
              personalInfo={personalInfo}
              onChange={handlePersonalInfoChange}
              isMobile={isMobile}
            />

            {/* 질문 섹션 */}
            {sortedQuestions.length > 0 && (
              <QuestionsSection
                questions={sortedQuestions}
                answers={answers}
                onChange={handleAnswerChange}
                isMobile={isMobile}
              />
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-100 text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Button
                type="submit"
                variant="hero"
                size={isMobile ? "lg" : "xl"}
                disabled={isSubmitting}
                className="shadow-2xl w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    제출 중...
                  </>
                ) : (
                  "지원서 제출하기"
                )}
              </Button>
              <Button
                type="button"
                variant="heroOutline"
                size={isMobile ? "lg" : "xl"}
                onClick={() => router.push("/")}
                className="shadow-xl w-full sm:w-auto"
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BackgroundPattern>
  );
}

// ============================================================================
// 서브 컴포넌트
// ============================================================================

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  isMobile: boolean;
}

function PersonalInfoSection({
  personalInfo,
  onChange,
  isMobile,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center">
        <User className="w-5 h-5 mr-2" />
        개인정보
      </h2>

      <div>
        <label className="block mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            이름 <span className="text-gold-400">*</span>
          </span>
        </label>
        <input
          type="text"
          required
          value={personalInfo.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="이름을 입력하세요"
          className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            학번 <span className="text-gold-400">*</span>
          </span>
        </label>
        <input
          type="text"
          required
          value={personalInfo.studentNo}
          onChange={(e) => onChange("studentNo", e.target.value)}
          placeholder="학번을 입력하세요 (예: 202312345)"
          className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            전공 <span className="text-gold-400">*</span>
          </span>
        </label>
        <select
          required
          value={personalInfo.major}
          onChange={(e) => onChange("major", e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        >
          {MAJOR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            학년 <span className="text-gold-400">*</span>
          </span>
        </label>
        <select
          required
          value={personalInfo.grade}
          onChange={(e) => onChange("grade", e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        >
          <option value="">선택하세요</option>
          <option value="GRADE_1">1학년</option>
          <option value="GRADE_2">2학년</option>
          <option value="GRADE_3">3학년</option>
          <option value="GRADE_4">4학년</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">
          <span className="text-white font-semibold text-sm sm:text-base">
            전화번호 <span className="text-gold-400">*</span>
          </span>
        </label>
        <input
          type="tel"
          required
          value={personalInfo.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
          className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
        />
      </div>
    </div>
  );
}

interface QuestionsSectionProps {
  questions: FormQuestion[];
  answers: Record<number, string>;
  onChange: (questionId: number, value: string) => void;
  isMobile: boolean;
}

function QuestionsSection({
  questions,
  answers,
  onChange,
  isMobile,
}: QuestionsSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6 pt-4 border-t border-white/20">
      <h2 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        지원 질문
      </h2>

      {questions.map((question, index) => (
        <div
          key={question.id}
          className="animate-fade-up"
          style={{ animationDelay: `${(index + 1) * 100}ms` }}
        >
          <label className="block mb-3 sm:mb-4">
            <span className="text-white font-semibold text-base sm:text-lg">
              {question.label}
              {question.required && (
                <span className="text-gold-400 ml-1">*</span>
              )}
            </span>
            {question.description && (
              <p className="text-white/70 text-sm sm:text-base mt-1">
                {question.description}
              </p>
            )}
          </label>

          <textarea
            required={question.required}
            value={answers[question.id] || ""}
            onChange={(e) => onChange(question.id, e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
            rows={4}
            placeholder="답변을 입력해주세요"
          />
        </div>
      ))}
    </div>
  );
}
