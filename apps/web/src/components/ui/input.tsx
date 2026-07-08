import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref,
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={clsx(
          'w-full rounded-lg border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          error ? 'border-danger focus:ring-danger/50' : 'border-card-border',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={inputId ? `${inputId}-error` : undefined} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});
