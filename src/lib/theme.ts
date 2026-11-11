export const W = 1080;
export const H = 1920;
export const FPS = 30;
/** Jeda hening di akhir video setelah narasi selesai (detik). */
export const TAIL_SEC = 1.5;

export const C = {
  ink: '#05070d',
  navy: '#0a1020',
  gold: '#c9a24b',
  goldLight: '#e8c878',
  parchment: '#b89968',
  ivory: '#f4ecd8',
  crimson: '#8a1a24',
} as const;

export const FONT = {
  title: 'Cinzel, serif',
  body: '"Cormorant Garamond", serif',
  arabic: 'Amiri, serif',
} as const;

/** Area aman platform (TikTok/Reels): atas ±150 px, bawah ±300 px. */
export const SAFE_TOP = 150;
export const SAFE_BOTTOM = 300;

export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
