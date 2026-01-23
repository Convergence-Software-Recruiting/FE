"use client";

import { useState, useEffect } from "react";

/**
 * Tailwind CSS 브레이크포인트 기준
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export interface UseResponsiveReturn {
  width: number;
  height: number;
  isMobile: boolean; // < 640px
  isTablet: boolean; // >= 640px && < 1024px
  isDesktop: boolean; // >= 1024px
  isSmallMobile: boolean; // < 640px
  isLargeMobile: boolean; // >= 640px && < 768px
  isSmallTablet: boolean; // >= 768px && < 1024px
  isLargeDesktop: boolean; // >= 1280px
  isXLargeDesktop: boolean; // >= 1536px
  breakpoint:
    | "mobile"
    | "tablet"
    | "desktop"
    | "large-desktop"
    | "xlarge-desktop";
}

export function useResponsive(): UseResponsiveReturn {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState(() => {
    // SSR과 초기 클라이언트 렌더링에서 같은 값을 반환 (desktop 기본값)
    return { width: 1920, height: 1080 };
  });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 설정
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 마운트되기 전까지는 서버와 같은 기본값 유지
  const width = mounted ? dimensions.width : 1920;

  

  const isMobile = width < breakpoints.sm;
  const isTablet = width >= breakpoints.sm && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;
  const isSmallMobile = width < breakpoints.sm;
  const isLargeMobile = width >= breakpoints.sm && width < breakpoints.md;
  const isSmallTablet = width >= breakpoints.md && width < breakpoints.lg;
  const isLargeDesktop = width >= breakpoints.xl;
  const isXLargeDesktop = width >= breakpoints["2xl"];

  let breakpoint: UseResponsiveReturn["breakpoint"] = "mobile";
  if (width >= breakpoints["2xl"]) {
    breakpoint = "xlarge-desktop";
  } else if (width >= breakpoints.xl) {
    breakpoint = "large-desktop";
  } else if (width >= breakpoints.lg) {
    breakpoint = "desktop";
  } else if (width >= breakpoints.sm) {
    breakpoint = "tablet";
  } else {
    breakpoint = "mobile";
  }

  return {
    width,
    height: mounted ? dimensions.height : 1080,
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeDesktop,
    isXLargeDesktop,
    breakpoint,
  };
}
