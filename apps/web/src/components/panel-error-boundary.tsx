'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui';

interface PanelErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface PanelErrorBoundaryState {
  error: Error | null;
}

export class PanelErrorBoundary extends Component<PanelErrorBoundaryProps, PanelErrorBoundaryState> {
  state: PanelErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PanelErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PanelErrorBoundary]', error, info.componentStack);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className="rounded-xl border border-card-border bg-card p-4 sm:p-6 space-y-3"
        >
          <div>
            <p className="font-medium text-sm">{this.props.title ?? 'This panel failed to load'}</p>
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={this.reset}>
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
