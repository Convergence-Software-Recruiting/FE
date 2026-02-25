'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { LockerGrid } from '@/components/locker/LockerGrid';
import { LockerLegend } from '@/components/locker/LockerLegend';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Button } from '@/components/ui/button';
import {
  fetchAdminLockers,
  fetchLockerStatistics,
  changeLockerStatus,
  openAllLockers,
  closeSemester,
  fetchAdminApplications,
  approveApplication,
  rejectApplication,
  returnRental,
  fetchActiveRentals,
  fetchExpiringRentals,
  getRentalHistory,
  fetchAdminConfig,
  createSemesterConfig,
  openApplicationPeriod,
  closeApplicationPeriod,
  type PageResponse,
} from '@/lib/api/adminLocker';
import type {
  LockerResponse,
  LockerStatus,
  LockerStatisticsResponse,
  ApplicationResponse,
  RentalResponse,
  RentalHistoryResponse,
  ReturnReason,
  SystemConfigResponse,
  SystemConfigCreateRequest,
  Grade,
  Major,
} from '@/lib/types/locker';
import { cn } from '@/lib/utils';

// ── 레이블 ────────────────────────────────────────────────

const STATUS_LABELS: Record<LockerStatus, string> = {
  EMPTY: '신청 가능',
  RESERVED: '승인 대기',
  IN_USE: '사용 중',
  BROKEN: '고장',
  CLOSED: '닫힘',
};

const GRADE_LABELS: Record<Grade, string> = {
  GRADE_1: '1학년',
  GRADE_2: '2학년',
  GRADE_3: '3학년',
  GRADE_4: '4학년',
};

const MAJOR_LABELS: Record<Major, string> = {
  CONVERGENCE_SOFTWARE: '융합소프트웨어',
  APPLIED_SOFTWARE: '응용소프트웨어',
  DATA_SCIENCE: '데이터사이언스',
  ARTIFICIAL_INTELLIGENCE: '인공지능',
};

// ── 상태 변경 모달 ─────────────────────────────────────────

type ChangeableStatus = 'EMPTY' | 'CLOSED' | 'BROKEN';

interface StatusChangeModalProps {
  locker: LockerResponse;
  onClose: () => void;
  onSuccess: () => void;
}

function StatusChangeModal({ locker, onClose, onSuccess }: StatusChangeModalProps) {
  const [targetStatus, setTargetStatus] = useState<ChangeableStatus>('EMPTY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CHANGEABLE: ChangeableStatus[] = ['EMPTY', 'CLOSED', 'BROKEN'];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await changeLockerStatus(locker.id, targetStatus);
      toast.success(`${locker.number}번 사물함 상태가 "${STATUS_LABELS[targetStatus]}"로 변경되었습니다.`);
      onSuccess();
    } catch {
      toast.error('상태 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">
          {locker.number}번 사물함 관리
        </h2>
        <p className="mt-1 text-sm text-white/60">
          현재 상태: <span className="text-white">{STATUS_LABELS[locker.status]}</span>
        </p>

        {locker.status === 'IN_USE' && locker.activeRentalSummary && (
          <div className="mt-3 rounded-lg bg-white/5 px-4 py-3 text-sm text-white/80">
            <p>사용자: {locker.activeRentalSummary.maskedName}</p>
            <p>연락처: {getPhoneLast4(locker.activeRentalSummary.phoneLast4)}</p>
            <p className="mt-1 text-xs text-amber-400">
              상태 변경 시 강제 반납됩니다.
            </p>
          </div>
        )}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-white/70">변경할 상태</p>
          <div className="flex gap-2">
            {CHANGEABLE.map((s) => (
              <button
                key={s}
                onClick={() => setTargetStatus(s)}
                className={cn(
                  'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                  targetStatus === s
                    ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                    : 'border-white/10 text-white/60 hover:border-white/30'
                )}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white"
          >
            취소
          </Button>
          <Button variant="hero" size="lg" onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── 신청 거절 모달 ─────────────────────────────────────────

interface RejectModalProps {
  application: ApplicationResponse;
  onClose: () => void;
  onSuccess: () => void;
}

function RejectModal({ application, onClose, onSuccess }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setSubmitProgress(0);
      return;
    }

    let current = 12;
    setSubmitProgress(current);

    const timer = window.setInterval(() => {
      const remain = 92 - current;
      current = Math.min(current + Math.max(1, remain * 0.18), 92);
      setSubmitProgress(Math.round(current));
    }, 180);

    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('거절 사유를 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await rejectApplication(application.id, reason);
      toast.success('신청이 거절되었습니다.');
      onSuccess();
    } catch {
      toast.error('거절 처리에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">신청 거절</h2>
        <p className="mt-1 text-sm text-white/60">
          {application.applicantName} · {application.lockerNumber}번 사물함
        </p>
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-white/70">거절 사유</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            placeholder="보증금 미납"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="lg" onClick={onClose} disabled={isSubmitting} className="flex-1">
            취소
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                거절 처리 중...
              </span>
            ) : (
              '거절'
            )}
          </Button>
        </div>
        {isSubmitting && (
          <div className="mt-3 space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500 transition-[width] duration-200 ease-out"
                style={{ width: `${submitProgress}%` }}
              />
            </div>
            <p className="text-center text-xs text-white/50">거절 처리를 진행하고 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 반납 처리 모달 ─────────────────────────────────────────

interface ReturnModalProps {
  rental: RentalResponse;
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnModal({ rental, onClose, onSuccess }: ReturnModalProps) {
  const [reason, setReason] = useState<ReturnReason>('ADMIN_FORCE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const REASONS: { value: ReturnReason; label: string }[] = [
    { value: 'ADMIN_FORCE', label: '관리자 반납' },
    { value: 'BROKEN_FORCE', label: '고장 반납' },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await returnRental(rental.id, reason);
      toast.success(`${rental.lockerNumber}번 사물함이 반납 처리되었습니다.`);
      onSuccess();
    } catch {
      toast.error('반납 처리에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">수동 반납</h2>
        <p className="mt-1 text-sm text-white/60">
          {rental.lockerNumber}번 사물함 · {rental.renterName}
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-white/70">반납 사유</p>
          <div className="flex gap-2">
            {REASONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setReason(value)}
                className={cn(
                  'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                  reason === value
                    ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                    : 'border-white/10 text-white/60 hover:border-white/30'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="lg" onClick={onClose} disabled={isSubmitting} className="flex-1">
            취소
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
          >
            {isSubmitting ? '처리 중...' : '반납'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── 대여 관리 탭 ─────────────────────────────────────────

type RentalSubTab = 'active' | 'expiring';

interface RentalsTabProps {
  activeRentals: RentalResponse[];
  expiringRentals: RentalResponse[];
  onReturn: (rental: RentalResponse) => void;
  onViewHistory: (rental: RentalResponse) => void;
}

function RentalsTab({ activeRentals, expiringRentals, onReturn, onViewHistory }: RentalsTabProps) {
  const [subTab, setSubTab] = useState<RentalSubTab>('active');
  const rentals = subTab === 'active' ? activeRentals : expiringRentals;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setSubTab('active')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            subTab === 'active' ? 'bg-navy-700 text-white shadow' : 'text-white/50 hover:text-white/80'
          )}
        >
          활성 대여 ({activeRentals.length})
        </button>
        <button
          onClick={() => setSubTab('expiring')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            subTab === 'expiring' ? 'bg-navy-700 text-white shadow' : 'text-white/50 hover:text-white/80'
          )}
        >
          만료 임박 ({expiringRentals.length})
        </button>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        {rentals.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">
            {subTab === 'active' ? '활성 대여가 없습니다.' : '만료 임박 대여가 없습니다.'}
          </p>
        ) : (
          <div className="space-y-2">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-sm">
                  <p className="font-medium text-white">
                    {rental.lockerNumber}번 사물함
                    <span className="ml-2 font-normal text-white/60">{rental.renterName}</span>
                  </p>
                  <p className="text-white/60">
                    {getPhoneLast4(rental.renterPhone)} · {rental.rentalStartDate} ~ {rental.rentalEndDate}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onReturn(rental)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  반납
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewHistory(rental)}
                >
                  상세보기
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── 대여 이력 미리보기 모달 ─────────────────────────────────

interface RentalHistoryPreviewModalProps {
  lockerId: number;
  lockerNumber: number;
  renterName: string;
  onClose: () => void;
}

function RentalHistoryPreviewModal({
  lockerId,
  lockerNumber,
  renterName,
  onClose,
}: RentalHistoryPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState<RentalHistoryResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getRentalHistory({
          lockerId,
          size: 20,
          page: 0,
          sort: 'approvedAt,desc',
        });
        if (!isMounted) return;
        setHistories(data.content);
        setTotalElements(data.totalElements);
      } catch {
        if (!isMounted) return;
        toast.error('대여 이력 조회에 실패했습니다.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [lockerId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">{lockerNumber}번 사물함 이력</h2>
            <p className="mt-1 text-sm text-white/60">현재 사용자: {renterName}</p>
            <p className="text-xs text-white/40">사물함 기준으로 최근 20건을 조회합니다.</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-white/50">이력을 불러오는 중...</p>
        ) : histories.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/40">조회된 이력이 없습니다.</p>
        ) : (
          <div className="mt-5 space-y-2">
            <p className="text-xs text-white/40">총 {totalElements}건 (최근 20건 표시)</p>
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {histories.map((item) => {
                const isReturned = item.returnedAt != null;
                return (
                  <div
                    key={item.rentalId}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">
                        {item.applicantName}
                        <span className="ml-2 text-xs font-normal text-white/50">{item.studentId}</span>
                      </p>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          isReturned ? 'bg-gray-500/30 text-gray-300' : 'bg-blue-500/30 text-blue-300'
                        )}
                      >
                        {isReturned ? '반납 완료' : '사용 중'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/60">
                      {getPhoneLast4(item.renterPhone)} · {item.renterEmail}
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      대여기간: {item.rentalStartDate} ~ {item.rentalEndDate}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      승인일: {formatDateTimeToKorean(item.approvedAt)}
                      {item.returnedAt
                        ? ` · 반납일: ${formatDateTimeToKorean(item.returnedAt)}`
                        : ''}
                      {item.returnReason ? ` · 사유: ${item.returnReason}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 학기 설정 탭 ─────────────────────────────────────────

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-400';

/** 입력 중 YYYY-MM-DD 자동 포맷 */
function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function getPhoneLast4(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '*');
}

function maskName(name: string): string {
  const chars = Array.from(name);
  if (chars.length <= 1) return name;
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${'*'.repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

/** ISO datetime 문자열에서 YYYY-MM-DD HH시 mm분 ss초 형태로 변환 */
function formatDateTimeToKorean(datetime: string): string {
  const match = datetime.match(/(\d{4}-\d{2}-\d{2})(?:T|\s)(\d{2}):(\d{2}):(\d{2})/);
  if (!match) return datetime;
  return `${match[1]} ${match[2]}시 ${match[3]}분 ${match[4]}초`;
}

interface ConfigTabProps {
  config: SystemConfigResponse | null;
  onRefresh: () => void;
}

function ConfigTab({ config, onRefresh }: ConfigTabProps) {
  const [form, setForm] = useState<SystemConfigCreateRequest>({
    semesterStartDate: '',
    semesterEndDate: '',
    rentalEndDate: '',
    depositAccount: '',
    depositAmount: 5000,
    depositDueDays: 3,
  });
  const [openPeriod, setOpenPeriod] = useState({ startDate: '', endDate: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createSemesterConfig(form);
      toast.success('학기 설정이 생성되었습니다.');
      onRefresh();
    } catch {
      toast.error('학기 설정 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openPeriod.startDate || !openPeriod.endDate) {
      toast.error('신청 시작일과 종료일을 입력해주세요.');
      return;
    }
    setIsOpening(true);
    try {
      await openApplicationPeriod(openPeriod.startDate, openPeriod.endDate);
      toast.success('신청 기간이 오픈되었습니다.');
      onRefresh();
    } catch {
      toast.error('신청 기간 오픈에 실패했습니다.');
    } finally {
      setIsOpening(false);
    }
  };

  const handleClosePeriod = async () => {
    setIsClosing(true);
    try {
      await closeApplicationPeriod();
      toast.success('신청 기간이 마감되었습니다.');
      onRefresh();
    } catch {
      toast.error('신청 기간 마감에 실패했습니다.');
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 현재 설정 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 text-base font-semibold text-white">현재 학기 설정</h2>
        {config ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              { label: '학기 시작', value: config.semesterStartDate ?? '—' },
              { label: '학기 종료', value: config.semesterEndDate },
              { label: '대여 종료일', value: config.rentalEndDate },
              { label: '보증금 계좌', value: config.depositAccount ?? '—' },
              {
                label: '보증금',
                value: config.depositAmount != null
                  ? `${config.depositAmount.toLocaleString()}원`
                  : '—',
              },
              { label: '납부 기한', value: config.depositDueDays != null ? `${config.depositDueDays}일` : '—' },
              {
                label: '신청 기간',
                value: config.applicationOpen
                  ? `${config.applicationStartDate} ~ ${config.applicationEndDate}`
                  : '마감',
              },
              {
                label: '신청 상태',
                value: config.applicationOpen ? '오픈' : '마감',
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-white/50">{label}</dt>
                <dd className={cn('font-medium', config.applicationOpen && label === '신청 상태' ? 'text-emerald-400' : 'text-white')}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-white/40">설정이 없습니다. 아래에서 새로 생성하세요.</p>
        )}
      </div>

      {/* 신청 기간 오픈/마감 */}
      {config && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-base font-semibold text-white">신청 기간 관리</h2>
          {config.applicationOpen ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white/70">
                현재 신청 기간 오픈 중: <span className="text-white">{config.applicationStartDate} ~ {config.applicationEndDate}</span>
              </p>
              <Button
                size="sm"
                onClick={handleClosePeriod}
                disabled={isClosing}
                className="shrink-0 bg-red-500 text-white hover:bg-red-600"
              >
                {isClosing ? '마감 중...' : '신청 마감'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleOpenPeriod} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">시작일</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={openPeriod.startDate}
                  onChange={(e) =>
                    setOpenPeriod((p) => ({ ...p, startDate: formatDate(e.target.value) }))
                  }
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-white/70">종료일</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={openPeriod.endDate}
                  onChange={(e) =>
                    setOpenPeriod((p) => ({ ...p, endDate: formatDate(e.target.value) }))
                  }
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  required
                  className={inputClass}
                />
              </div>
              <Button type="submit" variant="hero" size="sm" disabled={isOpening}>
                {isOpening ? '처리 중...' : '신청 오픈'}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* 새 학기 설정 생성 */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-4 text-base font-semibold text-white">새 학기 설정 생성</h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(
              [
                { label: '학기 시작일', key: 'semesterStartDate' },
                { label: '학기 종료일', key: 'semesterEndDate' },
                { label: '대여 종료일', key: 'rentalEndDate' },
              ] as const
            ).map(({ label, key }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-white/70">{label}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: formatDate(e.target.value) }))
                  }
                  placeholder="YYYY-MM-DD"
                  maxLength={10}
                  required
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/70">보증금 계좌</label>
            <input
              value={form.depositAccount}
              onChange={(e) => setForm((p) => ({ ...p, depositAccount: e.target.value }))}
              placeholder="카카오뱅크 3333-01-1234567"
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">보증금 (원)</label>
              <input
                type="number"
                value={form.depositAmount || ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, depositAmount: e.target.value === '' ? 0 : Number(e.target.value) }))
                }
                required
                min={0}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">납부 기한 (일)</label>
              <input
                type="number"
                value={form.depositDueDays || ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, depositDueDays: e.target.value === '' ? 0 : Number(e.target.value) }))
                }
                required
                min={1}
                className={inputClass}
              />
            </div>
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={isCreating} className="w-full">
            {isCreating ? '생성 중...' : '학기 설정 생성'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────

type TabType = 'grid' | 'applications' | 'rentals' | 'config';

export default function AdminLockerPage() {
  const [lockers, setLockers] = useState<LockerResponse[]>([]);
  const [statistics, setStatistics] = useState<LockerStatisticsResponse | null>(null);
  const [applications, setApplications] = useState<PageResponse<ApplicationResponse> | null>(null);
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('grid');

  // 모달 상태
  const [selectedLocker, setSelectedLocker] = useState<LockerResponse | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ApplicationResponse | null>(null);
  const [openAllConfirm, setOpenAllConfirm] = useState(false);
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [processingApplicationId, setProcessingApplicationId] = useState<number | null>(null);
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [activeRentals, setActiveRentals] = useState<RentalResponse[]>([]);
  const [expiringRentals, setExpiringRentals] = useState<RentalResponse[]>([]);
  const [returnTarget, setReturnTarget] = useState<RentalResponse | null>(null);
  const [historyTarget, setHistoryTarget] = useState<{
    lockerId: number;
    lockerNumber: number;
    renterName: string;
  } | null>(null);

  const lockersForGrid = useMemo(() => {
    if (lockers.length === 0) return lockers;

    const activeRentalByLockerNumber = new Map(
      activeRentals.map((rental) => [rental.lockerNumber, rental])
    );

    return lockers.map((locker) => {
      if (locker.status !== 'IN_USE' || locker.activeRentalSummary) {
        return locker;
      }

      const rental = activeRentalByLockerNumber.get(locker.number);
      if (!rental) return locker;

      return {
        ...locker,
        activeRentalSummary: {
          maskedName: maskName(rental.renterName),
          phoneLast4: getPhoneLast4(rental.renterPhone),
          rentalStartDate: rental.rentalStartDate,
          rentalEndDate: rental.rentalEndDate,
        },
      };
    });
  }, [activeRentals, lockers]);

  useEffect(() => {
    if (processingApplicationId == null) {
      setApplicationProgress(0);
      return;
    }

    let current = 12;
    setApplicationProgress(current);

    const timer = window.setInterval(() => {
      const remain = 92 - current;
      current = Math.min(current + Math.max(1, remain * 0.18), 92);
      setApplicationProgress(Math.round(current));
    }, 180);

    return () => window.clearInterval(timer);
  }, [processingApplicationId]);

  const loadLockers = useCallback(async () => {
    const [lockersData, statsData] = await Promise.all([
      fetchAdminLockers(),
      fetchLockerStatistics(),
    ]);
    setLockers(lockersData);
    setStatistics(statsData);
  }, []);

  const loadApplications = useCallback(async () => {
    const data = await fetchAdminApplications({ status: 'SUBMITTED', size: 50 });
    setApplications(data);
  }, []);

  const loadConfig = useCallback(async () => {
    const data = await fetchAdminConfig().catch(() => null);
    setConfig(data);
  }, []);

  const loadRentals = useCallback(async () => {
    const [active, expiring] = await Promise.all([
      fetchActiveRentals().catch(() => []),
      fetchExpiringRentals().catch(() => []),
    ]);
    setActiveRentals(active);
    setExpiringRentals(expiring);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([loadLockers(), loadApplications(), loadRentals()]);
      } catch {
        toast.error('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [loadLockers, loadApplications, loadRentals]);

  // 학기 설정 탭 진입 시에만 config를 fetch (학기 종료 후 구 설정값 자동 노출 방지)
  useEffect(() => {
    if (activeTab === 'config') {
      loadConfig();
    }
  }, [activeTab, loadConfig]);

  // 일괄 오픈
  const handleOpenAll = async () => {
    setIsActioning(true);
    try {
      const { openedCount } = await openAllLockers();
      toast.success(`${openedCount}개 사물함이 오픈되었습니다.`);
      await loadLockers();
    } catch {
      toast.error('일괄 오픈에 실패했습니다.');
    } finally {
      setIsActioning(false);
      setOpenAllConfirm(false);
    }
  };

  // 학기 종료
  const handleCloseSemester = async () => {
    setIsActioning(true);
    try {
      const { returnedCount } = await closeSemester();
      toast.success(`학기가 종료되었습니다. (${returnedCount}개 반납 처리)`);
      setConfig(null);
      await Promise.all([loadLockers(), loadRentals()]);
    } catch {
      toast.error('학기 종료 처리에 실패했습니다.');
    } finally {
      setIsActioning(false);
      setCloseConfirm(false);
    }
  };

  // 승인
  const handleApprove = async (application: ApplicationResponse) => {
    if (processingApplicationId != null) return;
    setProcessingApplicationId(application.id);
    try {
      await approveApplication(application.id);
      toast.success(`${application.applicantName}님 신청이 승인되었습니다.`);
      await Promise.all([loadLockers(), loadApplications()]);
    } catch {
      toast.error('승인 처리에 실패했습니다.');
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const STAT_ITEMS = [
    { key: 'EMPTY' as LockerStatus, label: '신청 가능', color: 'text-emerald-400' },
    { key: 'RESERVED' as LockerStatus, label: '승인 대기', color: 'text-amber-400' },
    { key: 'IN_USE' as LockerStatus, label: '사용 중', color: 'text-blue-400' },
    { key: 'BROKEN' as LockerStatus, label: '고장', color: 'text-red-400' },
    { key: 'CLOSED' as LockerStatus, label: '닫힘', color: 'text-gray-400' },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <p className="text-white/70">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-hero px-4 py-12 font-pretendard">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white">사물함 관리</h1>
          <div className="flex gap-3">
            <Link href="/admin/locker/history">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white">대여 이력</Button>
            </Link>
            <Button
              variant="heroOutline"
              size="sm"
              onClick={() => setOpenAllConfirm(true)}
            >
              일괄 오픈
            </Button>
            <Button
              size="sm"
              onClick={() => setCloseConfirm(true)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              학기 종료
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        {statistics && (
          <div className="grid grid-cols-5 gap-3">
            {STAT_ITEMS.map(({ key, label, color }) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center"
              >
                <p className={`text-2xl font-bold ${color}`}>{statistics[key] ?? 0}</p>
                <p className="mt-1 text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* 탭 */}
        <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
          {(['grid', 'applications', 'rentals', 'config'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                activeTab === tab
                  ? 'bg-navy-700 text-white shadow'
                  : 'text-white/50 hover:text-white/80'
              )}
            >
              {tab === 'grid'
                ? '배치도'
                : tab === 'applications'
                ? `신청 목록${applications?.totalElements ? ` (${applications.totalElements})` : ''}`
                : tab === 'rentals'
                ? `대여 관리${activeRentals.length ? ` (${activeRentals.length})` : ''}`
                : '학기 설정'}
            </button>
          ))}
        </div>

        {/* 배치도 탭 */}
        {activeTab === 'grid' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">사물함 배치도</h2>
                <span className="text-xs text-white/40">총 {lockers.length}칸 · 클릭하여 상태 변경</span>
              </div>
              <LockerGrid lockers={lockersForGrid} onCellClick={setSelectedLocker} isAdmin />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <LockerLegend />
            </div>
          </div>
        )}

        {/* 대여 관리 탭 */}
        {activeTab === 'rentals' && (
          <RentalsTab
            activeRentals={activeRentals}
            expiringRentals={expiringRentals}
            onReturn={setReturnTarget}
            onViewHistory={(rental) => {
              const locker = lockers.find((l) => l.number === rental.lockerNumber);
              if (!locker) {
                toast.error('사물함 정보를 찾지 못했습니다. 잠시 후 다시 시도해주세요.');
                return;
              }
              setHistoryTarget({
                lockerId: locker.id,
                lockerNumber: rental.lockerNumber,
                renterName: rental.renterName,
              });
            }}
          />
        )}

        {/* 학기 설정 탭 */}
        {activeTab === 'config' && (
          <ConfigTab config={config} onRefresh={loadConfig} />
        )}

        {/* 신청 목록 탭 */}
        {activeTab === 'applications' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 text-base font-semibold text-white">미처리 신청 목록</h2>
            {applications?.content.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">처리할 신청이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {applications?.content.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-white">
                        {app.applicantName}
                        <span className="ml-2 text-white/40 font-normal">
                          {GRADE_LABELS[app.grade]} · {MAJOR_LABELS[app.major]}
                        </span>
                      </p>
                      <p className="text-white/60">
                        {app.lockerNumber}번 사물함 · {getPhoneLast4(app.phone)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() => handleApprove(app)}
                        disabled={processingApplicationId != null}
                      >
                        {processingApplicationId === app.id ? '승인 처리 중...' : '승인'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setRejectTarget(app)}
                        disabled={processingApplicationId != null}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        거절
                      </Button>
                    </div>
                    {processingApplicationId === app.id && (
                      <div className="basis-full space-y-2 pt-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 transition-[width] duration-200 ease-out"
                            style={{ width: `${applicationProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/50">승인 처리를 진행하고 있습니다.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 사물함 상태 변경 모달 */}
      {selectedLocker && (
        <StatusChangeModal
          locker={selectedLocker}
          onClose={() => setSelectedLocker(null)}
          onSuccess={async () => {
            setSelectedLocker(null);
            await loadLockers();
          }}
        />
      )}

      {/* 거절 모달 */}
      {rejectTarget && (
        <RejectModal
          application={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onSuccess={async () => {
            setRejectTarget(null);
            await Promise.all([loadLockers(), loadApplications()]);
          }}
        />
      )}

      {/* 반납 처리 모달 */}
      {returnTarget && (
        <ReturnModal
          rental={returnTarget}
          onClose={() => setReturnTarget(null)}
          onSuccess={async () => {
            setReturnTarget(null);
            await Promise.all([loadLockers(), loadRentals()]);
          }}
        />
      )}

      {/* 대여 이력 미리보기 모달 */}
      {historyTarget && (
        <RentalHistoryPreviewModal
          lockerId={historyTarget.lockerId}
          lockerNumber={historyTarget.lockerNumber}
          renterName={historyTarget.renterName}
          onClose={() => setHistoryTarget(null)}
        />
      )}

      {/* 일괄 오픈 확인 */}
      <ConfirmModal
        open={openAllConfirm}
        title="사물함 일괄 오픈"
        description={'CLOSED 상태의 일반 사물함을 모두 EMPTY로 전환합니다.\n계속하시겠습니까?'}
        confirmText="오픈"
        isLoading={isActioning}
        onConfirm={handleOpenAll}
        onClose={() => setOpenAllConfirm(false)}
      />

      {/* 학기 종료 확인 */}
      <ConfirmModal
        open={closeConfirm}
        title="학기 종료 처리"
        description={'활성 대여를 일괄 반납하고 전체 사물함을 CLOSED로 처리합니다.\n이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?'}
        confirmText="종료"
        isLoading={isActioning}
        onConfirm={handleCloseSemester}
        onClose={() => setCloseConfirm(false)}
      />
    </main>
  );
}
