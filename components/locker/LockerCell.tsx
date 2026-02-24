'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { LockerResponse, LockerStatus } from '@/lib/types/locker';

const STATUS_STYLES: Record<LockerStatus, string> = {
  EMPTY: 'bg-emerald-400 hover:bg-emerald-500 cursor-pointer',
  RESERVED: 'bg-amber-400 cursor-default',
  IN_USE: 'bg-blue-500 hover:bg-blue-600 cursor-pointer',
  BROKEN: 'bg-red-400 cursor-default',
  CLOSED: 'bg-gray-400 cursor-default',
};

const STATUS_TEXT_STYLES: Record<LockerStatus, string> = {
  EMPTY: 'text-navy-900',
  RESERVED: 'text-navy-900',
  IN_USE: 'text-white',
  BROKEN: 'text-white',
  CLOSED: 'text-navy-900',
};

const STATUS_LABELS: Record<LockerStatus, string> = {
  EMPTY: '신청 가능',
  RESERVED: '승인 대기',
  IN_USE: '사용 중',
  BROKEN: '고장',
  CLOSED: '닫힘',
};

const STATUS_LABEL_COLORS: Record<LockerStatus, string> = {
  EMPTY: 'text-emerald-400',
  RESERVED: 'text-amber-400',
  IN_USE: 'text-blue-400',
  BROKEN: 'text-red-400',
  CLOSED: 'text-gray-400',
};

interface LockerCellProps {
  locker: LockerResponse;
  onClick: (locker: LockerResponse) => void;
  isAdmin?: boolean;
}

function getPhoneLast4(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '*');
}

export function LockerCell({ locker, onClick, isAdmin = false }: LockerCellProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = locker.activeRentalSummary;
  const isClickable = isAdmin || locker.status === 'EMPTY' || locker.status === 'IN_USE';

  const handleMouseEnter = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => setTooltipPos(null);

  const handleClick = () => {
    onClick(locker);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'flex aspect-square w-full flex-col items-center justify-center rounded-md shadow-sm transition-all duration-150 active:scale-95',
          STATUS_STYLES[locker.status],
          STATUS_TEXT_STYLES[locker.status],
          !isClickable && !isAdmin && 'opacity-70'
        )}
      >
        <span className="text-xs font-bold leading-none">{locker.number}</span>
      </button>

      {mounted && tooltipPos &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full rounded-xl border border-white/20 bg-navy-900 px-3 py-2.5 shadow-2xl"
            style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
          >
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-white">{locker.number}번 사물함</p>
              <span className={cn('text-xs font-medium', STATUS_LABEL_COLORS[locker.status])}>
                {STATUS_LABELS[locker.status]}
              </span>
            </div>
            {locker.status === 'IN_USE' && summary && (
              <div className="mt-1.5 space-y-0.5 text-xs">
                <p className="text-white/60">
                  사용자{' '}
                  <span className="text-white font-medium">{summary.maskedName}</span>
                </p>
                <p className="text-white/60">
                  연락처{' '}
                  <span className="text-white font-medium">{getPhoneLast4(summary.phoneLast4)}</span>
                </p>
                <p className="text-white/60">
                  기간{' '}
                  <span className="text-white font-medium">
                    {summary.rentalStartDate} ~ {summary.rentalEndDate}
                  </span>
                </p>
              </div>
            )}
            {/* 화살표 */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy-900" />
          </div>,
          document.body
        )}
    </>
  );
}
