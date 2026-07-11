'use client';

import clsx from 'clsx';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from './button';

export type ToastVariant = 'default' | 'success' | 'danger' | 'warning' | 'info';

export interface ToastShowOptions {
  message: string;
  variant?: ToastVariant;
  undo?: () => void;
  action?: { label: string; onClick: () => void };
  durationMs?: number;
}

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  undo?: () => void;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  show: (options: ToastShowOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClass: Record<ToastVariant, string> = {
  default: 'border-card-border bg-card text-foreground',
  success: 'border-success/30 bg-success/10 text-success',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const idPrefix = useId();
  const seq = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ message, variant = 'default', undo, action, durationMs = 5000 }: ToastShowOptions) => {
      seq.current += 1;
      const id = `${idPrefix}-${seq.current}`;
      setToasts((prev) => [...prev, { id, message, variant, undo, action }]);
      const timer = setTimeout(() => dismiss(id), durationMs);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss, idPrefix],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const timer of map.values()) clearTimeout(timer);
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={clsx(
              'pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg',
              variantClass[t.variant],
            )}
          >
            <span>{t.message}</span>
            <div className="flex shrink-0 items-center gap-2">
              {t.undo && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    t.undo?.();
                    dismiss(t.id);
                  }}
                >
                  Undo
                </Button>
              )}
              {t.action && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    t.action?.onClick();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
