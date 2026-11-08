/**
 * Last line of defence: if anything throws while rendering, show a small
 * recovery screen instead of a blank white page. Deliberately has no context
 * dependencies (it sits above every provider), so its text is hardcoded.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[App crashed]', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg p-6 text-center text-fg">
        <p className="text-lg font-semibold">Xatolik yuz berdi / Произошла ошибка</p>
        <p className="text-sm text-muted">{String(this.state.error?.message || this.state.error)}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-11 rounded-xl bg-fg px-6 text-sm font-semibold text-inverse"
        >
          Qayta yuklash / Перезагрузить
        </button>
      </div>
    );
  }
}
