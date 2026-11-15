/**
 * Short UI "tick" sound for taps.
 *
 * Primary path: Web Audio API with a pre-decoded buffer — near-zero latency
 * and rapid taps can overlap. Fallback: a preloaded HTMLAudioElement, used
 * on old webviews or until the buffer has finished decoding.
 *
 * Browsers only allow audio after a user gesture, so the AudioContext is
 * created/resumed by capture-phase listeners on the first interaction —
 * these run before any onClick handler, so the very first tap is audible.
 */
const SOUND_URL = `${import.meta.env.BASE_URL}sounds/click.wav`;
const VOLUME = 0.5;

let ctx = null;
let buffer = null;
let loading = null;
let fallback = null;

const AudioCtx = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;

function getFallback() {
  if (!fallback && typeof Audio !== 'undefined') {
    fallback = new Audio(SOUND_URL);
    fallback.preload = 'auto';
    fallback.volume = VOLUME;
  }
  return fallback;
}

function loadBuffer() {
  if (loading || !ctx) return loading;
  loading = fetch(SOUND_URL)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status))))
    // Callback form for older Safari, which lacks the promise-returning version.
    .then((data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
    .then((decoded) => {
      buffer = decoded;
    })
    .catch(() => {
      loading = null; // allow a retry on a later tap
    });
  return loading;
}

/** Create/resume the AudioContext inside a user gesture. */
function unlock() {
  try {
    if (!ctx && AudioCtx) ctx = new AudioCtx();
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
    loadBuffer();
  } catch {
    ctx = null;
  }
}

if (typeof window !== 'undefined') {
  const opts = { capture: true, passive: true };
  const events = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown'];
  const onFirst = () => {
    unlock();
    // Keep listening until the context is actually running (iOS may need touchend).
    if (ctx?.state === 'running') events.forEach((e) => window.removeEventListener(e, onFirst, opts));
  };
  events.forEach((e) => window.addEventListener(e, onFirst, opts));
  getFallback(); // start downloading the file early
}

/** Play the click sound. Never throws; silently does nothing if audio is unavailable. */
export function playClickSound() {
  try {
    unlock();
    if (ctx && buffer && ctx.state === 'running') {
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = VOLUME;
      src.buffer = buffer;
      src.connect(gain).connect(ctx.destination);
      src.start();
      return;
    }
    const a = getFallback();
    if (!a) return;
    a.currentTime = 0;
    a.play()?.catch?.(() => {});
  } catch {
    /* ignore */
  }
}
