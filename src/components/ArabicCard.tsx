import React from 'react';
import {AbsoluteFill, interpolate, spring} from 'remotion';
import {SRC_KAMIL} from '../data/shots';
import {C, FONT, W} from '../lib/theme';

type Props = {
  frame: number;
  fps: number;
  len: number;
  arabic: string;
  translation: string;
  arabicStart: number; // frame lokal
  arabicEnd: number;
  transStart: number;
};

const Corner: React.FC<{style: React.CSSProperties}> = ({style}) => (
  <div style={{position: 'absolute', width: 34, height: 34, borderColor: C.goldLight, borderStyle: 'solid', borderWidth: 0, ...style}} />
);

/** Kartu ibarat Arab: huruf Arab RTL berharakat, animasi mask reveal dari kanan, terjemahan di bawahnya. */
export const ArabicCard: React.FC<Props> = ({frame, fps, len, arabic, translation, arabicStart, arabicEnd, transStart}) => {
  const enter = spring({frame: Math.max(0, frame - (arabicStart - 8)), fps, config: {damping: 200}});
  const reveal = interpolate(frame, [arabicStart, Math.max(arabicStart + 12, arabicEnd - 4)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const trans = spring({frame: Math.max(0, frame - transStart), fps, config: {damping: 200}});
  const out = interpolate(frame, [len - 10, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pct = reveal * 112;
  const glow = 0.55 + 0.25 * Math.sin(frame / 14);
  const transText = translation.replace(/^Artinya:\s*/, '');
  if (frame < arabicStart - 8) return null;
  return (
    <AbsoluteFill style={{opacity: enter * out}}>
      <div
        style={{
          position: 'absolute', left: 60, top: 300 + (1 - enter) * 40, width: W - 120, height: 960,
          background: 'linear-gradient(180deg, rgba(10,13,26,0.86), rgba(6,8,16,0.9))',
          border: `2px solid ${C.gold}`, boxShadow: '0 40px 110px rgba(0,0,0,0.8), inset 0 0 80px rgba(201,162,75,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 44px',
        }}
      >
        <Corner style={{left: 14, top: 14, borderTopWidth: 3, borderLeftWidth: 3}} />
        <Corner style={{right: 14, top: 14, borderTopWidth: 3, borderRightWidth: 3}} />
        <Corner style={{left: 14, bottom: 14, borderBottomWidth: 3, borderLeftWidth: 3}} />
        <Corner style={{right: 14, bottom: 14, borderBottomWidth: 3, borderRightWidth: 3}} />
        <div style={{fontFamily: FONT.title, fontSize: 30, letterSpacing: 10, color: C.gold, marginBottom: 26}}>IBARAT</div>
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONT.arabic, fontWeight: 700, fontSize: 86, lineHeight: 2.0, textAlign: 'center', color: C.ivory,
            textShadow: `0 0 ${24 * glow}px rgba(232,200,120,${glow}), 0 4px 10px rgba(0,0,0,0.9)`,
            WebkitMaskImage: `linear-gradient(to left, #000 ${pct - 10}%, transparent ${pct}%)`,
            maskImage: `linear-gradient(to left, #000 ${pct - 10}%, transparent ${pct}%)`,
            fontFeatureSettings: '"liga", "calt", "mark", "mkmk"',
          }}
        >
          {arabic}
        </div>
        <div style={{width: 360 * trans, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '22px 0 24px'}} />
        <div style={{opacity: trans, transform: `translateY(${(1 - trans) * 24}px)`, textAlign: 'center'}}>
          <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 38, color: C.goldLight, marginBottom: 8}}>Artinya:</div>
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 52, lineHeight: 1.25, color: C.ivory, textShadow: '0 3px 12px rgba(0,0,0,0.9)'}}>{transText}</div>
        </div>
        <div style={{position: 'absolute', bottom: 30, fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 28, color: C.parchment, opacity: 0.9}}>{SRC_KAMIL}</div>
      </div>
    </AbsoluteFill>
  );
};
