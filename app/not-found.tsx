"use client";

import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/button";
import { gradientFooter } from "@/lib/colors";
import { Home } from "lucide-react";

export default function NotFound() {
  const { isMobile, isTablet } = useResponsive();

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
          <h1
            className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up ${
              isMobile
                ? "text-6xl sm:text-7xl"
                : isTablet
                ? "text-7xl sm:text-8xl"
                : "text-8xl sm:text-9xl"
            }`}
          >
            404
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
            페이지를 찾을 수 없습니다.
            <br />
            <span className="text-gold-300 font-medium">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </span>
          </p>
          <div className="animate-fade-up [animation-delay:200ms]">
            <Link href="/">
              <Button
                variant="hero"
                size={isMobile ? "lg" : "xl"}
                className="group shadow-2xl"
              >
                <Home className="w-5 h-5 mr-2" />
                메인으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
