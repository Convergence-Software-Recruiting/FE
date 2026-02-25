'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LockerGrid } from '@/components/locker/LockerGrid';
import { LockerLegend } from '@/components/locker/LockerLegend';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { gradientFooter } from '@/lib/constants/colors';
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
import {
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Eye,
} from 'lucide-react';

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

// ── 상태 설정 ────────────────────────────────────────────

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
  CLOSED: 'text-white/40',
};

const SHEET_STATUS_DESCRIPTIONS: Record<LockerStatus, string> = {
  EMPTY: '이 사물함은 지금 신청할 수 있습니다. 아래 버튼을 눌러 대여를 신청하세요.',
  RESERVED: '이 사물함은 현재 승인 대기 중입니다. 관리자가 확인 후 처리할 예정입니다.',
  IN_USE: '이 사물함은 현재 사용 중입니다. 대여 기간이 끝나면 다시 신청할 수 있어요.',
  BROKEN: '이 사물함은 현재 점검 중입니다. 수리 완료 후 신청이 가능해집니다.',
  CLOSED: '이 사물함은 이번 학기에 운영하지 않습니다.',
};

// ── 모바일 바텀 시트 ────────────────────────────────────────

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
      <div
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={close}
      />

      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-white/15 bg-navy-900 px-6 pt-3 pb-10 shadow-2xl transition-transform duration-300 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-bold text-white">{locker.number}번 사물함</h2>
          <span className={cn('text-sm font-semibold', SHEET_STATUS_COLORS[locker.status])}>
            {SHEET_STATUS_LABELS[locker.status]}
          </span>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          {SHEET_STATUS_DESCRIPTIONS[locker.status]}
        </p>

        {locker.status === 'IN_USE' && summary && (
          <dl className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            <div className="flex justify-between">
              <dt className="text-white/60">사용자</dt>
              <dd className="font-medium text-white">{summary.maskedName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">연락처</dt>
              <dd className="font-medium text-white">{summary.phoneLast4}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">대여 기간</dt>
              <dd className="font-medium text-white">
                {summary.rentalStartDate} ~ {summary.rentalEndDate}
              </dd>
            </div>
          </dl>
        )}

        {locker.status === 'EMPTY' && !isApplicationOpen && (
          <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
            <p className="text-sm text-amber-300">현재 사물함 신청 기간이 아닙니다.</p>
          </div>
        )}

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

const inputClass =
  'w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2.5 text-sm text-navy-900 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400/60 disabled:bg-white/80 disabled:text-navy-600 transition-all duration-150';

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-white/70 tracking-wide uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

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
    if (!isSubmitting) { setSubmitProgress(0); return; }
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
        if (list.length > 0 && !list.find((l) => l.id === locker.id)) {
          setSelectedLockerId(list[0].id);
        }
      })
      .catch(() => { setAvailableLockers([locker]); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
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
    if (!form.grade || !form.major) { toast.error('학년과 전공을 선택해주세요.'); return; }
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
      const status = (err as { response?: { status?: number; data?: { error?: string } } })?.response?.status;
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      if (status === 409) {
        toast.error('이미 선택된 사물함입니다. 다른 사물함을 선택해주세요.');
        const selectedNum = availableLockers.find((l) => l.id === selectedLockerId)?.number ?? selectedLockerId;
        onSuccess(selectedNum);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-navy-900 shadow-2xl overflow-hidden">
        {/* 모달 헤더 */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">사물함 대여 신청</h2>
              <p className="text-xs text-white/60 mt-0.5">아래 정보를 정확히 입력해 주세요.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
              <p className="text-sm text-white/40 py-2">신청 가능한 사물함이 없습니다.</p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="이름">
              <input name="applicantName" value={form.applicantName} onChange={handleChange}
                required disabled={isSubmitting} placeholder="홍길동" className={inputClass} />
            </Field>
            <Field label="학번">
              <input name="studentId" value={form.studentId} onChange={handleChange}
                required disabled={isSubmitting} placeholder="60241234" className={inputClass} />
            </Field>
          </div>

          <Field label="전화번호">
            <input name="phone" value={form.phone} onChange={handleChange}
              required disabled={isSubmitting} placeholder="010-1234-5678" maxLength={13} className={inputClass} />
          </Field>

          <Field label="이메일">
            <input name="email" type="email" value={form.email} onChange={handleChange}
              required disabled={isSubmitting} placeholder="example@mju.ac.kr" className={inputClass} />
            <p className="mt-1.5 text-xs text-amber-300/90 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              실제 이메일을 입력해주세요. 비밀번호 및 신청 상태 안내가 해당 이메일로 전달됩니다.
            </p>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="학년">
              <select name="grade" value={form.grade} onChange={handleChange}
                required disabled={isSubmitting} className={inputClass}>
                <option value="">선택</option>
                {(Object.keys(GRADE_LABELS) as Grade[]).map((g) => (
                  <option key={g} value={g}>{GRADE_LABELS[g]}</option>
                ))}
              </select>
            </Field>
            <Field label="전공">
              <select name="major" value={form.major} onChange={handleChange}
                required disabled={isSubmitting} className={inputClass}>
                <option value="">선택</option>
                {(Object.keys(MAJOR_LABELS) as Major[]).map((m) => (
                  <option key={m} value={m}>{MAJOR_LABELS[m]}</option>
                ))}
              </select>
            </Field>
          </div>

          {isSubmitting && (
            <div className="space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-300 transition-[width] duration-200 ease-out"
                  style={{ width: `${submitProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-white/50">신청 정보를 제출하고 있습니다…</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isSubmitting}
              className="flex-1 border-white/25 text-white/80 hover:bg-white/10 hover:text-white">
              취소
            </Button>
            <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  신청 처리 중…
                </span>
              ) : '신청하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 사용 중 상세 모달 ──────────────────────────────────────

interface InUseDetailModalProps { locker: LockerResponse; onClose: () => void; }

function getPhoneLast4(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '*');
}

function InUseDetailModal({ locker, onClose }: InUseDetailModalProps) {
  const summary = locker.activeRentalSummary;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-navy-900 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{locker.number}번 사물함</h2>
            <p className="text-xs text-blue-400 font-semibold mt-0.5">사용 중</p>
          </div>
        </div>
        {summary ? (
          <dl className="mt-2 space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/60">사용자</dt>
              <dd className="font-medium text-white">{summary.maskedName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">연락처</dt>
              <dd className="font-medium text-white">{getPhoneLast4(summary.phoneLast4)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/60">대여 기간</dt>
              <dd className="font-medium text-white">{summary.rentalStartDate} ~ {summary.rentalEndDate}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-white/60">상세 정보가 없습니다.</p>
        )}
        <Button variant="outline" size="lg" onClick={onClose}
          className="mt-5 w-full border-white/25 text-white/80 hover:bg-white/10 hover:text-white">
          닫기
        </Button>
      </div>
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
  const [showLockerPhoto, setShowLockerPhoto] = useState(false);

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

  useEffect(() => { loadData(); }, [loadData]);

  const handleCellClick = (locker: LockerResponse) => {
    if (isMobile) setMobileSheet(locker);
    else setSelectedLocker(locker);
  };

  const handleModalClose = () => setSelectedLocker(null);

  const handleApplicationSuccess = async (lockerNumber: number) => {
    setSelectedLocker(null);
    await loadData();
    if (config?.depositDueDays == null || config.depositAmount == null || !config.depositAccount) return;
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

  const stats = lockers.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: gradientFooter }}
      >
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-gold-400 animate-spin mx-auto" />
          <p className="text-white/70 text-sm">사물함 정보를 불러오는 중…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: gradientFooter }}
      >
        <div className="text-center space-y-4 max-w-sm mx-auto px-4">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <p className="text-white font-semibold">정보를 불러오지 못했습니다</p>
          <p className="text-white/60 text-sm">{error}</p>
          <Button variant="heroOutline" size="lg" onClick={() => { setError(null); setIsLoading(true); loadData(); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900">
      {/* ── 히어로 헤더 ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: gradientFooter }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-navy-800/40 to-navy-950/60 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-56 h-56 bg-gold-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-navy-400 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-start mb-4">
              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                aria-label="메인으로 돌아가기"
                className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/25 w-9 h-9 sm:w-10 sm:h-10 text-white/80 hover:bg-white/15 hover:border-gold-400/70 hover:text-gold-300 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 backdrop-blur-md">
                  <span className="inline-flex h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                  <span className="text-xs sm:text-sm text-white/80 font-medium">
                    융합소프트웨어학부 전용 사물함
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className={`font-extrabold text-white leading-tight ${isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
                    사물함 대여 ·{' '}
                    <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
                      Locker
                    </span>
                  </h1>
                  <button
                    type="button"
                    onClick={() => setShowLockerPhoto(true)}
                    aria-label="사물함 실제 사진 보기"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/25 w-8 h-8 text-white/80 hover:bg-white/15 hover:border-gold-400/70 hover:text-gold-300 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/70">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>종합관 3층 S1353 앞</span>
                  </div>
                  {config?.semesterStartDate && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>
                        {config.semesterStartDate} ~ {config.rentalEndDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 통계 카드 */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { label: '신청 가능', key: 'EMPTY', color: 'text-emerald-300', bg: 'bg-emerald-400/10 border-emerald-400/30' },
                  { label: '승인 대기', key: 'RESERVED', color: 'text-amber-300', bg: 'bg-amber-400/10 border-amber-400/30' },
                  { label: '사용 중',  key: 'IN_USE',   color: 'text-blue-300',   bg: 'bg-blue-400/10 border-blue-400/30' },
                  { label: '고장',     key: 'BROKEN',   color: 'text-rose-300',   bg: 'bg-rose-400/10 border-rose-400/30' },
                ].map(({ label, key, color, bg }) => (
                  <div key={key} className={`rounded-2xl border px-4 py-2.5 text-center min-w-[64px] ${bg}`}>
                    <p className={`text-lg sm:text-xl font-bold ${color}`}>{stats[key] ?? 0}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 본문 ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* 신청 기간 배너 */}
            {config && (
              <div
                className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${
                  isApplicationOpen
                    ? 'border-emerald-400/40 bg-emerald-400/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {isApplicationOpen ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-200 font-medium">
                      신청 기간 운영 중&nbsp;
                      <span className="font-bold text-emerald-100">
                        {config.applicationStartDate} ~ {config.applicationEndDate}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-white/40 flex-shrink-0" />
                    <p className="text-sm text-white/50">현재 사물함 신청 기간이 아닙니다.</p>
                  </>
                )}
              </div>
            )}

            {/* 입금 안내 배너 */}
            {config?.depositAccount && config.depositAmount != null && config.depositDueDays != null && (
              <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 px-5 py-4 space-y-1">
                <p className="text-sm font-bold text-gold-200">입금 안내</p>
                <p className="text-sm text-gold-100/90">
                  신청 완료 후{' '}
                  <span className="font-bold">{config.depositDueDays}일 이내</span>에{' '}
                  <span className="font-bold">{config.depositAmount.toLocaleString()}원</span>을
                  아래 계좌로 입금해주세요.
                </p>
                <p className="text-sm text-gold-100/90">
                  입금 계좌:{' '}
                  <span className="font-bold tracking-wide">{config.depositAccount}</span>
                </p>
              </div>
            )}

            {/* 사물함 그리드 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">사물함 배치도</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    실제 위치 기준 · 총 {lockers.length}칸
                  </p>
                </div>
                {isApplicationOpen && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    신청 가능
                  </div>
                )}
              </div>
              <LockerGrid lockers={lockers} onCellClick={handleCellClick} />
            </div>

            {/* 범례 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 space-y-3">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wide">범례</p>
              <LockerLegend />
              {isApplicationOpen && (
                <p className="text-xs text-white/40">
                  연두색(신청 가능) 사물함을 클릭하면 대여 신청이 가능합니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 모달 / 시트 ─────────────────────────────────────── */}
      {selectedLocker?.status === 'EMPTY' && isApplicationOpen && (
        <ApplyModal locker={selectedLocker} onClose={handleModalClose} onSuccess={handleApplicationSuccess} />
      )}
      {selectedLocker?.status === 'EMPTY' && !isApplicationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={handleModalClose}
        >
          <div className="rounded-3xl border border-white/15 bg-navy-900 p-6 text-center shadow-2xl max-w-sm w-full">
            <Clock className="w-10 h-10 text-white/40 mx-auto mb-3" />
            <p className="text-white font-semibold">현재 신청 기간이 아닙니다.</p>
            <p className="text-white/60 text-sm mt-1 mb-5">신청 기간이 되면 다시 확인해 주세요.</p>
            <Button variant="outline" size="lg" onClick={handleModalClose}
              className="w-full border-white/25 text-white/80 hover:bg-white/10 hover:text-white">
              닫기
            </Button>
          </div>
        </div>
      )}
      {selectedLocker?.status === 'IN_USE' && (
        <InUseDetailModal locker={selectedLocker} onClose={handleModalClose} />
      )}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-navy-900 shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">입금 안내</h2>
                <p className="text-xs text-white/60 mt-0.5">
                  {paymentNotice.lockerNumber}번 사물함 신청이 접수되었습니다.
                </p>
              </div>
            </div>
            <dl className="px-6 py-5 space-y-3 text-sm">
              {[
                { label: '입금 기한', value: paymentNotice.depositDueDate },
                { label: '입금 계좌', value: paymentNotice.depositAccount },
                { label: '입금 금액', value: `${paymentNotice.depositAmount.toLocaleString()}원` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5">
                  <dt className="text-white/60">{label}</dt>
                  <dd className="font-bold text-white text-right">{value}</dd>
                </div>
              ))}
              <p className="text-xs text-amber-300/90 flex items-center gap-1 pt-1">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                입금 기한 내 미입금 시 예약이 자동 취소될 수 있습니다.
              </p>
            </dl>
            <div className="px-6 pb-6">
              <Button variant="hero" size="lg" onClick={() => setPaymentNotice(null)} className="w-full">
                확인했습니다
              </Button>
            </div>
          </div>
        </div>
      )}
      {showLockerPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLockerPhoto(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/15 bg-navy-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white">
                사물함 실제 위치 사진
              </h2>
              <button
                type="button"
                onClick={() => setShowLockerPhoto(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                닫기
              </button>
            </div>
            <div className="p-6 text-center text-white/80 text-sm sm:text-base">
              실제 사물함 사진을 이 영역에 배치하면 됩니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
