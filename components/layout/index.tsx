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
  if (isAdminHost) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
