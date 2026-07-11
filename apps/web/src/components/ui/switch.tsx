'use client';

import clsx from 'clsx';
import { useId, type InputHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ label, checked, onCheckedChange, className, id, disabled, ...props }: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        'inline-flex items-center gap-3 min-h-11 cursor-pointer',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          {...props}
          id={inputId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-card-border transition-colors peer-checked:bg-primary/40 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  );
}
