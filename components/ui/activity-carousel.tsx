"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const isTransitioningRef = useRef(false);
  const { isMobile, isTablet } = useResponsive();

  const handleNext = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = (prev + 1) % images.length;
      setTimeout(() => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, 500);
      return next;
    });
  };

  const handlePrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = (prev - 1 + images.length) % images.length;
      setTimeout(() => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, 500);
      return next;
    });
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setCurrentIndex((prev) => {
        const next = (prev + 1) % images.length;
        setTimeout(() => {
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        }, 500);
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToSlide = (index: number) => {
    if (isTransitioningRef.current || index === currentIndex) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      isTransitioningRef.current = false;
      setIsTransitioning(false);
    }, 500);
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-200 disabled:opacity-50"
              disabled={isTransitioning}
              aria-label="이전 이미지"
            >
              <ChevronLeft
                className={`text-white ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
              />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-200 disabled:opacity-50"
              disabled={isTransitioning}
              aria-label="다음 이미지"
            >
              <ChevronRight
                className={`text-white ${isMobile ? "w-5 h-5" : "w-6 h-6"}`}
              />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "transition-all duration-200 rounded-full hover:scale-125",
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

