"use client";

import Link from "next/link";
import { useResponsive } from "@/hooks/useResponsive";

export default function Footer() {
  const { isMobile, isTablet } = useResponsive();

  // 회사 정보 (수정 가능)
  const companyInfo = {
    name: "회사명",
    representative: "대표자명",
    businessNumber: "사업자 등록번호",
    email: "이메일",
    address: "주소",
    domain: "도메인",
  };

  // AI·데이터 활용 고지 (수정 가능)
  const aiNotice = {
    title: "AI·데이터 활용 고지",
    content:
      "AI 분석 결과는 마케팅 전략 수립을 위한 참고 자료로 활용되며, 최종 판단과 실행은 전문 마케터의 검토를 통해 이루어집니다. 분석 과정에 활용되는 데이터는 내부 기준에 따라 관리되며, 외부에 무단 제공되지 않습니다.",
  };

  // 네비게이션 링크 (수정 가능)
  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "PORTFOLIO", href: "/portfolio" },
    { label: "SERVICE", href: "/service" },
    { label: "CONTACT", href: "/contact" },
    { label: "PRIVACY", href: "/privacy" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 섹션 */}
        <div
          className={`py-8 sm:py-10 lg:py-12 ${
            isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-8"
          }`}
        >
          {/* 왼쪽: 로고 및 회사명 */}
          <div className={isMobile ? "text-center" : ""}>
            <div className="flex items-center gap-3 mb-4">
              {/* 로고 영역 - 이미지로 교체 가능 */}
              <div className="w-12 h-12 bg-navy-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">로고</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy-900">회사명</h2>
                <p className="text-sm text-navy-600">부제목</p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 회사 정보 */}
          <div className={isMobile ? "space-y-3" : "space-y-2"}>
            <div
              className={`text-navy-700 ${isMobile ? "text-sm" : "text-base"}`}
            >
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>회사명:</strong> {companyInfo.name}
                </span>
                <span>
                  <strong>대표자명:</strong> {companyInfo.representative}
                </span>
              </div>
            </div>
            <div
              className={`text-navy-700 ${isMobile ? "text-sm" : "text-base"}`}
            >
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <strong>사업자 등록번호:</strong> {companyInfo.businessNumber}
                </span>
                <span>
                  <strong>이메일:</strong>{" "}
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="text-navy-600 hover:text-navy-900 underline"
                  >
                    {companyInfo.email}
                  </a>
                </span>
              </div>
            </div>
            <div
              className={`text-navy-700 ${isMobile ? "text-sm" : "text-base"}`}
            >
              <div>
                <strong>주소:</strong> {companyInfo.address}
              </div>
            </div>
            <div
              className={`text-navy-700 ${isMobile ? "text-sm" : "text-base"}`}
            >
              <div>
                <strong>도메인:</strong>{" "}
                <a
                  href={`https://${companyInfo.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-600 hover:text-navy-900 underline"
                >
                  {companyInfo.domain}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* AI·데이터 활용 고지 섹션 */}
        <div
          className={`border-t border-gray-200 pt-6 sm:pt-8 ${
            isMobile ? "pb-6" : "pb-8"
          }`}
        >
          <h3
            className={`font-semibold text-navy-900 mb-3 ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            {aiNotice.title}
          </h3>
          <p
            className={`text-navy-600 leading-relaxed ${
              isMobile ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            {aiNotice.content}
          </p>
        </div>

        {/* 하단: 네비게이션 및 저작권 */}
        <div
          className={`border-t border-gray-200 ${isMobile ? "py-4" : "py-6"}`}
        >
          <div
            className={`flex flex-col ${
              isMobile
                ? "space-y-4"
                : "sm:flex-row sm:justify-between sm:items-center"
            }`}
          >
            {/* 네비게이션 링크 */}
            <nav
              className={`flex flex-wrap gap-4 sm:gap-6 ${
                isMobile ? "justify-center" : ""
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-navy-700 hover:text-navy-900 transition-colors ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 저작권 정보 */}
            <div
              className={`text-navy-600 ${
                isMobile
                  ? "text-center text-xs sm:text-sm"
                  : "text-sm sm:text-base"
              }`}
            >
              © {new Date().getFullYear()} 회사명. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
