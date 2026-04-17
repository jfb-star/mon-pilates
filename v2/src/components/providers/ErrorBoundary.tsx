"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-mp-cream to-mp-white py-20" role="alert">
          <div className="mp-container max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-mp-rose/10 flex items-center justify-center mx-auto mb-6">
              <span className="font-heading text-3xl" aria-hidden="true">!</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-mp-charcoal mb-3">
              Oups, un petit souci
            </h2>
            <p className="font-body text-mp-text-light leading-relaxed mb-8 max-w-md mx-auto">
              Pas d&apos;inqui&eacute;tude, ce n&apos;est rien de grave.
              Essayez de recharger la page ou revenez &agrave; l&apos;accueil.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mp-btn mp-btn-primary"
              >
                R&eacute;essayer
              </button>
              <a href="/" className="mp-btn mp-btn-secondary">
                Retour &agrave; l&apos;accueil
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
