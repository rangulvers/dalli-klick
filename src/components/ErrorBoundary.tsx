import React, { Component, ReactNode } from 'react'
import { logger } from '../utils/logger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary to catch React errors and display fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
    // Reload the app
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-300 mb-6">
              The application encountered an unexpected error. We apologize for the inconvenience.
            </p>

            {this.state.error && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-300 font-mono text-sm break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Restart Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
