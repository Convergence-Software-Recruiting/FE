"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ActivityCarousel from "@/components/ui/activity-carousel";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/constants/colors";
import type { ActivityImage } from "@/components/ui/activity-carousel";
import {
  Users,
  Target,
  Sparkles,
  Award,
  Lightbulb,
  Heart,
  CheckCircle,
  Lock,
  Eye,
  Wallet,
  ChevronRight,
  Instagram,
  ExternalLink,
  Home,
} from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/mju_sw/";
const LINKTREE_URL = "https://linktr.ee/mju_sw";

export default function AboutPage() {
  const { isMobile, isTablet } = useResponsive();

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

  const activityImages: ActivityImage[] = [
    { id: "1", src: "/activity/sw1.jpeg", alt: "비대위 활동 사진 1" },
    { id: "2", src: "/activity/sw2.jpeg", alt: "비대위 활동 사진 2" },
    { id: "3", src: "/activity/sw3.jpeg", alt: "비대위 활동 사진 3" },
    { id: "4", src: "/activity/sw4.jpeg", alt: "비대위 활동 사진 4" },
    { id: "5", src: "/activity/sw5.jpeg", alt: "비대위 활동 사진 5" },
    { id: "6", src: "/activity/cow1.jpeg", alt: "비대위 활동 사진 6" },
    { id: "7", src: "/activity/cow2.jpeg", alt: "비대위 활동 사진 7" },
  ];

  return (
    <>
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
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
                ? "w-[200px] h-[200px]"
                : isTablet
                  ? "w-[280px] h-[280px]"
                  : "w-[400px] h-[400px]"
            }`}
          />
        </div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className={`absolute bg-gold-500 rounded-full ${isMobile ? "top-10 left-10 w-1.5 h-1.5" : "top-20 left-20 w-2 h-2"}`}
            />
            <div
              className={`absolute bg-gold-400 rounded-full ${isMobile ? "top-20 left-20 w-2 h-2" : "top-40 left-40 w-3 h-3"}`}
            />
            <div
              className={`absolute bg-gold-500 rounded-full ${isMobile ? "bottom-16 right-16 w-1.5 h-1.5" : "bottom-32 right-32 w-2 h-2"}`}
            />
            <div
              className={`absolute bg-gold-400 rounded-full ${isMobile ? "bottom-26 right-26 w-2 h-2" : "bottom-52 right-52 w-3 h-3"}`}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className={`font-extrabold text-white mb-4 ${
                isMobile
                  ? "text-3xl sm:text-4xl"
                  : isTablet
                    ? "text-4xl sm:text-5xl"
                    : "text-5xl sm:text-6xl"
              }`}
            >
              비대위 알아보기
            </h1>
            <p
              className={`text-white/90 max-w-2xl mx-auto mb-8 ${isMobile ? "text-base" : "text-lg sm:text-xl"}`}
            >
              명지대학교 융합소프트웨어학부의 변화를 이끄는 학생 자치
              기구입니다.
            </p>
            <div
              className={`flex flex-wrap items-center justify-center gap-3 ${isMobile ? "gap-2" : "gap-4"}`}
            >
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 sm:px-5 sm:py-3 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-200"
              >
                <Instagram className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
                <span
                  className={
                    isMobile ? "text-sm font-medium" : "text-base font-semibold"
                  }
                >
                  @mju_sw
                </span>
              </a>
              <a
                href={LINKTREE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 sm:px-5 sm:py-3 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-200"
              >
                <ExternalLink className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
                <span
                  className={
                    isMobile ? "text-sm font-medium" : "text-base font-semibold"
                  }
                >
                  링크트리
                </span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 sm:px-5 sm:py-3 text-white hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-200"
              >
                <Home className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
                <span
                  className={
                    isMobile ? "text-sm font-medium" : "text-base font-semibold"
                  }
                >
                  메인으로 가기
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`bg-gradient-to-b from-navy-900 to-navy-800 border-b border-navy-700 ${isMobile ? "py-12" : "py-16"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-4 sm:gap-6 max-w-5xl mx-auto ${isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10"
              >
                <p
                  className={`font-bold text-gold-400 mb-2 ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}
                >
                  {stat.value}
                </p>
                <p className="text-white/80 text-sm sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`bg-gradient-to-b from-navy-800 to-navy-900 border-b border-navy-700 min-h-[560px] ${isMobile ? "py-20" : "py-32"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-center font-bold text-white mb-6 sm:mb-8 ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}
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

      <section
        className={`bg-gradient-to-b from-background via-white to-navy-50/50 ${isMobile ? "py-12" : "py-20"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className={`font-bold text-navy-900 mb-4 ${isMobile ? "text-2xl" : "text-4xl"}`}
            >
              비대위와 함께하면
            </h2>
            <p className="text-navy-700 max-w-2xl mx-auto">
              단순한 학생회 활동을 넘어, 진정한 성장의 기회를 경험하세요
            </p>
          </div>
          <div
            className={`grid gap-6 max-w-6xl mx-auto ${isMobile ? "grid-cols-1" : "md:grid-cols-3"}`}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white border-2 border-navy-100 hover:border-gold-400 hover:shadow-xl hover:scale-[1.02] p-6 sm:p-8 transition-all duration-200"
              >
                <div className="rounded-2xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center text-white w-14 h-14 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-navy-900 mb-3 text-lg sm:text-xl">
                  {f.title}
                </h3>
                <p className="text-navy-600 text-sm sm:text-base leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`bg-gradient-to-b from-white via-navy-50/30 to-white ${isMobile ? "py-12" : "py-20"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2
              className={`font-bold text-center text-navy-900 mb-8 ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}
            >
              우리의 가치
            </h2>
            <div
              className={`grid gap-4 sm:gap-6 ${isMobile ? "grid-cols-1 sm:grid-cols-2" : "md:grid-cols-3"}`}
            >
              {values.map((v, i) => (
                <div
                key={i}
                className="text-center rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-100 p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                  <div className="rounded-full bg-gold-100 flex items-center justify-center text-gold-600 w-14 h-14 mx-auto mb-3">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-navy-900 mb-2">{v.title}</h3>
                  <p className="text-navy-600 text-sm">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className={`bg-gradient-to-b from-white via-emerald-50/30 to-white ${isMobile ? "py-12" : "py-20"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 w-16 h-16 mb-4">
                <Wallet className="w-8 h-8" />
              </div>
              <h2
                className={`font-bold text-navy-900 mb-3 ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"}`}
              >
                투명하고 청렴한 운영
              </h2>
              <p className="text-navy-600 max-w-2xl mx-auto">
                비대위는{" "}
                <span className="font-semibold text-emerald-600">
                  토스 모임통장
                </span>
                을 활용하여 모든 회계 내역을 투명하게 공개하고 있습니다.
              </p>
            </div>
            <div
              className={`grid gap-4 sm:gap-6 ${isMobile ? "grid-cols-1" : "md:grid-cols-3"}`}
            >
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 p-6 sm:p-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                <div className="rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 w-14 h-14 mb-4">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">
                  실시간 회계 공개
                </h3>
                <p className="text-navy-600 text-sm">
                  토스 모임통장을 통해 모든 입출금 내역이 실시간으로 공개됩니다.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 p-6 sm:p-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                <div className="rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 w-14 h-14 mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">
                  안전한 자금 관리
                </h3>
                <p className="text-navy-600 text-sm">
                  토스의 안전한 금융 인프라로 회비와 예산을 신뢰할 수 있게
                  관리합니다.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 p-6 sm:p-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                <div className="rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 w-14 h-14 mb-4">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">완전한 투명성</h3>
                <p className="text-navy-600 text-sm">
                  모든 회계 내역이 공개되어 학우들이 언제든 확인하고 검증할 수
                  있습니다.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-700 font-semibold text-sm sm:text-base">
                  토스 모임통장으로 운영되는 투명한 학생 자치 기구
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`bg-gradient-navy relative overflow-hidden ${isMobile ? "py-12" : "py-20"}`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 bg-gold-500 rounded-full blur-[150px] w-64 h-64" />
          <div className="absolute bottom-0 left-0 bg-gold-400 rounded-full blur-[150px] w-64 h-64" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`font-bold text-white mb-4 ${isMobile ? "text-2xl" : "text-4xl"}`}
            >
              지금 바로 지원하세요
            </h2>
            <p className="text-white/90 mb-8 text-base sm:text-lg">
              비대위와 함께 의미 있는 대학 생활을 만들어가세요.
            </p>
            <Link href="/apply" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
              <Button
                variant="hero"
                size={isMobile ? "lg" : "xl"}
                className="group shadow-2xl"
              >
                지원서 작성하기
                <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
