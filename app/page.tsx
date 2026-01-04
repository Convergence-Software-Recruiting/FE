import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Award,
  Lightbulb,
  Heart,
} from "lucide-react";

export default function Home() {
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400 rounded-full blur-[200px] opacity-20" />
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-2 h-2 bg-gold-500 rounded-full" />
            <div className="absolute top-40 left-40 w-3 h-3 bg-gold-400 rounded-full" />
            <div className="absolute bottom-32 right-32 w-2 h-2 bg-gold-500 rounded-full" />
            <div className="absolute bottom-52 right-52 w-3 h-3 bg-gold-400 rounded-full" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8 animate-fade-up [animation-delay:100ms] shadow-lg">
              <span className="w-2.5 h-2.5 bg-gold-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-semibold">
                2026학년도 신입부원 모집 중
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 animate-fade-up [animation-delay:200ms] leading-tight">
              융합소프트웨어
              <br />
              <span className="text-gradient-gold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-lg">
                비상대책위원회
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up [animation-delay:300ms] font-light">
              명지대학교 융합소프트웨어학부의 변화를 이끄는 학생 자치 기구입니다.
              <br className="hidden sm:block" />
              <span className="text-gold-300 font-medium">
                함께 성장하고, 함께 변화를 만들어갈 새로운 동료를 찾습니다.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:400ms]">
              <Link href="/apply">
                <Button variant="hero" size="xl" className="group shadow-2xl">
                  지원하기
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="heroOutline" size="xl" className="shadow-xl">
                  비대위 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-gold-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-navy-900 to-navy-800 border-b border-navy-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold-400 mb-3">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-white/80 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background via-white to-navy-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-6">
              비대위와 함께하면
            </h2>
            <p className="text-navy-700 text-xl max-w-2xl mx-auto leading-relaxed">
              단순한 학생회 활동을 넘어, 진정한 성장의 기회를 경험하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-white border-2 border-navy-100 hover:border-gold-400 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center text-white mb-6 group-hover:from-gold-500 group-hover:to-gold-600 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-navy-900 mb-4 group-hover:text-gold-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-navy-600 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white via-navy-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-navy-900 mb-12">
              우리의 가치
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-navy-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-navy-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              지금 바로 지원하세요
            </h2>
            <p className="text-white/90 text-xl mb-10 leading-relaxed">
              새로운 도전을 시작할 준비가 되셨나요?
              <br />
              비대위와 함께 의미 있는 대학 생활을 만들어가세요.
            </p>
            <Link href="/apply">
              <Button variant="hero" size="xl" className="group shadow-2xl">
                지원서 작성하기
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
