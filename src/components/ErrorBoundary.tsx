import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from './icons/SocIcons';

interface Props {
  children: ReactNode;
  visualTitle?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 bg-rose-950/20 border border-rose-500/30 rounded-[2px] text-center font-mono select-none">
          <AlertTriangle className="w-6 h-6 text-rose-400 mb-2 animate-pulse" />
          <div className="text-xs font-bold text-rose-300">
            {this.props.visualTitle ? `${this.props.visualTitle} Render Alert` : 'Visual Component Render Alert'}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 max-w-sm line-clamp-2">
            {this.state.error?.message || 'Unexpected telemetry rendering anomaly detected.'}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-3 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-[2px] flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Telemetry Stream</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
