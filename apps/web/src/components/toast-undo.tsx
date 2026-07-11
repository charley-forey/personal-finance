'use client';

/**
 * @deprecated Prefer `@/components/ui` ToastProvider / useToast.
 * Re-exports for Action Queue and layout compatibility.
 */
export {
  ToastProvider as ToastUndoProvider,
  useToast,
  type ToastShowOptions,
} from '@/components/ui/toast';
