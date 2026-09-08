/**
 * sfx — tiny WebAudio synth engine. No audio files, works offline.
 * All sounds are synthesized on the fly; muted state persists in localStorage.
 * Safe everywhere: if WebAudio is unavailable, every call is a no-op.
 */
type Wave = OscillatorType;

const MUTE_KEY = 'jj_sound_muted';
let ctx: AudioContext | null = null;
let muted = typeof localStorage !== 'undefined' && localStorage.getItem(MUTE_KEY) === '1';

function ac(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function blip(
  freq: number,
  duration = 0.07,
  type: Wave = 'sine',
  gain = 0.04,
  slideTo?: number,
  delay = 0,
) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  isMuted: () => muted,
  setMuted(m: boolean) {
    muted = m;
    try {
      if (m) localStorage.setItem(MUTE_KEY, '1');
      else localStorage.removeItem(MUTE_KEY);
    } catch { /* private mode */ }
  },
  /** warm up audio context on first user gesture (mobile autoplay rules) */
  unlock() {
    ac();
  },
  /** soft UI tick for taps/nav */
  tick() {
    blip(880, 0.045, 'sine', 0.025);
  },
  /** confirmation — two ascending notes */
  confirm() {
    blip(523, 0.07, 'sine', 0.035);
    blip(784, 0.09, 'sine', 0.035, undefined, 0.07);
  },
  /** toggle / switch */
  toggle(on: boolean) {
    blip(on ? 660 : 440, 0.06, 'triangle', 0.03, on ? 880 : 330);
  },
  /** achievement / success fanfare */
  fanfare() {
    blip(523, 0.09, 'triangle', 0.04);
    blip(659, 0.09, 'triangle', 0.04, undefined, 0.09);
    blip(784, 0.09, 'triangle', 0.04, undefined, 0.18);
    blip(1047, 0.16, 'triangle', 0.045, undefined, 0.27);
  },
  /** error / warning */
  error() {
    blip(220, 0.12, 'sawtooth', 0.03, 160);
  },
  /** whoosh for page transitions */
  whoosh() {
    blip(300, 0.12, 'sine', 0.015, 90);
  },
};

/** haptic buzz — pattern or ms; respects mute so sound-off also means buzz-off */
export function buzz(pattern: number | number[]) {
  if (muted) return;
  try {
    navigator.vibrate(pattern);
  } catch { /* unsupported */ }
}
export default sfx;