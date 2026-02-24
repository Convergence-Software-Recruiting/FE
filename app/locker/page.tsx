'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LockerGrid } from '@/components/locker/LockerGrid';
import { LockerLegend } from '@/components/locker/LockerLegend';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  fetchLockers,
  fetchAvailableLockers,
  fetchLockerConfig,
  createLockerApplication,
} from '@/lib/api/locker';
import type {
  LockerResponse,
  LockerStatus,
  SystemConfigResponse,
  ApplicationCreateRequest,
  Grade,
  Major,
} from '@/lib/types/locker';

// ── 모바일 감지 ────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

// ── 모바일 바텀 시트 ────────────────────────────────────────

const SHEET_STATUS_LABELS: Record<LockerStatus, string> = {
  EMPTY: '신청 가능',
  RESERVED: '승인 대기',
  IN_USE: '사용 중',
  BROKEN: '고장',
  CLOSED: '닫힘',
};

const SHEET_STATUS_COLORS: Record<LockerStatus, string> = {
  EMPTY: 'text-emerald-400',
  RESERVED: 'text-amber-400',
  IN_USE: 'text-blue-400',
  BROKEN: 'text-red-400',
  CLOSED: 'text-gray-400',
};

const SHEET_STATUS_DESCRIPTIONS: Record<LockerStatus, string> = {
  EMPTY: '이 사물함은 현재 신청 가능합니다.',
  RESERVED: '이 사물함은 승인 대기 중입니다.',
  IN_USE: '이 사물함은 현재 사용 중입니다.',
  BROKEN: '이 사물함은 현재 고장 상태입니다.',
  CLOSED: '이 사물함은 현재 이용이 불가합니다.',
};

interface MobileLockerSheetProps {
  locker: LockerResponse;
  isApplicationOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

function MobileLockerSheet({ locker, isApplicationOpen, onClose, onApply }: MobileLockerSheetProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const apply = () => {
    setVisible(false);
    setTimeout(onApply, 280);
  };

  const summary = locker.activeRentalSummary;
  const canApply = locker.status === 'EMPTY' && isApplicationOpen;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* 오버레이 */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={close}
      />

      {/* 시트 */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-white/20 bg-navy-900 px-6 pt-3 pb-10 shadow-2xl transition-transform duration-300 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* 드래그 핸들 */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{locker.number}번 사물함</h2>
          <span className={cn('text-sm font-semibold', SHEET_STATUS_COLORS[locker.status])}>
            {SHEET_STATUS_LABELS[locker.status]}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-white/60">{SHEET_STATUS_DESCRIPTIONS[locker.status]}</p>

        {/* IN_USE 사용자 정보 */}
        {locker.status === 'IN_USE' && summary && (
          <dl className="mt-4 space-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <div className="flex justify-between">
              <dt>사용자</dt>
              <dd className="font-medium text-white">{summary.maskedName}</dd>
            </div>
            <div className="flex justify-between">
              <dt>연락처</dt>
              <dd className="font-medium text-white">{summary.phoneLast4}</dd>
            </div>
            <div className="flex justify-between">
              <dt>대여 기간</dt>
              <dd className="font-medium text-white">
                {summary.rentalStartDate} ~ {summary.rentalEndDate}
              </dd>
            </div>
          </dl>
        )}

        {/* 신청 기간 아님 안내 */}
        {locker.status === 'EMPTY' && !isApplicationOpen && (
          <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-300">
            현재 사물함 신청 기간이 아닙니다.
          </p>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 flex gap-3">
          {canApply ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={close}
                className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                취소
              </Button>
              <Button variant="hero" size="lg" onClick={apply} className="flex-1">
                신청하기
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={close}
              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              닫기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 신청 모달 ────────────────────────────────────────────

const GRADE_LABELS: Record<Grade, string> = {
  GRADE_1: '1학년',
  GRADE_2: '2학년',
  GRADE_3: '3학년',
  GRADE_4: '4학년',
};

const MAJOR_LABELS: Record<Major, string> = {
  CONVERGENCE_SOFTWARE: '융합소프트웨어학부',
  APPLIED_SOFTWARE: '응용소프트웨어전공',
  DATA_SCIENCE: '데이터사이언스전공',
  ARTIFICIAL_INTELLIGENCE: '인공지능전공',
};

interface ApplyModalProps {
  locker: LockerResponse;
  onClose: () => void;
  onSuccess: (lockerNumber: number) => void;
}

type ApplyForm = Omit<ApplicationCreateRequest, 'lockerId' | 'grade' | 'major'> & {
  grade: Grade | '';
  major: Major | '';
};

function ApplyModal({ locker, onClose, onSuccess }: ApplyModalProps) {
  const [form, setForm] = useState<ApplyForm>({
    applicantName: '',
    studentId: '',
    phone: '',
    email: '',
    grade: '',
    major: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [availableLockers, setAvailableLockers] = useState<LockerResponse[]>([]);
  const [selectedLockerId, setSelectedLockerId] = useState(locker.id);

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

  useEffect(() => {
    fetchAvailableLockers()
      .then((list) => {
        setAvailableLockers(list);
        // 클릭한 사물함이 목록에 없으면 첫 번째 항목으로 대체
        if (list.length > 0 && !list.find((l) => l.id === locker.id)) {
          setSelectedLockerId(list[0].id);
        }
      })
      .catch(() => {
        // 조회 실패 시 클릭한 사물함 단독 유지
        setAvailableLockers([locker]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // 전화번호 자동 포맷
      const digits = value.replace(/\D/g, '');
      const formatted = digits
        .replace(/^(\d{3})(\d{1,4})/, '$1-$2')
        .replace(/^(\d{3}-\d{4})(\d{1,4})/, '$1-$2');
      setForm((prev) => ({ ...prev, phone: formatted }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.grade || !form.major) {
      toast.error('학년과 전공을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createLockerApplication({
        lockerId: selectedLockerId,
        applicantName: form.applicantName,
        studentId: form.studentId,
        phone: form.phone,
        email: form.email,
        grade: form.grade,
        major: form.major,
      });
      const selectedNum = availableLockers.find((l) => l.id === selectedLockerId)?.number ?? selectedLockerId;
      toast.success(`${selectedNum}번 사물함 신청이 완료되었습니다.`);
      onSuccess(selectedNum);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { error?: string } } })
        ?.response?.status;
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;

      if (status === 409) {
        toast.error('이미 선택된 사물함입니다. 다른 사물함을 선택해주세요.');
        const selectedNum =
          availableLockers.find((l) => l.id === selectedLockerId)?.number ?? selectedLockerId;
        onSuccess(selectedNum); // 그리드 재조회 후 모달 닫기
      } else if (status === 400) {
        toast.error(message ?? '입력 정보를 확인해주세요.');
      } else {
        toast.error('신청 중 오류가 발생했습니다.');
      }
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
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">사물함 신청</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="사물함 번호">
            {availableLockers.length > 0 ? (
              <select
                value={selectedLockerId}
                onChange={(e) => setSelectedLockerId(Number(e.target.value))}
                disabled={isSubmitting}
                className={inputClass}
              >
                {availableLockers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.number}번
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-white/40">신청 가능한 사물함이 없습니다.</p>
            )}
          </Field>

          <Field label="이름">
            <input
              name="applicantName"
              value={form.applicantName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="홍길동"
              className={inputClass}
            />
          </Field>

          <Field label="학번">
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="60241234"
              className={inputClass}
            />
          </Field>

          <Field label="전화번호">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="010-1234-5678"
              maxLength={13}
              className={inputClass}
            />
          </Field>

          <Field label="이메일">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="example@mju.ac.kr"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-amber-300/90 sm:whitespace-nowrap">
              실제 이메일을 입력해주세요. 비밀번호 및 신청 상태 안내가 해당 이메일로 전달됩니다.
            </p>
          </Field>

          <div className="flex gap-3">
            <Field label="학년" className="flex-1">
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              >
                <option value="">선택하세요</option>
                {(Object.keys(GRADE_LABELS) as Grade[]).map((g) => (
                  <option key={g} value={g}>
                    {GRADE_LABELS[g]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="전공" className="flex-1">
              <select
                name="major"
                value={form.major}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              >
                <option value="">선택하세요</option>
                {(Object.keys(MAJOR_LABELS) as Major[]).map((m) => (
                  <option key={m} value={m}>
                    {MAJOR_LABELS[m]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  신청 처리 중...
                </span>
              ) : (
                '신청하기'
              )}
            </Button>
          </div>
          {isSubmitting && (
            <div className="space-y-2 pt-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 transition-[width] duration-200 ease-out"
                  style={{ width: `${submitProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-white/50">
                신청 정보를 제출하고 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ── IN_USE 상세 팝오버 ────────────────────────────────────

interface InUseDetailModalProps {
  locker: LockerResponse;
  onClose: () => void;
}

function InUseDetailModal({ locker, onClose }: InUseDetailModalProps) {
  const summary = locker.activeRentalSummary;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">{locker.number}번 사물함</h2>
        <p className="mt-1 text-sm text-amber-400">사용 중</p>
        {summary ? (
          <dl className="mt-4 space-y-2 text-sm text-white/80">
            <div className="flex justify-between">
              <dt>사용자</dt>
              <dd className="text-white">{summary.maskedName}</dd>
            </div>
            <div className="flex justify-between">
              <dt>연락처</dt>
              <dd className="text-white">{getPhoneLast4(summary.phoneLast4)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>대여 기간</dt>
              <dd className="text-white">
                {summary.rentalStartDate} ~ {summary.rentalEndDate}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-white/60">상세 정보 없음</p>
        )}
        <Button
          variant="outline"
          size="lg"
          onClick={onClose}
          className="mt-6 w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
        >
          닫기
        </Button>
      </div>
    </div>
  );
}

// ── 헬퍼 ────────────────────────────────────────────────

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-400';

function getPhoneLast4(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '*');
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-white/70">{label}</label>
      {children}
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────

export default function LockerPage() {
  const isMobile = useIsMobile();
  const [lockers, setLockers] = useState<LockerResponse[]>([]);
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocker, setSelectedLocker] = useState<LockerResponse | null>(null);
  const [mobileSheet, setMobileSheet] = useState<LockerResponse | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<{
    lockerNumber: number;
    depositDueDate: string;
    depositAccount: string;
    depositAmount: number;
  } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [lockersData, configData] = await Promise.all([
        fetchLockers(),
        fetchLockerConfig().catch(() => null),
      ]);
      setLockers(lockersData);
      setConfig(configData);
    } catch {
      setError('사물함 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCellClick = (locker: LockerResponse) => {
    if (isMobile) {
      setMobileSheet(locker);
    } else {
      setSelectedLocker(locker);
    }
  };

  const handleModalClose = () => setSelectedLocker(null);

  const handleApplicationSuccess = async (lockerNumber: number) => {
    setSelectedLocker(null);
    await loadData();

    if (
      config?.depositDueDays == null ||
      config.depositAmount == null ||
      !config.depositAccount
    ) {
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + config.depositDueDays);
    const yyyy = dueDate.getFullYear();
    const mm = String(dueDate.getMonth() + 1).padStart(2, '0');
    const dd = String(dueDate.getDate()).padStart(2, '0');

    setPaymentNotice({
      lockerNumber,
      depositDueDate: `${yyyy}-${mm}-${dd}`,
      depositAccount: config.depositAccount,
      depositAmount: config.depositAmount,
    });
  };

  const isApplicationOpen = config?.applicationOpen ?? false;

  const stats = lockers.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <p className="text-white/70">사물함 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-hero px-4 py-12 font-pretendard">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-white">사물함 대여</h1>
          {config && (
            <p className="mt-1 text-sm text-white/60">
              사용 가능 기간:{' '}
              <span className="font-medium text-white/80">
                {config.semesterStartDate ?? '—'} ~ {config.rentalEndDate}
              </span>
            </p>
          )}
        </div>

        {/* 신청 기간 배너 */}
        {config && (
          <div
            className={`rounded-xl border px-5 py-4 ${
              isApplicationOpen
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                : 'border-white/10 bg-white/5 text-white/50'
            }`}
          >
            {isApplicationOpen ? (
              <p className="text-sm font-medium">
                신청 기간:{' '}
                <span className="font-bold">
                  {config.applicationStartDate} ~ {config.applicationEndDate}
                </span>
              </p>
            ) : (
              <p className="text-sm">현재 사물함 신청 기간이 아닙니다.</p>
            )}
          </div>
        )}

        {/* 입금 안내 */}
        {config?.depositAccount && config.depositAmount != null && config.depositDueDays != null && (
          <div className="rounded-xl border border-gold-400/30 bg-gold-400/10 px-5 py-4 text-gold-100">
            <p className="text-sm font-semibold">입금 안내</p>
            <p className="mt-1 text-sm">
              신청 완료 후 <span className="font-bold">{config.depositDueDays}일 이내</span>에{' '}
              <span className="font-bold">{config.depositAmount.toLocaleString()}원</span>을
              아래 계좌로 입금해주세요.
            </p>
            <p className="mt-1 text-sm">
              입금 계좌: <span className="font-bold">{config.depositAccount}</span>
            </p>
          </div>
        )}

        {/* 통계 요약 */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: '신청 가능', key: 'EMPTY', color: 'text-emerald-400' },
            { label: '승인 대기', key: 'RESERVED', color: 'text-amber-400' },
            { label: '사용 중', key: 'IN_USE', color: 'text-blue-400' },
            { label: '고장', key: 'BROKEN', color: 'text-red-400' },
            { label: '닫힘', key: 'CLOSED', color: 'text-gray-400' },
          ].map(({ label, key, color }) => (
            <div
              key={key}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center"
            >
              <p className={`text-xl font-bold ${color}`}>{stats[key] ?? 0}</p>
              <p className="text-xs text-white/60">{label}</p>
            </div>
          ))}
        </div>

        {/* 그리드 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">사물함 배치도</h2>
            <div className="text-right">
              <p className="text-xs text-white/50">실제 위치 기준</p>
              <span className="text-xs text-white/40">총 {lockers.length}칸</span>
            </div>
          </div>
          <LockerGrid lockers={lockers} onCellClick={handleCellClick} />
        </div>

        {/* 범례 */}
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <LockerLegend />
          {isApplicationOpen && (
            <p className="mt-2 text-xs text-white/40">
              초록색 사물함을 클릭하면 신청할 수 있습니다.
            </p>
          )}
        </div>
      </div>

      {/* 모달 */}
      {selectedLocker?.status === 'EMPTY' && isApplicationOpen && (
        <ApplyModal
          locker={selectedLocker}
          onClose={handleModalClose}
          onSuccess={handleApplicationSuccess}
        />
      )}
      {selectedLocker?.status === 'EMPTY' && !isApplicationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={handleModalClose}
        >
          <div className="rounded-2xl border border-white/20 bg-navy-900 p-6 text-center shadow-2xl">
            <p className="text-white">현재 신청 기간이 아닙니다.</p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleModalClose}
              className="mt-4 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              닫기
            </Button>
          </div>
        </div>
      )}
      {selectedLocker?.status === 'IN_USE' && (
        <InUseDetailModal locker={selectedLocker} onClose={handleModalClose} />
      )}
      {/* 모바일 바텀 시트 */}
      {mobileSheet && (
        <MobileLockerSheet
          locker={mobileSheet}
          isApplicationOpen={isApplicationOpen}
          onClose={() => setMobileSheet(null)}
          onApply={() => {
            const target = mobileSheet;
            setMobileSheet(null);
            setSelectedLocker(target);
          }}
        />
      )}

      {paymentNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">입금 안내</h2>
            <p className="mt-1 text-sm text-white/70">
              {paymentNotice.lockerNumber}번 사물함 신청이 접수되었습니다.
            </p>
            <dl className="mt-4 space-y-2 text-sm text-white/80">
              <div className="flex justify-between gap-4">
                <dt>입금 기한</dt>
                <dd className="text-white">{paymentNotice.depositDueDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>입금 계좌</dt>
                <dd className="text-white">{paymentNotice.depositAccount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>입금 금액</dt>
                <dd className="text-white">{paymentNotice.depositAmount.toLocaleString()}원</dd>
              </div>
            </dl>
            <Button
              variant="hero"
              size="lg"
              onClick={() => setPaymentNotice(null)}
              className="mt-6 w-full"
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
