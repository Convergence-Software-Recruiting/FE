"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import Footer from "./Footer";

interface LayoutClientProps {
  children: ReactNode;
  isAdminHost?: boolean;
}

export default function LayoutClient({
  children,
  isAdminHost = false,
}: LayoutClientProps) {
  if (isAdminHost) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-4 right-4 z-40">
        <Link
          href="/admin"
          aria-label="관리자 페이지로 이동"
          className="inline-flex items-center justify-center rounded-full bg-navy-900/70 border border-white/20 p-2 text-white/70 shadow-lg backdrop-blur-md hover:text-gold-300 hover:bg-navy-900/90 hover:border-gold-400/60 transition-all duration-200"
        >
          <Wrench className="w-4 h-4" />
        </Link>
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
