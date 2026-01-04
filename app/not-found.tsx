"use client";

import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

// Next.js는 not-found.tsx를 자동으로 404 페이지로 인식합니다
export default function NotFound() {
  const { isMobile } = useResponsive();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-white to-navy-50/50 px-4">
      <div className="text-center max-w-md mx-auto">
        <h1
          className={`font-bold text-navy-900 mb-4 ${
            isMobile ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
          }`}
        >
          404
        </h1>
        <p
          className={`text-muted-foreground mb-6 ${
            isMobile ? "text-base sm:text-lg" : "text-xl"
          }`}
        >
          Oops! Page not found
        </p>
        <Link
          href="/"
          className={`text-primary underline hover:text-primary/90 transition-colors ${
            isMobile ? "text-sm" : "text-base"
          }`}
        >
          메인으로 가기
        </Link>
      </div>
    </div>
  );
}
