// FF Max loadout data - edit values freely
export interface SensPreset {
  name: string;
  desc: string;
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
}

export const SENS_PRESETS: SensPreset[] = [
  {
    name: 'Balanced',
    desc: 'Start here. Control + speed, works for any gun.',
    general: 120, redDot: 115, scope2x: 100, scope4x: 80, sniper: 50, freeLook: 75,
  },
  {
    name: 'Headshot Aggressive',
    desc: 'Fast drag to head. For close-mid fights.',
    general: 195, redDot: 170, scope2x: 145, scope4x: 120, sniper: 70, freeLook: 80,
  },
  {
    name: 'One-Tap Drag',
    desc: 'Max flick speed for one-tap headshots. Hard to control.',
    general: 200, redDot: 190, scope2x: 175, scope4x: 165, sniper: 95, freeLook: 140,
  },
];

export const DEVICE_INFO = {
  device: 'realme (480 DPI native)',
  refresh: '120 Hz',
  graphics: 'Smooth + High FPS',
  note: 'Sensitivity is personal — start Balanced, adjust ±3-5 until it feels right.',
};

