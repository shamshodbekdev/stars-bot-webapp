/**
 * Haptic (vibration) feedback via the Telegram WebApp SDK.
 * No-op outside Telegram, on clients older than Bot API 6.1,
 * or if the HapticFeedback API is missing for any reason.
 */
import WebApp from '@twa-dev/sdk';

/** True only inside a real Telegram client with haptics available. */
export function canHaptic() {
  try {
    return (
      Boolean(WebApp?.initData) &&
      (WebApp.isVersionAtLeast?.('6.1') ?? false) &&
      typeof WebApp.HapticFeedback?.impactOccurred === 'function'
    );
  } catch {
    return false;
  }
}

/**
 * Trigger an impact vibration.
 * @param {'light'|'medium'|'heavy'|'rigid'|'soft'} style
 */
export function triggerHaptic(style = 'light') {
  if (!canHaptic()) return;
  try {
    WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    /* ignore */
  }
}
