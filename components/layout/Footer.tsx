"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/constants/colors";

export default function Footer() {
  const { isMobile, isTablet } = useResponsive();

  const navLinks = [
    { label: "ABOUT", href: "https://www.instagram.com/mju_cow/" },
    { label: "APPLY", href: "https://ddingdong.mju.ac.kr/club/91" },
    { label: "CONTACT", href: "https://www.instagram.com/frizsbeen/" },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: gradientFooter }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/50 to-gray-300/30 animate-pulse" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255, 255, 255, 0.1) 20px,
                rgba(255, 255, 255, 0.1) 40px
              )`,
            }}
          />
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/20" />
          <div className="absolute top-20 right-20 w-24 h-24 rounded-full border border-white/20" />
          <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full border border-white/20" />
          <div className="absolute bottom-10 right-1/4 w-28 h-28 rounded-full border border-white/20" />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2 animate-pulse" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`border-t border-white/10 ${isMobile ? "py-3" : "py-4"}`}
        >
          <div
            className={`flex flex-col ${
              isMobile
                ? "space-y-3 items-center"
                : "sm:flex-row sm:justify-between sm:items-center"
            }`}
          >
            <nav
              className={`flex flex-wrap gap-3 sm:gap-4 ${
                isMobile ? "justify-center" : ""
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white/70 hover:text-white transition-all duration-200 hover:scale-105 inline-block ${
                    isMobile ? "text-xs sm:text-sm" : "text-sm"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div
              className={`text-white/70 ${
                isMobile ? "text-center text-xs" : "text-xs sm:text-sm"
              }`}
            >
              © {new Date().getFullYear()} mju_cow. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
