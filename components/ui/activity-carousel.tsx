"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

export interface ActivityImage {
  id: string;
  src: string;
  alt: string;
}

interface ActivityCarouselProps {
  images: ActivityImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function ActivityCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 4000,
}: ActivityCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // 자동 재생
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, images.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* 캐러셀 컨테이너 */}
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative w-full flex-shrink-0"
              style={{
                minHeight: isMobile ? "320px" : isTablet ? "440px" : "560px",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === currentIndex}
              />
              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
            </div>
          ))}
        </div>

        {/* 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
              disabled={isTransitioning}
              aria-label="이전 이미지"
            >
              <ChevronLeft
                className={`text-white ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
              />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
              disabled={isTransitioning}
              aria-label="다음 이미지"
            >
              <ChevronRight
                className={`text-white ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
              />
            </button>
          </>
        )}

        {/* 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  index === currentIndex
                    ? "bg-gold-500 w-8 h-2"
                    : "bg-white/30 w-2 h-2 hover:bg-white/50"
                )}
                aria-label={`${index + 1}번째 이미지로 이동`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

