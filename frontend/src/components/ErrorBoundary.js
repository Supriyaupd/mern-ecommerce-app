import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary — catches JavaScript errors in child component trees.
 * Wrap around page-level components in App.js to prevent full-app crashes.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px', textAlign: 'center',
        }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: 14 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 13 }}>
              Try refreshing the page or navigating back to home.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              >
                Refresh Page
              </button>
              <Link to="/" className="btn btn-ghost" onClick={() => this.setState({ hasError: false, error: null })}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
