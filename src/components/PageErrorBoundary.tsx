import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { GlassButton, GlassPanel } from './liquid-glass';

interface PageErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
  onReturnHome?: () => void;
}

interface PageErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  public state: PageErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): PageErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred while loading this page.',
    };
  }

  public componentDidUpdate(prevProps: PageErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PageErrorBoundary]', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
          <GlassPanel className="p-8 sm:p-10 text-center space-y-5 border border-[#E8E8ED]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[#1D1D1F]">
                Unable to load this section
              </h2>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                {this.state.errorMessage}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <GlassButton variant="primary" size="md" onClick={this.handleRetry}>
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Retry</span>
              </GlassButton>
              {this.props.onReturnHome && (
                <GlassButton
                  variant="glass"
                  size="md"
                  onClick={() => {
                    this.setState({ hasError: false, errorMessage: '' });
                    this.props.onReturnHome?.();
                  }}
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  <span>Return Home</span>
                </GlassButton>
              )}
            </div>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}
