"use client";

import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/colors";

export default function Footer() {
  const { isMobile, isTablet } = useResponsive();

  // 네비게이션 링크
  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "APPLY", href: "/apply" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* 그라데이션 배경 */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: gradientFooter }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
      </div>

      {/* 디자인 패턴 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 대각선 그리드 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255, 255, 255, 0.1) 20px,
                rgba(255, 255, 255, 0.1) 40px
              )`,
            }}
          />
        </div>

        {/* 원형 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/20" />
          <div className="absolute top-20 right-20 w-24 h-24 rounded-full border border-white/20" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full border border-white/20" />
          <div className="absolute bottom-10 right-1/4 w-28 h-28 rounded-full border border-white/20" />
        </div>

        {/* 점 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* 애니메이션 라인 */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2 animate-pulse" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 콜라보 섹션 - 이미지 제거, 텍스트만 */}
        <div className={`${isMobile ? "py-8" : "py-10"}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* 콜라보 텍스트 */}
            <div className="text-center space-y-2">
              <p
                className={`text-white font-bold ${
                  isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl"
                }`}
              >
                COW × 학생회
              </p>
              <p
                className={`text-white/80 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                융합소프트웨어 비상대책위원회
              </p>
            </div>
          </div>
        </div>

        {/* 하단: 네비게이션 및 저작권 */}
        <div
          className={`border-t border-white/10 ${isMobile ? "py-3" : "py-4"}`}
        >
          <div
            className={`flex flex-col ${
              isMobile
                ? "space-y-3 items-center"
                : "sm:flex-row sm:justify-between sm:items-center"
            }`}
          >
            {/* 네비게이션 링크 */}
            <nav
              className={`flex flex-wrap gap-3 sm:gap-4 ${
                isMobile ? "justify-center" : ""
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-white/70 hover:text-white transition-colors ${
                    isMobile ? "text-xs sm:text-sm" : "text-sm"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 저작권 정보 */}
            <div
              className={`text-white/60 ${
                isMobile ? "text-center text-xs" : "text-xs sm:text-sm"
              }`}
            >
              © {new Date().getFullYear()} COW
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
