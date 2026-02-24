import type { LockerStatus } from '@/lib/types/locker';

const LEGEND_ITEMS: { status: LockerStatus; label: string; colorClass: string }[] = [
  { status: 'EMPTY', label: '신청 가능', colorClass: 'bg-emerald-400' },
  { status: 'RESERVED', label: '승인 대기', colorClass: 'bg-amber-400' },
  { status: 'IN_USE', label: '사용 중', colorClass: 'bg-blue-500' },
  { status: 'BROKEN', label: '고장', colorClass: 'bg-red-400' },
  { status: 'CLOSED', label: '닫힘', colorClass: 'bg-gray-400' },
];

export function LockerLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {LEGEND_ITEMS.map(({ status, label, colorClass }) => (
        <div key={status} className="flex items-center gap-1.5">
          <span className={`h-4 w-4 rounded ${colorClass} inline-block`} />
          <span className="text-sm text-white/80">{label}</span>
        </div>
      ))}
    </div>
  );
}
