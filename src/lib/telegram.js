/**
 * Thin, defensive wrapper around the Telegram WebApp SDK.
 * Every helper is safe to call outside Telegram (e.g. in a desktop browser
 * during development) and on older clients that lack a given feature.
 */
import WebApp from '@twa-dev/sdk';

export const tg = WebApp;

/** True when running inside a real Telegram client. */
export const isTelegram = Boolean(WebApp?.initData);

/** Checks the Bot API version supported by the client. */
const supports = (version) => {
  try {
    return WebApp.isVersionAtLeast?.(version) ?? false;
  } catch {
    return false;
  }
};

/** Initialise the Mini App: signal readiness and take the full height. */
export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand();
    if (supports('7.7')) WebApp.disableVerticalSwipes?.();
  } catch {
    /* not inside Telegram */
  }
}

/** Current user from initData (unsafe = not verified, display only). */
export const getTelegramUser = () => WebApp?.initDataUnsafe?.user ?? null;

/** Raw initData string — send to the backend for signature verification. */
export const getInitData = () => WebApp?.initData ?? '';

/** Telegram's colour scheme: "light" | "dark". */
export const getColorScheme = () => WebApp?.colorScheme === 'dark' ? 'dark' : 'light';

/** Subscribe to Telegram theme changes. Returns an unsubscribe function. */
export function onThemeChanged(callback) {
  try {
    WebApp.onEvent('themeChanged', callback);
    return () => WebApp.offEvent('themeChanged', callback);
  } catch {
    return () => {};
  }
}

/** Paint Telegram's header and background so they match the app. */
export function setTelegramColors(hex) {
  try {
    if (!supports('6.1')) return;
    WebApp.setHeaderColor(hex);
    WebApp.setBackgroundColor(hex);
    if (supports('7.10')) WebApp.setBottomBarColor?.(hex);
  } catch {
    /* ignore */
  }
}

/** Haptic feedback helpers. */
export const haptic = {
  impact(style = 'light') {
    try {
      if (supports('6.1')) WebApp.HapticFeedback.impactOccurred(style);
    } catch {
      /* ignore */
    }
  },
  notify(type = 'success') {
    try {
      if (supports('6.1')) WebApp.HapticFeedback.notificationOccurred(type);
    } catch {
      /* ignore */
    }
  },
  select() {
    try {
      if (supports('6.1')) WebApp.HapticFeedback.selectionChanged();
    } catch {
      /* ignore */
    }
  },
};

/** Native Telegram back button (top-left of the Telegram header). */
export const backButton = {
  show(handler) {
    try {
      if (!supports('6.1')) return () => {};
      WebApp.BackButton.onClick(handler);
      WebApp.BackButton.show();
      return () => {
        WebApp.BackButton.offClick(handler);
        WebApp.BackButton.hide();
      };
    } catch {
      return () => {};
    }
  },
};

/** Opens a t.me link inside Telegram, or a new tab elsewhere. */
export function openTelegramLink(url) {
  try {
    if (isTelegram) {
      WebApp.openTelegramLink(url);
      return;
    }
  } catch {
    /* fall through */
  }
  window.open(url, '_blank', 'noopener');
}
