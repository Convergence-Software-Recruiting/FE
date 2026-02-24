'use client';

import { LockerCell } from './LockerCell';
import type { LockerResponse } from '@/lib/types/locker';

interface LockerGridProps {
  lockers: LockerResponse[];
  onCellClick: (locker: LockerResponse) => void;
  isAdmin?: boolean;
}

export function LockerGrid({ lockers, onCellClick, isAdmin = false }: LockerGridProps) {
  // rowNo, colNo 기준으로 정렬
  const sorted = [...lockers].sort((a, b) =>
    a.rowNo !== b.rowNo ? a.rowNo - b.rowNo : a.colNo - b.colNo
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-14 gap-1.5 min-w-[560px]">
        {sorted.map((locker) => (
          <LockerCell
            key={locker.id}
            locker={locker}
            onClick={onCellClick}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
}
