import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, H, W} from '../lib/theme';

/** Vinyet gelap di tepi layar + gradien bawah agar subtitle terbaca. */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 38%, rgba(2,3,8,0.78) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(2,3,8,0.55) 0%, rgba(2,3,8,0) 16%, rgba(2,3,8,0) 52%, rgba(2,3,8,0.82) 100%)'}} />
  </AbsoluteFill>
);

/** Debu atmosferik: partikel deterministik (aman untuk render paralel). */
export const Dust: React.FC<{count?: number}> = ({count = 46}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {Array.from({length: count}).map((_, i) => {
        const speed = 14 + random(`sp${i}`) * 30;
        const size = 2 + random(`sz${i}`) * 4.5;
        const x0 = random(`x${i}`) * W;
        const y0 = random(`y${i}`) * H;
        const y = (((y0 - t * speed) % H) + H) % H;
        const x = x0 + Math.sin(t * (0.4 + random(`w${i}`)) + i) * 28;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.6 + random(`t${i}`) * 1.4) + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%',
              background: C.goldLight, opacity: 0.1 + tw * 0.38 * random(`o${i}`),
              filter: `blur(${size > 4 ? 1.5 : 0.6}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Berkas cahaya diagonal yang bergerak pelan. */
export const Rays: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const o1 = 0.05 + 0.03 * Math.sin(t * 0.5);
  const o2 = 0.04 + 0.03 * Math.sin(t * 0.37 + 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <div style={{position: 'absolute', left: 120 + Math.sin(t * 0.2) * 60, top: -200, width: 260, height: 2400, transform: 'rotate(-18deg)', background: `linear-gradient(to bottom, rgba(232,200,120,${o1 * 3}), rgba(232,200,120,0))`, filter: 'blur(28px)'}} />
      <div style={{position: 'absolute', left: 640 + Math.cos(t * 0.17) * 70, top: -200, width: 180, height: 2400, transform: 'rotate(-18deg)', background: `linear-gradient(to bottom, rgba(244,236,216,${o2 * 3}), rgba(244,236,216,0))`, filter: 'blur(24px)'}} />
    </AbsoluteFill>
  );
};

/** Film grain halus: tekstur noise digeser acak tiap 2 frame. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const dx = Math.floor(random(`gx${step}`) * 512);
  const dy = Math.floor(random(`gy${step}`) * 512);
  const flick = interpolate(random(`gf${step}`), [0, 1], [0.9, 1.0]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.17 * flick, overflow: 'hidden'}}>
      <Img src={staticFile('fx/grain.png')} style={{position: 'absolute', left: -dx, top: -dy, width: W + 512, height: H + 512, objectFit: 'none', objectPosition: '0 0'}} />
    </AbsoluteFill>
  );
};
