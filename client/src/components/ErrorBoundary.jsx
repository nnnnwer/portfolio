import { Component } from 'react';

/** Catches rendering errors so one broken component can't blank the whole site. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Rendering error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">This page stopped working</h1>
          <p className="mt-3 text-muted">
            Something in the page failed to display. Reload to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex h-11 items-center rounded-md bg-mask px-5 font-medium text-mask-ink"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
