"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/button";
import { gradientFooter } from "@/lib/colors";
import {
  fetchActiveForm,
  submitApplication,
  type ActiveFormResponse,
  type ApplicationSubmitRequest,
  type ApplicationSubmitResponse,
  type FormQuestion,
} from "@/lib/applicationApi";
import { FileText, CheckCircle, AlertCircle, Loader2, User, Hash, GraduationCap, Award, Phone } from "lucide-react";

export default function ApplyPage() {
  const { isMobile, isTablet } = useResponsive();
  const router = useRouter();
  const [form, setForm] = useState<ActiveFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 개인정보 필드
  const [name, setName] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [major, setMajor] = useState("CONVERGENCE_SOFTWARE");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  
  // 질문 답변
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true);
        const activeForm = await fetchActiveForm();
        setForm(activeForm);
        if (!activeForm) {
          setError("현재 모집 중인 지원서가 없습니다.");
        }
      } catch (err: any) {
        setError(err?.message ?? "지원서를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    void loadForm();
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // 필수 필드 검증
    if (!name.trim() || !studentNo.trim() || !grade || !phone.trim()) {
      setError("필수 정보를 모두 입력해주세요.");
      return;
    }

    // 필수 질문 답변 검증
    const requiredQuestions = form.questions.filter((q) => q.required);
    const missingAnswers = requiredQuestions.filter(
      (q) => !answers[q.id] || !answers[q.id].trim()
    );
    if (missingAnswers.length > 0) {
      setError("필수 질문에 모두 답변해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: ApplicationSubmitRequest = {
        name: name.trim(),
        studentNo: studentNo.trim(),
        major,
        grade,
        phone: phone.trim(),
        answers: Object.entries(answers)
          .filter(([_, value]) => value && value.trim())
          .map(([questionId, value]) => ({
            questionId: Number(questionId),
            value: value.trim(),
          })),
      };

      const response: ApplicationSubmitResponse = await submitApplication(payload);
      setResultCode(response.resultCode);
      setSubmitSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("이미 지원서를 제출하셨습니다.");
      } else if (err.response?.status === 400) {
        setError("입력 정보를 확인해주세요.");
      } else {
        setError(err?.message ?? "지원서 제출에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 질문 정렬 (orderNo 기준)
  const sortedQuestions = form?.questions
    ? [...form.questions].sort((a, b) => a.orderNo - b.orderNo)
    : [];

  // 로딩 상태
  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: gradientFooter }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute top-20 left-10 bg-gold-500 rounded-full blur-[120px] animate-pulse ${
              isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-72 h-72"
            }`}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-white/80 animate-spin mx-auto mb-4" />
            <p className="text-white/90 text-lg">지원서를 불러오는 중...</p>
          </div>
        </div>
      </section>
    );
  }

  // 활성 폼 없음
  if (!form) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: gradientFooter }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute top-20 left-10 bg-gold-500 rounded-full blur-[120px] animate-pulse ${
              isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-72 h-72"
            }`}
          />
          <div
            className={`absolute bottom-20 right-10 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s] ${
              isMobile ? "w-64 h-64" : isTablet ? "w-80 h-80" : "w-96 h-96"
            }`}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle
              className={`text-white/80 mx-auto mb-6 ${
                isMobile ? "w-16 h-16" : "w-20 h-20"
              }`}
            />
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up ${
                isMobile
                  ? "text-3xl sm:text-4xl"
                  : isTablet
                  ? "text-4xl sm:text-5xl"
                  : "text-5xl sm:text-6xl"
              }`}
            >
              모집 기간이 아닙니다
            </h1>
            <p
              className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:100ms] ${
                isMobile
                  ? "text-base sm:text-lg"
                  : isTablet
                  ? "text-lg sm:text-xl"
                  : "text-xl sm:text-2xl"
              }`}
            >
              현재 모집 중인 지원서가 없습니다.
              <br />
              <span className="text-gold-300 font-medium">
                모집 기간을 확인해 주세요.
              </span>
            </p>
            <div className="animate-fade-up [animation-delay:200ms]">
              <Button
                variant="heroOutline"
                size={isMobile ? "lg" : "xl"}
                onClick={() => router.push("/")}
                className="shadow-xl"
              >
                메인으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 제출 성공
  if (submitSuccess && resultCode) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: gradientFooter }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute top-20 left-10 bg-gold-500 rounded-full blur-[120px] animate-pulse ${
              isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-72 h-72"
            }`}
          />
          <div
            className={`absolute bottom-20 right-10 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s] ${
              isMobile ? "w-64 h-64" : isTablet ? "w-80 h-80" : "w-96 h-96"
            }`}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle
              className={`text-gold-400 mx-auto mb-6 animate-fade-up ${
                isMobile ? "w-16 h-16" : "w-20 h-20"
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
              지원서 제출 완료
            </h1>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 mb-8 sm:mb-12 animate-fade-up [animation-delay:200ms]">
              <p className="text-white/70 text-sm sm:text-base mb-2">결과 조회 코드</p>
              <p className="text-gold-400 font-bold text-2xl sm:text-3xl font-mono">
                {resultCode}
              </p>
              <p className="text-white/60 text-xs sm:text-sm mt-4">
                이 코드를 저장해두시면 나중에 지원 결과를 조회하실 수 있습니다.
              </p>
            </div>
            <p
              className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:300ms] ${
                isMobile
                  ? "text-base sm:text-lg"
                  : isTablet
                  ? "text-lg sm:text-xl"
                  : "text-xl sm:text-2xl"
              }`}
            >
              지원서가 성공적으로 제출되었습니다.
              <br />
              <span className="text-gold-300 font-medium">
                결과는 추후 안내드리겠습니다.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:400ms]">
              <Button
                variant="hero"
                size={isMobile ? "lg" : "xl"}
                onClick={() => router.push("/")}
                className="shadow-2xl"
              >
                메인으로 돌아가기
              </Button>
              <Button
                variant="heroOutline"
                size={isMobile ? "lg" : "xl"}
                onClick={() => router.push("/apply/result")}
                className="shadow-xl"
              >
                지원 결과 조회
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 지원서 작성 폼
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: gradientFooter }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
      </div>
      <div className="absolute inset-0 opacity-10">
        <div
          className={`absolute top-20 left-10 bg-gold-500 rounded-full blur-[120px] animate-pulse ${
            isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-72 h-72"
          }`}
        />
        <div
          className={`absolute bottom-20 right-10 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s] ${
            isMobile ? "w-64 h-64" : isTablet ? "w-80 h-80" : "w-96 h-96"
          }`}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-20">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
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
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                >
                  <option value="CONVERGENCE_SOFTWARE">융합소프트웨어</option>
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
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* 질문 섹션 */}
            {sortedQuestions.length > 0 && (
              <div className="space-y-4 sm:space-y-6 pt-4 border-t border-white/20">
                <h2 className="text-white font-bold text-lg sm:text-xl mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  지원 질문
                </h2>

                {sortedQuestions.map((question: FormQuestion, index: number) => (
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
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="답변을 입력해주세요"
                    />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 text-red-100 text-sm sm:text-base">
                {error}
              </div>
            )}

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
    </section>
  );
}
