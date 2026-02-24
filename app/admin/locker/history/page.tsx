'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getRentalHistory, type RentalHistoryParams, type PageResponse } from '@/lib/api/adminLocker';
import type { RentalHistoryResponse, RentalStatus, ReturnReason } from '@/lib/types/locker';
import { cn } from '@/lib/utils';

// ── 상수 ─────────────────────────────────────────────────

const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  AUTO_END: '학기 종료',
  ADMIN_FORCE: '관리자 반납',
  BROKEN_FORCE: '고장 반납',
};

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-400';

// ── SHA-256 헬퍼 ──────────────────────────────────────────

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── 날짜 자동 포맷 ─────────────────────────────────────────

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

// ── 상태 뱃지 ─────────────────────────────────────────────

function StatusBadge({ returned }: { returned: boolean }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        returned
          ? 'bg-gray-500/30 text-gray-300'
          : 'bg-blue-500/30 text-blue-300'
      )}
    >
      {returned ? '반납 완료' : '사용 중'}
    </span>
  );
}

// ── 페이지네이션 ──────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i;
    if (page < 4) return i;
    if (page > totalPages - 4) return totalPages - 7 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="rounded-lg px-3 py-1.5 text-sm text-white/60 disabled:opacity-30 hover:bg-white/10"
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'min-w-[32px] rounded-lg px-2 py-1.5 text-sm transition-colors',
            p === page
              ? 'bg-navy-600 font-bold text-white'
              : 'text-white/60 hover:bg-white/10'
          )}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="rounded-lg px-3 py-1.5 text-sm text-white/60 disabled:opacity-30 hover:bg-white/10"
      >
        →
      </button>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────

interface FilterState {
  from: string;
  to: string;
  lockerId: string;
  studentId: string;   // 입력값 (평문) — 전송 시 SHA-256 해시
  status: RentalStatus | '';
}

const INITIAL_FILTER: FilterState = {
  from: '',
  to: '',
  lockerId: '',
  studentId: '',
  status: '',
};

export default function RentalHistoryPage() {
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);
  const [result, setResult] = useState<PageResponse<RentalHistoryResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const buildParams = async (page = 0): Promise<RentalHistoryParams> => {
    const params: RentalHistoryParams = { page, size: 20, sort: 'approvedAt,desc' };
    if (filter.from) params.from = filter.from;
    if (filter.to) params.to = filter.to;
    if (filter.lockerId) params.lockerId = Number(filter.lockerId);
    if (filter.studentId.trim()) params.studentIdHash = await sha256Hex(filter.studentId.trim());
    if (filter.status) params.status = filter.status;
    return params;
  };

  const fetchHistory = async (page = 0) => {
    setIsLoading(true);
    try {
      const params = await buildParams(page);
      const data = await getRentalHistory(params);
      setResult(data);
      setCurrentPage(page);
    } catch {
      toast.error('이력 조회에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchHistory(0);
  };

  const handleReset = () => {
    setFilter(INITIAL_FILTER);
    setResult(null);
    setCurrentPage(0);
  };

  const setField = (field: keyof FilterState) => (value: string) =>
    setFilter((prev) => ({ ...prev, [field]: value }));

  return (
    <main className="min-h-screen bg-gradient-hero px-4 py-12 font-pretendard">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">대여 이력</h1>
            <p className="mt-1 text-sm text-white/50">조건 필터로 사물함 대여 이력을 조회합니다.</p>
          </div>
          <Link href="/admin/locker">
            <Button variant="outline" size="sm">← 사물함 관리</Button>
          </Link>
        </div>

        {/* 필터 패널 */}
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <h2 className="mb-4 text-base font-semibold text-white">검색 조건</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {/* 기간 from */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">기간 시작</label>
              <input
                type="text"
                inputMode="numeric"
                value={filter.from}
                onChange={(e) => setField('from')(formatDate(e.target.value))}
                placeholder="YYYY-MM-DD"
                maxLength={10}
                className={inputClass}
              />
            </div>

            {/* 기간 to */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">기간 종료</label>
              <input
                type="text"
                inputMode="numeric"
                value={filter.to}
                onChange={(e) => setField('to')(formatDate(e.target.value))}
                placeholder="YYYY-MM-DD"
                maxLength={10}
                className={inputClass}
              />
            </div>

            {/* 사물함 번호 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">사물함 ID</label>
              <input
                type="number"
                value={filter.lockerId}
                onChange={(e) => setField('lockerId')(e.target.value)}
                placeholder="숫자 입력"
                min={1}
                className={inputClass}
              />
            </div>

            {/* 학번 (평문 → 해시) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">
                학번
                <span className="ml-1 text-white/30">(자동 해시)</span>
              </label>
              <input
                type="text"
                value={filter.studentId}
                onChange={(e) => setField('studentId')(e.target.value)}
                placeholder="20240001"
                className={inputClass}
              />
            </div>

            {/* 상태 */}
            <div>
              <label className="mb-1 block text-xs font-medium text-white/70">상태</label>
              <select
                value={filter.status}
                onChange={(e) => setField('status')(e.target.value)}
                className={inputClass}
              >
                <option value="">전체</option>
                <option value="ACTIVE">사용 중</option>
                <option value="RETURNED">반납 완료</option>
              </select>
            </div>
          </div>

          {/* 기간 필터 안내 */}
          <p className="mt-3 text-xs text-white/30">
            기간 겹침 조회: rentalStartDate ≤ 종료 AND rentalEndDate ≥ 시작
          </p>

          <div className="mt-4 flex gap-3">
            <Button type="submit" variant="hero" size="sm" disabled={isLoading}>
              {isLoading ? '조회 중...' : '조회'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </form>

        {/* 결과 */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">
                총{' '}
                <span className="font-bold text-white">{result.totalElements.toLocaleString()}</span>
                건 &middot; {currentPage + 1} / {result.totalPages || 1} 페이지
              </p>
            </div>

            {result.content.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
                <p className="text-sm text-white/40">조회 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs text-white/50">
                        <th className="px-4 py-3 font-medium">사물함</th>
                        <th className="px-4 py-3 font-medium">신청자</th>
                        <th className="px-4 py-3 font-medium">전화번호</th>
                        <th className="px-4 py-3 font-medium">대여 기간</th>
                        <th className="px-4 py-3 font-medium">승인일</th>
                        <th className="px-4 py-3 font-medium">반납일</th>
                        <th className="px-4 py-3 font-medium">반납 사유</th>
                        <th className="px-4 py-3 font-medium">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.content.map((item, idx) => (
                        <tr
                          key={item.rentalId}
                          className={cn(
                            'border-b border-white/5 transition-colors hover:bg-white/5',
                            idx % 2 === 0 ? '' : 'bg-white/[0.02]'
                          )}
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {item.lockerNumber}번
                          </td>
                          <td className="px-4 py-3 text-white">{item.applicantName}</td>
                          <td className="px-4 py-3 text-white/70">{getPhoneLast4(item.renterPhone)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-white/70">
                            {item.rentalStartDate}
                            <span className="mx-1 text-white/30">~</span>
                            {item.rentalEndDate}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-white/70">
                            {item.approvedAt.slice(0, 10)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-white/70">
                            {item.returnedAt ? item.returnedAt.slice(0, 10) : '—'}
                          </td>
                          <td className="px-4 py-3 text-white/70">
                            {item.returnReason
                              ? RETURN_REASON_LABELS[item.returnReason]
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge returned={!!item.returnedAt} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 페이지네이션 */}
            <Pagination
              page={currentPage}
              totalPages={result.totalPages}
              onPageChange={(p) => fetchHistory(p)}
            />
          </div>
        )}
      </div>
    </main>
  );
}
