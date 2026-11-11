import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {C, H, W, clamp} from '../lib/theme';

/** Guncangan layar singkat saat "cambuk" simbolis (hanya kilatan dan getar, tanpa gambar kekerasan). */
const LASH_AT = [0.3, 0.52, 0.74];

export const lashShake = (frame: number, len: number): {x: number; y: number} => {
  let amp = 0;
  for (const a of LASH_AT) {
    const f0 = a * len;
    const d = frame - f0;
    if (d >= 0 && d < 10) amp = Math.max(amp, (1 - d / 10) * 22);
  }
  return {x: (random(`shx${frame}`) - 0.5) * amp, y: (random(`shy${frame}`) - 0.5) * amp};
};

export const Lash: React.FC<{frame: number; len: number}> = ({frame, len}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {LASH_AT.map((a, i) => {
      const f0 = a * len;
      const d = frame - f0;
      if (d < 0 || d > 22) return null;
      const draw = clamp(d / 5, 0, 1);
      const fade = interpolate(d, [5, 22], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      const angle = [-28, 22, -12][i];
      const top = [520, 760, 980][i];
      const flash = interpolate(d, [0, 3, 12], [0, 0.42, 0], {extrapolateRight: 'clamp'});
      return (
        <React.Fragment key={i}>
          <AbsoluteFill style={{background: '#fff', opacity: flash}} />
          <div
            style={{
              position: 'absolute', left: -120, top, width: (W + 240) * draw, height: 9,
              transform: `rotate(${angle}deg)`, transformOrigin: 'left center', opacity: fade,
              background: `linear-gradient(90deg, rgba(255,255,255,0), ${C.crimson} 20%, #ff6a5a 55%, #fff 100%)`,
              boxShadow: '0 0 34px 8px rgba(190,30,40,0.75)',
            }}
          />
        </React.Fragment>
      );
    })}
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(120,10,20,${0.28 + 0.1 * Math.sin(frame / 6)}) 100%)`}} />
  </AbsoluteFill>
);

/** Jeruji besi simbolis: turun dari atas, bergoyang sangat halus. */
export const Bars: React.FC<{frame: number; len: number}> = ({frame, len}) => {
  const count = 7;
  const gap = W / count;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%, rgba(232,200,120,0.18), rgba(0,0,0,0.55) 75%)'}} />
      {Array.from({length: count}).map((_, i) => {
        const start = i * 3;
        const p = interpolate(frame, [start, start + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const eased = 1 - Math.pow(1 - p, 3);
        const sway = Math.sin(frame / 37 + i) * 1.2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: gap * i + gap / 2 - 24 + sway, top: -H + eased * H + (frame / len) * -10, width: 48, height: H + 40,
              background: 'linear-gradient(90deg, #050608 0%, #2a2e38 38%, #8f98a8 50%, #2a2e38 62%, #050608 100%)',
              boxShadow: '0 0 30px rgba(0,0,0,0.85)', opacity: 0.94,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Terang perlahan dari kegelapan (pembuka / transisi harapan). */
export const Reveal: React.FC<{frame: number; len: number}> = ({frame, len}) => {
  const o = interpolate(frame, [0, len * 0.55], [0.92, 0], {extrapolateRight: 'clamp'});
  const bloom = interpolate(frame, [0, len * 0.6, len], [0, 0.35, 0.18], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 70%, rgba(232,200,120,${bloom}), rgba(0,0,0,0) 60%)`, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: C.ink, opacity: o}} />
    </AbsoluteFill>
  );
};
