import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile} from 'remotion';
import {IMAGES} from '../lib/images';
import {C, FONT, H, W, clamp} from '../lib/theme';

const MAP = IMAGES.map;

type Pt = {x: number; y: number};
type Chip = {at: number; x: number; y: number; label: string; sub?: string; side: 'left' | 'right'; ring?: boolean};

// Koordinat dalam piksel gambar peta asli (1280 × 2450). Label asli peta berbahasa Spanyol.
const CHIPS: Chip[] = [
  {at: 0.2, x: 832, y: 1840, label: 'SAMARRA', side: 'left', ring: true},
  {at: 0.34, x: 800, y: 1552, label: 'ISTANA KHALIFAH', sub: 'Palacio del califa', side: 'right', ring: true},
  {at: 0.46, x: 832, y: 1698, label: 'MASJID AGUNG', sub: 'Mezquita aljama', side: 'right', ring: true},
  {at: 0.58, x: 457, y: 1709, label: 'SUNGAI TIGRIS', side: 'left'},
  {at: 0.76, x: 1090, y: 2395, label: 'MENUJU BAGHDAD', sub: 'A Bagdad', side: 'left', ring: true},
];

const KEYS = [0, 0.28, 0.62, 1];
const CX = [640, 800, 820, 960];
const CY = [1225, 1560, 1760, 2290];
const Z = [0.845, 1.45, 1.5, 1.15];

/** Peta Samarra: kamera menyusur dari ikhtisar ke Samarra lalu ke arah Baghdad. */
export const MapShot: React.FC<{frame: number; fps: number; len: number}> = ({frame, fps, len}) => {
  const t = clamp(frame / len, 0, 1);
  const ease = {easing: Easing.inOut(Easing.cubic)};
  const z = interpolate(t, KEYS, Z, ease);
  const halfW = W / 2 / z;
  const halfH = H / 2 / z;
  const cx = clamp(interpolate(t, KEYS, CX, ease), halfW, MAP.w - halfW);
  const cy = clamp(interpolate(t, KEYS, CY, ease), halfH, MAP.h - halfH);
  const proj = (p: Pt): Pt => ({x: W / 2 + (p.x - cx) * z, y: H / 2 + (p.y - cy) * z});

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <div style={{position: 'absolute', left: W / 2 - cx * z, top: H / 2 - cy * z, width: MAP.w * z, height: MAP.h * z}}>
        <Img
          src={staticFile('img/' + MAP.file)}
          style={{width: '100%', height: '100%', filter: 'sepia(0.85) saturate(0.9) contrast(1.15) brightness(0.52) hue-rotate(-8deg)'}}
        />
      </div>
      <AbsoluteFill style={{background: 'rgba(10,16,32,0.55)', mixBlendMode: 'multiply'}} />
      {CHIPS.map((c, i) => {
        const p = proj(c);
        const startF = c.at * len;
        const s = spring({frame: Math.max(0, frame - startF), fps, config: {damping: 200}});
        if (frame < startF || p.x < -200 || p.x > W + 200 || p.y < -100 || p.y > H + 100) return null;
        const pulse = (frame / 24) % 1;
        const side = c.side === 'left' ? -1 : 1;
        const ox = side * 70;
        return (
          <React.Fragment key={i}>
            {c.ring && (
              <>
                <div style={{position: 'absolute', left: p.x - 22, top: p.y - 22, width: 44, height: 44, borderRadius: '50%', border: `4px solid ${C.goldLight}`, boxShadow: `0 0 24px ${C.gold}`, opacity: s, transform: `scale(${0.6 + s * 0.4})`}} />
                <div style={{position: 'absolute', left: p.x - 22 - pulse * 40, top: p.y - 22 - pulse * 40, width: 44 + pulse * 80, height: 44 + pulse * 80, borderRadius: '50%', border: `3px solid ${C.goldLight}`, opacity: (1 - pulse) * 0.7 * s}} />
              </>
            )}
            <div
              style={{
                position: 'absolute', top: p.y - 44, ...(side === -1 ? {right: W - (p.x + ox)} : {left: p.x + ox}),
                opacity: s, transform: `translateX(${side * (1 - s) * -30}px)`, padding: '8px 22px 10px',
                background: 'rgba(5,7,13,0.88)', border: `2px solid ${C.gold}`, textAlign: side === -1 ? 'right' : 'left',
              }}
            >
              <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 38, letterSpacing: 4, color: C.goldLight, whiteSpace: 'nowrap'}}>{c.label}</div>
              {c.sub && <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 26, color: C.ivory, opacity: 0.85, whiteSpace: 'nowrap'}}>{c.sub}</div>}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', top: 160, left: 0, width: W, textAlign: 'center', fontFamily: FONT.title, fontSize: 32, letterSpacing: 10, color: C.gold, opacity: interpolate(frame, [4, 20], [0, 1], {extrapolateRight: 'clamp'})}}>
        KHILAFAH ABBASIYAH
      </div>
      <div style={{position: 'absolute', top: 214, left: 80, width: W - 160, textAlign: 'center', fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 28, color: C.ivory, opacity: 0.8}}>
        Peta sejarah Samarra — label asli dalam bahasa Spanyol
      </div>
    </AbsoluteFill>
  );
};
