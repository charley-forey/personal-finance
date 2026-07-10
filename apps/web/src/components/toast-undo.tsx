'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui';

const UNDO_MS = 30_000;

export interface ToastShowOptions {
  message: string;
  undo?: () => void;
  durationMs?: number;
}

interface ToastItem {
  id: string;
  message: string;
  undo?: () => void;
  expiresAt: number;
}

interface ToastContextValue {
  show: (options: ToastShowOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastUndoProvider');
  }
  return ctx;
}

export function ToastUndoProvider({ children }: { children: ReactNode }) {
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
    ({ message, undo, durationMs = UNDO_MS }: ToastShowOptions) => {
      seq.current += 1;
      const id = `${idPrefix}-${seq.current}`;
      const expiresAt = Date.now() + durationMs;
      setToasts((prev) => [...prev, { id, message, undo, expiresAt }]);
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

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-20 md:bottom-6 inset-x-0 z-[60] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex max-w-md w-full items-center justify-between gap-3 rounded-lg border border-card-border bg-card px-4 py-3 text-sm shadow-lg"
            role="status"
          >
            <p className="min-w-0 flex-1 text-foreground">{toast.message}</p>
            <div className="flex shrink-0 items-center gap-1">
              {toast.undo ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    toast.undo?.();
                    dismiss(toast.id);
                  }}
                >
                  Undo
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
