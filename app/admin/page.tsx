"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gradientFooter } from "@/lib/colors";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminPage() {
  const { isMobile, isTablet } = useResponsive();
  const { admin, isLoading, error, refreshAdmin } = useAuth();

  // 로그인 안 된 상태 또는 에러 상태
  if (!isLoading && (!admin || error)) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Footer 스타일 그라데이션 배경 */}
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: gradientFooter }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
        </div>

        {/* Background Pattern */}
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className={`mb-6 sm:mb-8 animate-fade-up ${
                isMobile ? "w-16 h-16" : "w-20 h-20"
              }`}
            >
              <Lock className="w-full h-full text-white/80 mx-auto" />
            </div>
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:100ms] ${
                isMobile
                  ? "text-3xl sm:text-4xl"
                  : isTablet
                  ? "text-4xl sm:text-5xl"
                  : "text-5xl sm:text-6xl"
              }`}
            >
              {error ? "접근 권한 없음" : "로그인이 필요합니다"}
            </h1>
            <p
              className={`text-white/90 mb-8 sm:mb-12 leading-relaxed animate-fade-up [animation-delay:200ms] ${
                isMobile
                  ? "text-base sm:text-lg"
                  : isTablet
                  ? "text-lg sm:text-xl"
                  : "text-xl sm:text-2xl"
              }`}
            >
              {error
                ? "이 페이지에 접근할 권한이 없습니다."
                : "어드민 페이지에 접근하려면 로그인이 필요합니다."}
              <br />
              <span className="text-gold-300 font-medium">
                {error
                  ? "올바른 계정으로 로그인해 주세요."
                  : "로그인 페이지로 이동하여 인증해 주세요."}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:300ms]">
              <Link href="/admin/login">
                <Button
                  variant="hero"
                  size={isMobile ? "lg" : "xl"}
                  className="group shadow-2xl"
                >
                  로그인하기
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="heroOutline"
                  size={isMobile ? "lg" : "xl"}
                  className="shadow-xl"
                >
                  메인으로
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-background via-white to-navy-50/50 ${
        isMobile ? "py-12" : "py-20"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`font-bold text-navy-900 mb-6 sm:mb-8 ${
              isMobile ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
            }`}
          >
            Admin Page
          </h1>
          {/* 상태 설명 */}
          <div
            className={`text-navy-700 leading-relaxed space-y-4 ${
              isMobile ? "text-sm sm:text-base" : "text-base sm:text-lg"
            }`}
          >
            {/* 1) 로딩 상태 */}
            {isLoading && (
              <p className="text-navy-600">
                현재 어드민 정보를 불러오는 중입니다...
              </p>
            )}

            {/* 4) 로그인된 상태 - 어드민 정보 표시 */}
            {admin && (
              <div className="space-y-3">
                <p className="font-semibold">
                  현재 로그인된 어드민 정보:
                </p>
                <div className="rounded-xl bg-white/60 border border-navy-100 p-4 text-sm sm:text-base">
                  <p>
                    <span className="font-medium">ID:</span> {admin.id}
                  </p>
                  <p>
                    <span className="font-medium">사용자명:</span> {admin.username}
                  </p>
                  {admin.role && (
                    <p>
                      <span className="font-medium">권한:</span> {admin.role}
                    </p>
                  )}
                </div>

                {/* raw 데이터도 개발용으로 참고할 수 있도록 JSON 출력 */}
                <details className="mt-2 cursor-pointer">
                  <summary className="text-sm text-navy-500 hover:text-navy-700">
                    raw 응답(JSON) 보기
                  </summary>
                  <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 text-xs p-3 overflow-auto">
                    {JSON.stringify(admin.raw, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
