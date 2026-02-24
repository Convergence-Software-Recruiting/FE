"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/constants/colors";
import { ArrowRight, Package } from "lucide-react";

export default function Home() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────────── */}
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
                } animate-pulse`}
              >
                2026학년도 신입부원 모집 중
              </span>
            </div>

            <h1
              className={`font-extrabold text-white mb-4 sm:mb-6 animate-fade-up [animation-delay:200ms] leading-tight ${
                isMobile
                  ? "text-2xl"
                  : isTablet
                    ? "text-3xl sm:text-4xl md:text-5xl"
                    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
              }`}
            >
              융합소프트웨어
              <br />
              <span className="text-gradient-gold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-lg">
                비상대책위원회
              </span>
            </h1>

            <p
              className={`text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up [animation-delay:300ms] font-light ${
                isMobile
                  ? "text-sm px-2"
                  : isTablet
                    ? "text-base sm:text-lg"
                    : "text-lg sm:text-xl"
              }`}
            >
              명지대학교 융합소프트웨어학부의 변화를 이끄는 학생 자치
              기구입니다.
              <br className="hidden sm:block" />
              <span className="text-gold-300 font-medium">
                함께 성장하고, 함께 변화를 만들어갈 새로운 동료를 찾습니다.
              </span>
            </p>

            <div
              className={`flex flex-col items-stretch justify-center gap-3 sm:gap-4 px-4 max-w-md mx-auto animate-fade-up [animation-delay:400ms]`}
            >
              <Link
                href="/about"
                className="inline-block w-full transition-transform duration-200 hover:scale-[1.02]"
              >
                <Button
                  variant="hero"
                  size={isMobile ? "lg" : "xl"}
                  className="group shadow-2xl w-full"
                >
                  비대위 알아보기
                </Button>
              </Link>
              <Link
                href="/locker"
                className="inline-block w-full transition-transform duration-200 hover:scale-[1.02]"
              >
                <Button
                  variant="heroOutline"
                  size={isMobile ? "lg" : "xl"}
                  className="shadow-xl w-full"
                >
                  사물함 대여 서비스
                </Button>
              </Link>
              <Link
                href="/apply"
                className="inline-block w-full transition-transform duration-200 hover:scale-[1.02]"
              >
                <Button
                  variant="heroOutline"
                  size={isMobile ? "lg" : "xl"}
                  className="shadow-xl w-full"
                >
                  지원하기
                </Button>
              </Link>
            </div>
          </div>
        </div>

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

    </>
  );
}
