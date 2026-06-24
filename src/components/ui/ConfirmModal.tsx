"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button, { type ButtonVariant } from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  loading?: boolean;
  destructive?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant,
  loading,
  destructive,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {destructive && (
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
            <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
          </div>
        )}
        <h2 className="font-display text-xl text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-white/60">{description}</p>
        )}
        <div className="mt-6 flex w-full gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant ?? (destructive ? "danger" : "primary")}
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
