"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ActivityCarousel from "@/components/ui/activity-carousel";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from '@/lib/constants/colors';
import type { ActivityImage } from "@/components/ui/activity-carousel";
import {
  ArrowRight,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Award,
  Lightbulb,
  Heart,
  Shield,
} from "lucide-react";

export default function Home() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const features = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "함께 성장하는 공동체",
      description:
        "다양한 전공의 학우들과 협업하며 실무 경험을 쌓고 함께 성장할 수 있는 환경을 제공합니다.",
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "실질적인 학생 권익 활동",
      description:
        "학우들의 목소리를 대변하고 학부 발전을 위한 다양한 활동을 전개하며 변화를 만들어갑니다.",
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "특별한 경험과 성장",
      description:
        "리더십, 기획력, 소통 능력 등 다양한 역량을 키우며 의미 있는 대학 생활을 만들어갑니다.",
    },
  ];

  const values = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "전문성",
      description: "실무 중심의 프로젝트 경험",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "혁신성",
      description: "새로운 아이디어와 도전",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "협력성",
      description: "함께 만들어가는 문화",
    },
  ];

  const stats = [
    { value: "50+", label: "누적 활동 인원" },
    { value: "20+", label: "진행 프로젝트" },
    { value: "4", label: "전공 분야" },
    { value: "2026", label: "신입부원 모집" },
  ];

  // 활동사진 데이터
  const activityImages: ActivityImage[] = [
    {
      id: "1",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-31 001.jpeg",
      alt: "비대위 활동 사진 1",
    },
    {
      id: "2",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-32 002.jpeg",
      alt: "비대위 활동 사진 2",
    },
    {
      id: "3",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-32 003.jpeg",
      alt: "비대위 활동 사진 3",
    },
    {
      id: "4",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-33 004.jpeg",
      alt: "비대위 활동 사진 4",
    },
    {
      id: "5",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-33 005.jpeg",
      alt: "비대위 활동 사진 5",
    },
    {
      id: "6",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-34 006.jpeg",
      alt: "비대위 활동 사진 6",
    },
    {
      id: "7",
      src: "/KakaoTalk_Photo_2026-01-04-18-21-34 007.jpeg",
      alt: "비대위 활동 사진 7",
    },
  ];

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

      {/* Stats Section */}
      <section
        className={`bg-gradient-to-b from-navy-900 to-navy-800 border-b border-navy-700 ${
          isMobile ? "py-12" : isTablet ? "py-16" : "py-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto ${
              isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
            }`}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 p-4 sm:p-6"
              >
                <p
                  className={`font-bold text-gold-400 mb-2 sm:mb-3 ${
                    isMobile
                      ? "text-2xl sm:text-3xl"
                      : isTablet
                      ? "text-3xl sm:text-4xl md:text-5xl"
                      : "text-4xl sm:text-5xl md:text-6xl"
                  }`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-white/80 font-medium ${
                    isMobile ? "text-xs" : "text-sm sm:text-base"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Carousel Section */}
      <section
        className={`bg-gradient-to-b from-navy-800 to-navy-900 border-b border-navy-700 ${
          isMobile ? "py-12" : isTablet ? "py-16" : "py-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-center font-bold text-white mb-6 sm:mb-8 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
              }`}
            >
              활동 사진
            </h2>
            <ActivityCarousel
              images={activityImages}
              autoPlay={true}
              autoPlayInterval={4000}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`bg-gradient-to-b from-background via-white to-navy-50/50 ${
          isMobile ? "py-12" : isTablet ? "py-16" : "py-24"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${isMobile ? "mb-12" : "mb-20"}`}>
            <h2
              className={`font-bold text-navy-900 mb-4 sm:mb-6 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
              }`}
            >
              비대위와 함께하면
            </h2>
            <p
              className={`text-navy-700 max-w-2xl mx-auto leading-relaxed ${
                isMobile ? "text-base sm:text-lg px-4" : "text-xl"
              }`}
            >
              단순한 학생회 활동을 넘어, 진정한 성장의 기회를 경험하세요
            </p>
          </div>

          <div
            className={`grid gap-6 sm:gap-8 max-w-6xl mx-auto ${
              isMobile ? "grid-cols-1" : "md:grid-cols-3"
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group rounded-3xl bg-white border-2 border-navy-100 hover:border-gold-400 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 hover:-translate-y-2 ${
                  isMobile ? "p-6" : "p-8"
                }`}
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:from-gold-500 group-hover:to-gold-600 group-hover:scale-110 transition-all duration-300 shadow-lg ${
                    isMobile ? "w-12 h-12" : "w-16 h-16"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`font-bold text-navy-900 mb-3 sm:mb-4 group-hover:text-gold-600 transition-colors ${
                    isMobile ? "text-lg sm:text-xl" : "text-2xl"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-navy-600 leading-relaxed ${
                    isMobile ? "text-sm sm:text-base" : "text-base"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className={`bg-gradient-to-b from-white via-navy-50/30 to-white ${
          isMobile ? "py-12" : "py-20"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2
              className={`font-bold text-center text-navy-900 mb-8 sm:mb-12 ${
                isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
              }`}
            >
              우리의 가치
            </h2>
            <div
              className={`grid gap-4 sm:gap-6 ${
                isMobile ? "grid-cols-1 sm:grid-cols-2" : "md:grid-cols-3"
              }`}
            >
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-100 hover:shadow-lg transition-all duration-300 p-4 sm:p-6"
                >
                  <div
                    className={`rounded-full bg-gold-100 flex items-center justify-center text-gold-600 mx-auto mb-3 sm:mb-4 ${
                      isMobile ? "w-12 h-12" : "w-14 h-14"
                    }`}
                  >
                    {value.icon}
                  </div>
                  <h3
                    className={`font-bold text-navy-900 mb-2 ${
                      isMobile ? "text-base sm:text-lg" : "text-xl"
                    }`}
                  >
                    {value.title}
                  </h3>
                  <p
                    className={`text-navy-600 ${
                      isMobile ? "text-xs sm:text-sm" : "text-sm"
                    }`}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
