import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Frontend Crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 font-sans">
          <div className="bg-[#0d1424] border border-rose-500/30 p-8 rounded-xl max-w-lg w-full text-center shadow-2xl">
            <h1 className="text-rose-400 text-2xl font-bold mb-4">UI Encountered an Error</h1>
            <p className="text-slate-400 mb-6">We apologize, but the application crashed while trying to render the interface.</p>
            <div className="bg-black/50 p-4 rounded-lg text-left overflow-auto mb-6">
              <code className="text-rose-300 text-xs font-mono">{this.state.error?.toString()}</code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
