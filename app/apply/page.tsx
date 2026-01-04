"use client";

import { useResponsive } from "@/hooks/useResponsive";

export default function ApplyPage() {
  const { isMobile, isTablet } = useResponsive();

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
            Apply Page
          </h1>
          <p
            className={`text-navy-700 leading-relaxed ${
              isMobile ? "text-sm sm:text-base" : "text-base sm:text-lg"
            }`}
          >
            {/* Apply 페이지 내용을 여기에 작성 */}
          </p>
        </div>
      </div>
    </div>
  );
}
