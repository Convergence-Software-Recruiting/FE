"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/constants/colors";
import { ArrowRight, ChevronRight, Shield } from "lucide-react";

export default function Home() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Footer 스타일 그라데이션 배경 추가 */}
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
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold-400 rounded-full blur-[200px] opacity-20 ${
              isMobile
                ? "w-[300px] h-[300px]"
                : isTablet
                  ? "w-[400px] h-[400px]"
                  : "w-[600px] h-[600px]"
            }`}
          />
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className={`absolute bg-gold-500 rounded-full ${
                isMobile
                  ? "top-10 left-10 w-1.5 h-1.5"
                  : "top-20 left-20 w-2 h-2"
              }`}
            />
            <div
              className={`absolute bg-gold-400 rounded-full ${
                isMobile ? "top-20 left-20 w-2 h-2" : "top-40 left-40 w-3 h-3"
              }`}
            />
            <div
              className={`absolute bg-gold-500 rounded-full ${
                isMobile
                  ? "bottom-16 right-16 w-1.5 h-1.5"
                  : "bottom-32 right-32 w-2 h-2"
              }`}
            />
            <div
              className={`absolute bg-gold-400 rounded-full ${
                isMobile
                  ? "bottom-26 right-26 w-2 h-2"
                  : "bottom-52 right-52 w-3 h-3"
              }`}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 sm:mb-8 animate-fade-up [animation-delay:100ms] shadow-lg ${
                isMobile ? "px-3 py-1.5" : "px-5 py-2.5"
              }`}
            >
              <span
                className={`bg-gold-500 rounded-full animate-pulse ${
                  isMobile ? "w-2 h-2" : "w-2.5 h-2.5"
                }`}
              />
              <span
                className={`text-white font-semibold ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                2026학년도 신입부원 모집 중
              </span>
            </div>

            {/* Main Title */}
            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:200ms] leading-tight ${
                isMobile
                  ? "text-3xl"
                  : isTablet
                    ? "text-4xl sm:text-5xl md:text-6xl"
                    : "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
              }`}
            >
              융합소프트웨어
              <br />
              <span className="text-gradient-gold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-lg">
                비상대책위원회
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up [animation-delay:300ms] font-light ${
                isMobile
                  ? "text-base px-2"
                  : isTablet
                    ? "text-lg sm:text-xl"
                    : "text-xl sm:text-2xl"
              }`}
            >
              명지대학교 융합소프트웨어학부의 변화를 이끄는 학생 자치
              기구입니다.
              <br className="hidden sm:block" />
              <span className="text-gold-300 font-medium">
                함께 성장하고, 함께 변화를 만들어갈 새로운 동료를 찾습니다.
              </span>
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:400ms] ${
                isMobile ? "flex-col w-full px-4" : "flex-col sm:flex-row"
              }`}
            >
              <Link href="/apply" className={isMobile ? "w-full" : ""}>
                <Button
                  variant="hero"
                  size={isMobile ? "lg" : "xl"}
                  className={`group shadow-2xl ${isMobile ? "w-full" : ""}`}
                >
                  지원하기
                  <ArrowRight
                    className={`transition-transform group-hover:translate-x-1 ${
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    }`}
                  />
                </Button>
              </Link>
              <Link href="/about" className={isMobile ? "w-full" : ""}>
                <Button
                  variant="heroOutline"
                  size={isMobile ? "lg" : "xl"}
                  className={`shadow-xl ${isMobile ? "w-full" : ""}`}
                >
                  비대위 알아보기
                </Button>
              </Link>
              <Link href="/admin" className={isMobile ? "w-full" : ""}>
                <Button
                  variant="ghost"
                  size={isMobile ? "lg" : "xl"}
                  className={`text-white/80 hover:text-white hover:bg-white/10 ${
                    isMobile ? "w-full" : ""
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  관리자 기능
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {!isMobile && (
          <button
            onClick={() => {
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform duration-200 z-20 group"
            aria-label="페이지 하단으로 스크롤"
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2 backdrop-blur-sm group-hover:border-white/60 transition-colors">
              <div className="w-1.5 h-3 bg-gold-500 rounded-full group-hover:bg-gold-400 transition-colors" />
            </div>
          </button>
        )}
      </section>

      {/* CTA Section */}
      <section
        className={`bg-gradient-navy relative overflow-hidden ${
          isMobile ? "py-12" : isTablet ? "py-16" : "py-20"
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className={`absolute top-0 right-0 bg-gold-500 rounded-full blur-[150px] ${
              isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-96 h-96"
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 bg-gold-400 rounded-full blur-[150px] ${
              isMobile ? "w-48 h-48" : isTablet ? "w-64 h-64" : "w-96 h-96"
            }`}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`font-bold text-white mb-4 sm:mb-6 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
              }`}
            >
              지금 바로 지원하세요
            </h2>
            <p
              className={`text-white/90 mb-8 sm:mb-10 leading-relaxed ${
                isMobile ? "text-base sm:text-lg px-2" : "text-xl"
              }`}
            >
              새로운 도전을 시작할 준비가 되셨나요?
              <br className="hidden sm:block" />
              비대위와 함께 의미 있는 대학 생활을 만들어가세요.
            </p>
            <Link href="/apply" className={isMobile ? "block w-full px-4" : ""}>
              <Button
                variant="hero"
                size={isMobile ? "lg" : "xl"}
                className={`group shadow-2xl ${isMobile ? "w-full" : ""}`}
              >
                지원서 작성하기
                <ChevronRight
                  className={`transition-transform group-hover:translate-x-1 ${
                    isMobile ? "w-4 h-4" : "w-5 h-5"
                  }`}
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
