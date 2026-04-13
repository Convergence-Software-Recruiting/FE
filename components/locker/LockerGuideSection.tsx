"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── 타입 ─────────────────────────────────────────────────────

interface GuideStep {
  step: string;
  title: string;
  description: string;
  note?: string;
  noteDetail?: string;
  imagePath: string;
  alt: string;
}

// ── 데이터 ───────────────────────────────────────────────────

const SUMMARY_STEPS = [
  { num: 1, text: "메인페이지 접속" },
  { num: 2, text: "'사물함 대여 서비스' 클릭" },
  { num: 3, text: "초록색(신청 가능) 사물함 번호 선택" },
  { num: 4, text: "신청 완료 후 3일 이내 3,000원 입금" },
];

const NOTICES = [
  "신청 기간 내에만 신청 가능합니다.",
  "기한 내 미입금 시 신청이 자동 취소됩니다.",
  "신청 과정 중 문제가 발생할 경우, 인스타그램 @mju_build 로 DM 주세요.",
];

const GUIDE_STEPS: GuideStep[] = [
  {
    step: "01",
    title: "초록색(신청가능) 사물함 클릭",
    description:
      "배치도에서 초록색으로 표시된 신청 가능한 사물함 번호를 클릭합니다.",
    imagePath: "/images/locker/guide-step-2.png",
    alt: "신청 가능한 초록색 사물함 선택 화면",
  },
  {
    step: "02",
    title: "신청서 작성 후 '신청하기' 클릭",
    description:
      "이름·학번·연락처·이메일·학년·전공을 입력하고 '신청하기'를 클릭합니다.",
    note: "※ 반드시 사용 중인 이메일을 입력해주세요.",
    noteDetail:
      "상태 안내, 입금 정보 및 사물함 비밀번호가 이메일로 발송됩니다.",
    imagePath: "/images/locker/guide-step-3.png",
    alt: "사물함 신청서 작성 및 신청하기 버튼 화면",
  },
];

// ── 사물함 위치 사진 툴팁 ──────────────────────────────────────
//   PC  : 마우스 hover → 드롭다운 자동 열림/닫힘
//   모바일: 탭 → 토글

export function LockerPhotoTooltip({ large = false }: { large?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouch(
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  const updatePos = () => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 8, left: r.left });
  };

  const hoverProps = isTouch
    ? {}
    : {
        onMouseEnter: () => {
          updatePos();
          setOpen(true);
        },
        onMouseLeave: () => setOpen(false),
      };

  return (
    <div ref={wrapRef} className="inline-flex" {...hoverProps}>
      <button
        type="button"
        onClick={() => {
          updatePos();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-label="사물함 위치 사진 보기"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 transition-colors duration-200 hover:border-gold-400/40 hover:bg-white/10"
      >
        <MapPin className="h-4 w-4 flex-shrink-0 text-gold-400" />
        사물함은 어디 있나요?
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/40 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* fixed 패널 — overflow-hidden 부모에서 잘리지 않음 */}
      {pos && (
        <div
          className={cn(
            "fixed z-[2147483647] overflow-hidden rounded-2xl border border-white/15 bg-navy-900 shadow-2xl",
            "max-w-[calc(100vw-2rem)] transition-[opacity,transform] duration-200 ease-out",
            large ? "w-[22rem] sm:w-[640px]" : "w-80 sm:w-[420px]",
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
          )}
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="absolute inset-x-0 top-0 z-10 bg-navy-950/70 px-4 py-2.5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-gold-200">
              종합관 3층 인공지능소프트웨어 융합대학 교학팀 앞
            </p>
          </div>
          {imgError ? (
            <div className="flex h-48 items-center justify-center bg-white/5">
              <span className="text-sm text-white/30">이미지 준비 중</span>
            </div>
          ) : (
            <Image
              src="/images/locker/locker-photo.png"
              alt="실제 사물함 위치 사진"
              width={0}
              height={0}
              sizes={
                large
                  ? "(max-width: 640px) 352px, 640px"
                  : "(max-width: 640px) 320px, 420px"
              }
              quality={95}
              className="w-full h-auto"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── 이미지 (fallback 처리) ────────────────────────────────────

function GuideStepImage({
  src,
  alt,
  natural = false,
}: {
  src: string;
  alt: string;
  natural?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center border border-white/10 bg-white/5"
        role="img"
        aria-label={alt}
      >
        <span className="text-sm text-white/30">이미지 준비 중</span>
      </div>
    );
  }

  if (natural) {
    return (
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        quality={95}
        className="w-full h-auto"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-white/5">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        quality={90}
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────

export function LockerGuideSection() {
  return (
    <section aria-labelledby="guide-heading" className="py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 요약 안내 카드 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-5">
            <h2
              id="guide-heading"
              className="text-base sm:text-lg font-bold text-white"
            >
              📦 사물함 대여 신청 방법
            </h2>

            {/* 요약 단계 */}
            <ol className="space-y-2.5">
              {SUMMARY_STEPS.map(({ num, text }) => (
                <li key={num} className="flex items-start gap-3">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/20 border border-gold-400/40 text-xs font-bold text-gold-300">
                    {num}
                  </span>
                  <span className="text-sm text-white/80 leading-relaxed pt-0.5">
                    {text}
                  </span>
                </li>
              ))}
            </ol>

            {/* 주의사항 박스 */}
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 space-y-3">
              <p className="text-sm font-bold text-amber-200">주의사항</p>

              {/* 계좌 강조 박스 */}
              <div className="rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-3">
                <p className="text-sm">
                  <span className="text-white/60">입금 계좌: </span>
                  <span className="font-bold text-gold-200 tracking-wide">
                    토스뱅크 1002-3772-9741 김택동
                  </span>
                </p>
              </div>

              {/* 주의사항 목록 */}
              <ul className="space-y-1.5">
                {NOTICES.map((notice) => (
                  <li
                    key={notice}
                    className="flex items-start gap-2 text-sm text-amber-100/90"
                  >
                    <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {notice}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 상세 화면 안내 카드 */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6 shadow-xl space-y-5">
            <h2 className="text-base sm:text-lg font-bold text-white">
              🔎 상세 신청 화면 안내
            </h2>

            <div className="flex flex-col gap-4">
              {GUIDE_STEPS.map(
                ({ step, description, note, noteDetail, imagePath, alt }) => (
                  <article
                    key={step}
                    className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                  >
                    {/* 스텝 배지 */}
                    <div className="px-4 pt-4 pb-3">
                      <span className="rounded-lg bg-gold-500/20 border border-gold-400/40 px-2.5 py-0.5 text-xs font-bold text-gold-300 tabular-nums tracking-widest">
                        {step}
                      </span>
                    </div>

                    {/* 사진 */}
                    <GuideStepImage src={imagePath} alt={alt} />

                    {/* 구분선 */}
                    <div className="mx-4 border-t border-white/10" />

                    {/* 설명 */}
                    <div className="flex flex-col gap-2 px-4 py-3">
                      <p className="text-sm text-white/70 leading-relaxed">
                        {description}
                      </p>

                      {note && (
                        <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2.5 space-y-1">
                          <p className="text-xs font-semibold text-amber-300">
                            {note}
                          </p>
                          {noteDetail && (
                            <p className="text-xs text-white/60">
                              {noteDetail}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
