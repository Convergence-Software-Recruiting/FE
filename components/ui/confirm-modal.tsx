'use client';

import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-navy-900 p-6 shadow-2xl">
        <h2 id="confirm-modal-title" className="text-lg font-bold text-white">
          {title}
        </h2>
        <p
          id="confirm-modal-description"
          className="mt-3 whitespace-pre-line text-sm text-white/80"
        >
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="heroOutline" size="lg" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isLoading ? '삭제 중...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
