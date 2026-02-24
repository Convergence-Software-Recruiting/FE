"use client";

import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks/useResponsive";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Search,
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp,
  Package,
  ClipboardList,
} from "lucide-react";
import {
  fetchApplicationResult,
  type ApplicationResultResponse,
} from "@/lib/api/application";
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

export default function ServicePage() {
  const { isMobile } = useResponsive();
  const [resultCode, setResultCode] = useState("");
  const [resultLoading, setResultLoading] = useState(false);
  const [result, setResult] = useState<ApplicationResultResponse | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [resultOpen, setResultOpen] = useState(false);

  const handleResultLookup = useCallback(
    async (e: FormEvent) => {
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
    <main
      className={`min-h-screen bg-gradient-to-b from-navy-900 via-navy-900/40 to-white ${
        isMobile ? "py-14" : "py-20"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          <p
            className={`text-center text-white/60 font-medium tracking-widest uppercase ${
              isMobile ? "text-xs" : "text-sm"
            } mb-3`}
          >
            EVENT
          </p>
          <h1
            className={`text-center font-extrabold text-white mb-4 sm:mb-5 ${
              isMobile ? "text-2xl" : "text-3xl sm:text-4xl"
            }`}
          >
            진행 중인 이벤트를
            <br />
            한 곳에서 확인하세요
          </h1>
          <div className="flex justify-center mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/20 px-3 py-1.5 text-xs sm:text-sm text-white/80 hover:bg-white/10 hover:border-gold-400/70 hover:text-gold-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              메인으로 돌아가기
            </Link>
          </div>

          {/* 3개 이벤트 카드 - 세로 CTA 스택 */}
          <div className="flex flex-col gap-4 sm:gap-5 mt-4 max-w-3xl mx-auto">
            {/* 지원 결과 조회 */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/10 hover:border-gold-400/60 active:scale-[0.99] h-full flex flex-col">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 sm:py-6 text-left group"
                onClick={() => {
                  setResultOpen((prev) => !prev);
                  setResult(null);
                  setResultError(null);
                  setResultCode("");
                }}
                aria-expanded={resultOpen}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex-shrink-0 rounded-2xl bg-gold-500/20 flex items-center justify-center ${
                      isMobile ? "w-10 h-10" : "w-12 h-12"
                    }`}
                  >
                    {RESULT_LOOKUP_ENABLED ? (
                      <Search
                        className={`text-gold-300 ${
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        }`}
                      />
                    ) : (
                      <Lock
                        className={`text-white/40 ${
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-white ${
                        isMobile
                          ? "text-sm sm:text-base"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      지원 결과 조회
                    </p>
                    <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                      {RESULT_LOOKUP_ENABLED
                        ? "4자리 코드로 합격 여부를 확인하세요."
                        : "현재 결과 공개 기간이 아닙니다."}
                    </p>
                  </div>
                </div>
                <div className="text-white/50 group-hover:text-white/80 transition-colors">
                  {resultOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {resultOpen && (
                <div className="px-5 sm:px-7 pb-6 sm:pb-7 border-t border-white/10 pt-5 space-y-4">
                  {RESULT_LOOKUP_ENABLED ? (
                    <p className="text-xs sm:text-sm text-white/70">
                      지원서 제출 시 발급된 4자리 결과 코드를 입력하면 합격
                      여부를 조회할 수 있습니다.
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-amber-300/90 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3">
                      결과 공개 기간이 아닙니다. 공개 후 다시 확인해 주세요.
                    </p>
                  )}
                  <form onSubmit={handleResultLookup}>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={resultCode}
                        onChange={(e) =>
                          setResultCode(normalizeResultCode(e.target.value))
                        }
                        placeholder="예: A4K3"
                        maxLength={4}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/90 text-navy-900 placeholder-navy-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={resultLoading || !RESULT_LOOKUP_ENABLED}
                      />
                      <Button
                        type="submit"
                        variant="hero"
                        size={isMobile ? "lg" : "xl"}
                        disabled={resultLoading || !RESULT_LOOKUP_ENABLED}
                        className="sm:min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resultLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-1" />
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
                      className={`rounded-2xl border border-white/10 border-l-4 ${
                        ["ACCEPTED", "합격", "PASS"].includes(
                          (result.status ?? "").toUpperCase(),
                        )
                          ? "border-l-emerald-400 bg-white/10"
                          : ["REJECTED", "불합격", "FAIL"].includes(
                                (result.status ?? "").toUpperCase(),
                              )
                            ? "border-l-rose-400 bg-white/5"
                            : "border-l-white/30 bg-white/5"
                      } backdrop-blur-md p-4 sm:p-5 text-left leading-relaxed`}
                    >
                      {["ACCEPTED", "합격", "PASS"].includes(
                        (result.status ?? "").toUpperCase(),
                      ) ? (
                        <>
                          <p className="text-emerald-300 text-sm sm:text-base">
                            <span className="font-semibold">
                              {result.name}님
                            </span>
                            , 축하드립니다.
                          </p>
                          <p className="mt-2 text-white/90 text-sm sm:text-base">
                            융합소프트웨어학부 비상대책위원회 모집에 최종
                            합격하셨습니다.
                          </p>
                        </>
                      ) : ["REJECTED", "불합격", "FAIL"].includes(
                          (result.status ?? "").toUpperCase(),
                        ) ? (
                        <>
                          <p className="text-rose-300 text-sm sm:text-base">
                            <span className="font-semibold">
                              {result.name}님
                            </span>
                            , 소중한 시간 내어 지원해주셔서 감사합니다.
                          </p>
                          <p className="mt-2 text-white/90 text-sm sm:text-base">
                            아쉽게도 이번 모집에서는 함께하지 못하게
                            되었습니다.
                          </p>
                        </>
                      ) : (
                        <p className="text-white/90 text-sm sm:text-base">
                          <span className="font-semibold">
                            {result.name}님
                          </span>
                          , 심사 중입니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="px-5 sm:px-7 pb-4 pt-2 mt-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 px-3 py-1">
                  <CalendarDays className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[11px] sm:text-xs text-white/70">
                    2026 모집 결과 공개 기간
                  </span>
                </div>
              </div>
            </div>

            {/* 지원하기 */}
            <Link href="/apply" className="block group h-full">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 transition-all duration-200 shadow-xl px-5 sm:px-7 py-5 sm:py-6 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/10 hover:border-gold-400/60 active:scale-[0.99]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 rounded-2xl bg-gold-500/20 group-hover:bg-gold-500/30 transition-colors flex items-center justify-center ${
                        isMobile ? "w-10 h-10" : "w-12 h-12"
                      }`}
                    >
                      <ClipboardList
                        className={`text-gold-300 ${
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-white ${
                          isMobile
                            ? "text-sm sm:text-base"
                            : "text-base sm:text-lg"
                        }`}
                      >
                        지원하기
                      </p>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                        비대위 신입부원 모집에 지원서를 제출합니다.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-gold-300 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 px-3 py-1">
                    <CalendarDays className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-[11px] sm:text-xs text-white/70">
                      2026 신입부원 모집
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* 사물함 신청 · Locker */}
            <Link href="/locker" className="block group h-full">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 transition-all duration-200 shadow-xl px-5 sm:px-7 py-5 sm:py-6 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/10 hover:border-gold-400/60 active:scale-[0.99]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 rounded-2xl bg-gold-500/20 group-hover:bg-gold-500/30 transition-colors flex items-center justify-center ${
                        isMobile ? "w-10 h-10" : "w-12 h-12"
                      }`}
                    >
                      <Package
                        className={`text-gold-300 ${
                          isMobile ? "w-5 h-5" : "w-6 h-6"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-white ${
                          isMobile
                            ? "text-sm sm:text-base"
                            : "text-base sm:text-lg"
                        }`}
                      >
                        사물함 신청 · Locker
                      </p>
                      <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                        종합관 3층 융합소프트웨어학부생 전용 사물함을 온라인으로
                        신청하세요.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-gold-300 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/15 px-3 py-1">
                    <CalendarDays className="w-3.5 h-3.5 text-white/70" />
                    <span className="text-[11px] sm:text-xs text-white/70">
                      2026-1학기 사물함 대여
                    </span>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}

