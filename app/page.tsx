"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks/useResponsive";
import { gradientFooter } from "@/lib/constants/colors";
import {
  fetchApplicationResult,
  type ApplicationResultResponse,
} from "@/lib/api/application";
import {
  ArrowRight,
  Shield,
  Search,
  Loader2,
  Lock,
} from "lucide-react";
import type { AxiosError } from "axios";

const RESULT_LOOKUP_ENABLED = true;
const RESULT_CODE_REGEX = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/;

function normalizeResultCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^ABCDEFGHJKMNPQRSTUVWXYZ23456789]/g, "")
    .slice(0, 4);
}

export default function Home() {
  const { isMobile, isTablet } = useResponsive();
  const [resultCode, setResultCode] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const [result, setResult] = useState<ApplicationResultResponse | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);

  const handleResultLookup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!RESULT_LOOKUP_ENABLED) return;
      const code = normalizeResultCode(resultCode);
      if (!RESULT_CODE_REGEX.test(code)) {
        setResultError(
          "결과 조회 코드는 영문/숫자 4자리입니다. (I, L, O, 0, 1 제외)",
        );
        setResult(null);
        return;
      }
      setResultLoading(true);
      setResultError(null);
      setResult(null);
      try {
        const data = await fetchApplicationResult({ resultCode: code });
        setResult(data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const serverMessage = (axiosError.response?.data as { message?: string })?.message;

        if (status === 403) {
          setResultError("아직 결과 공개 전입니다.");
        } else if (status === 404) {
          setResultError("결과 코드를 다시 확인해주세요.");
        } else if (status === 409) {
          setResultError("결과가 아직 확정되지 않았습니다.");
        } else if (status === 400) {
          setResultError(serverMessage || "결과 조회 코드 형식을 확인해주세요.");
        } else {
          setResultError(serverMessage || "결과 조회에 실패했습니다.");
        }
      } finally {
        setResultLoading(false);
      }
    },
    [resultCode],
  );

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
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
                ? "w-[300px] h-[300px]"
                : isTablet
                  ? "w-[400px] h-[400px]"
                  : "w-[600px] h-[600px]"
            }`}
          />
        </div>

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

            <div
              className={`flex items-center justify-center gap-3 sm:gap-4 animate-fade-up [animation-delay:400ms] ${
                isMobile ? "flex-col w-full px-4" : "flex-col sm:flex-row"
              }`}
            >
              <Link
                href="/about"
                className={`inline-block transition-transform duration-200 hover:scale-[1.02] ${isMobile ? "w-full" : ""}`}
              >
                <Button
                  variant="hero"
                  size={isMobile ? "lg" : "xl"}
                  className={`group shadow-2xl ${isMobile ? "w-full" : ""}`}
                >
                  비대위 알아보기
                  <ArrowRight
                    className={`transition-transform group-hover:translate-x-1 ${
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    }`}
                  />
                </Button>
              </Link>
              <Link
                href="/apply"
                className={`inline-block transition-transform duration-200 hover:scale-[1.02] ${isMobile ? "w-full" : ""}`}
              >
                <Button
                  variant="heroOutline"
                  size={isMobile ? "lg" : "xl"}
                  className={`shadow-xl ${isMobile ? "w-full" : ""}`}
                >
                  지원하기
                </Button>
              </Link>
              <Link
                href="/admin"
                className={`inline-block transition-transform duration-200 hover:scale-[1.02] ${isMobile ? "w-full" : ""}`}
              >
                <Button
                  variant="ghost"
                  size={isMobile ? "lg" : "xl"}
                  className={`text-white/80 hover:text-white hover:bg-white/10 ${isMobile ? "w-full" : ""}`}
                >
                  <Shield className="w-5 h-5" />
                  관리자 기능
                </Button>
              </Link>
            </div>
          </div>
        </div>

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

      <section
        className={`bg-gradient-to-b from-navy-900 to-navy-800 border-y border-navy-700 relative overflow-hidden ${
          isMobile ? "py-12" : "py-16"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              {RESULT_LOOKUP_ENABLED ? (
                <Search
                  className={`text-gold-400 mx-auto mb-3 ${
                    isMobile ? "w-10 h-10" : "w-12 h-12"
                  }`}
                />
              ) : (
                <Lock
                  className={`text-white/50 mx-auto mb-3 ${
                    isMobile ? "w-10 h-10" : "w-12 h-12"
                  }`}
                />
              )}
              <h2
                className={`font-bold text-white mb-2 ${
                  isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                }`}
              >
                지원 결과 조회
              </h2>
              {RESULT_LOOKUP_ENABLED ? (
                <p className="text-white/70 text-sm sm:text-base">
                  제출 시 발급받은 4자리 결과 코드로 합격 여부를 조회할 수
                  있습니다. 결과 공개 이후에만 조회 가능합니다.
                </p>
              ) : (
                <p className="text-white/70 text-sm sm:text-base">
                  지금은 결과 조회 기간이 아닙니다. 결과 공개 후 조회
                  가능합니다.
                </p>
              )}
            </div>
            <form
              onSubmit={handleResultLookup}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={resultCode}
                  onChange={(e) => setResultCode(normalizeResultCode(e.target.value))}
                  placeholder="예: A4K3"
                  maxLength={4}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono text-center text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={resultLoading || !RESULT_LOOKUP_ENABLED}
                />
                <Button
                  type="submit"
                  variant="hero"
                  size={isMobile ? "lg" : "xl"}
                  disabled={resultLoading || !RESULT_LOOKUP_ENABLED}
                  className="sm:min-w-[120px] opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resultLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 sm:mr-1" />
                      조회
                    </>
                  )}
                </Button>
              </div>
              {resultError && RESULT_LOOKUP_ENABLED && (
                <p className="mt-3 text-red-300 text-sm">{resultError}</p>
              )}
            </form>
            {RESULT_LOOKUP_ENABLED && result && (
              <div
                className={`mt-6 rounded-2xl border border-white/10 border-l-4 ${
                  ["ACCEPTED", "합격", "PASS"].includes(
                    (result.status ?? "").toUpperCase(),
                  )
                    ? "border-l-emerald-400 bg-white/10"
                    : ["REJECTED", "불합격", "FAIL"].includes(
                          (result.status ?? "").toUpperCase(),
                        )
                      ? "border-l-rose-400 bg-white/5"
                      : "border-l-white/30 bg-white/5"
                } backdrop-blur-md shadow-lg p-4 sm:p-6 text-left leading-relaxed`}
              >
                {["ACCEPTED", "합격", "PASS"].includes(
                  (result.status ?? "").toUpperCase(),
                ) ? (
                  <>
                    <p className="text-emerald-300 text-sm sm:text-base">
                      <span className="font-semibold">{result.name}님</span>, 축하드립니다.
                    </p>
                    <p className="mt-2 text-white/90 text-sm sm:text-base">
                      융합소프트웨어학부 비상대책위원회 모집에 최종 합격하셨습니다.
                    </p>
                  </>
                ) : ["REJECTED", "불합격", "FAIL"].includes(
                    (result.status ?? "").toUpperCase(),
                  ) ? (
                  <>
                    <p className="text-rose-300 text-sm sm:text-base">
                      <span className="font-semibold">{result.name}님</span>, 소중한 시간 내어 지원해주셔서 감사합니다.
                    </p>
                    <p className="mt-2 text-white/90 text-sm sm:text-base">
                      아쉽게도 이번 모집에서는 함께하지 못하게 되었습니다.
                    </p>
                  </>
                ) : (
                  <p className="text-white/90 text-sm sm:text-base">
                    <span className="font-semibold">{result.name}님</span>, 심사 중입니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
