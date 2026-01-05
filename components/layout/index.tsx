"use client";

import { ReactNode } from "react";
import Footer from "./Footer";

interface LayoutClientProps {
  children: ReactNode;
  isAdminHost?: boolean;
}

export default function LayoutClient({
  children,
  isAdminHost = false,
}: LayoutClientProps) {
  // Admin 호스트인 경우 다른 레이아웃 적용 가능
  if (isAdminHost) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 네비게이션은 필요시 여기에 추가 */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
