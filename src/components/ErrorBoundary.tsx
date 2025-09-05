import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
  reset: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service (e.g., Sentry, LogRocket)
    console.error('GameXBuddy Error Boundary caught an error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            retry={this.retry}
            reset={this.reset}
          />
        );
      }

      return <GameXBuddyErrorFallback
        error={this.state.error!}
        retry={this.retry}
        reset={this.reset}
      />;
    }

    return this.props.children;
  }
}

const GameXBuddyErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry, reset }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-white/20 bg-gradient-to-br from-red-900/20 to-black/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-red-500/20 rounded-full animate-pulse-glow">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </CardTitle>
          <p className="text-white/70 text-sm">
            GameXBuddy encountered an unexpected error. Don't worry - we've got this!
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User-friendly error message */}
          <div className="text-center">
            <p className="text-red-300 text-sm mb-4">
              Our gaming wizards are on it. Try refreshing or going home.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={retry}
              variant="neon"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <Button
              onClick={reset}
              variant="outline"
              className="border-white/20 text-white hover:border-white/40"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Development info */}
          {isDevelopment && (
            <details className="mt-6 text-left">
              <summary className="text-white/50 cursor-pointer hover:text-white/70 text-sm">
                💻 Developer Info
              </summary>
              <div className="mt-2 p-3 bg-black/30 rounded text-xs space-y-1">
                <p className="text-red-300 font-medium">{error.message}</p>
                <p className="text-white/50 break-all">{error.stack}</p>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// React Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((err: Error) => {
    setError(err);

    // Log error
    console.error('GameXBuddy Error Handler:', err);

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: err.message,
        fatal: false
      });
    }
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

// Higher-Order Component for error boundary
export const withErrorBoundary = <P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedWithBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WrappedWithBoundaryComponent.displayName =
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WrappedWithBoundaryComponent;
};

export default ErrorBoundary;