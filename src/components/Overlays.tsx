import React from 'react';
import {AbsoluteFill, interpolate, spring} from 'remotion';
import type {Overlay} from '../data/shots';
import {C, FONT, W} from '../lib/theme';

export type OverlayCtx = {
  frame: number;
  fps: number;
  len: number;
  t: number;
  segStart: (id: string) => number; // frame lokal
};

const pop = (frame: number, at: number, fps: number): number =>
  spring({frame: Math.max(0, frame - at), fps, config: {damping: 200}});

const goldText: React.CSSProperties = {
  background: `linear-gradient(180deg, ${C.ivory} 0%, ${C.goldLight} 45%, ${C.gold} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

const shadow = '0 4px 18px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.9)';

const Kicker: React.FC<{text: string; c: OverlayCtx}> = ({text, c}) => {
  const p = interpolate(c.frame, [6, 24], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 150, left: 0, width: W, textAlign: 'center', opacity: p, fontFamily: FONT.title, fontWeight: 600, fontSize: 32, letterSpacing: 10 * (1.4 - 0.4 * p), color: C.gold, textShadow: shadow}}>
      {text}
    </div>
  );
};

const Caption: React.FC<{text: string; c: OverlayCtx}> = ({text, c}) => {
  const p = interpolate(c.frame, [14, 34], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 206, left: 90, width: W - 180, textAlign: 'center', opacity: p * 0.92, fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 30, lineHeight: 1.2, color: C.ivory, textShadow: shadow}}>
      {text}
    </div>
  );
};

const Year: React.FC<{o: Extract<Overlay, {type: 'year'}>; c: OverlayCtx}> = ({o, c}) => {
  const p = pop(c.frame, (o.at ?? 0.1) * c.len, c.fps);
  return (
    <div style={{position: 'absolute', left: 84, top: 370, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${1.12 - 0.12 * p})`, transformOrigin: 'left center'}}>
      <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 168, lineHeight: 1, ...goldText, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.9))'}}>{o.text}</div>
      {o.sub && <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 50, color: C.ivory, textShadow: shadow, marginTop: 6}}>{o.sub}</div>}
      <div style={{width: 360 * p, height: 3, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginTop: 14}} />
    </div>
  );
};

const Plate: React.FC<{o: Extract<Overlay, {type: 'plate'}>; c: OverlayCtx}> = ({o, c}) => {
  const p = pop(c.frame, (o.at ?? 0.3) * c.len, c.fps);
  return (
    <div style={{position: 'absolute', left: 0, top: 1080, width: W, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{width: 520 * p, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: '0 auto 18px'}} />
      <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 56, letterSpacing: 4, color: C.ivory, textShadow: shadow}}>{o.text}</div>
      {o.sub && <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 42, color: C.goldLight, textShadow: shadow, marginTop: 6}}>{o.sub}</div>}
    </div>
  );
};

const Flow: React.FC<{o: Extract<Overlay, {type: 'flow'}>; c: OverlayCtx}> = ({o, c}) => {
  const at = (o.at ?? 0.2) * c.len;
  const a = pop(c.frame, at, c.fps);
  const line = pop(c.frame, at + 14, c.fps);
  const b = pop(c.frame, at + 30, c.fps);
  return (
    <div style={{position: 'absolute', left: 0, top: 640, width: W, textAlign: 'center'}}>
      <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 70, letterSpacing: 4, color: C.ivory, opacity: a, textShadow: shadow, transform: `translateY(${(1 - a) * 26}px)`}}>{o.from}</div>
      <div style={{margin: '20px auto', width: 4, height: 150 * line, background: `linear-gradient(to bottom, ${C.ivory}, ${C.gold})`, boxShadow: `0 0 18px ${C.gold}`}} />
      <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 70, letterSpacing: 4, ...goldText, opacity: b, transform: `translateY(${(1 - b) * 26}px) scale(${1.1 - 0.1 * b})`, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.9))'}}>{o.to}</div>
    </div>
  );
};

const BigWord: React.FC<{o: Extract<Overlay, {type: 'bigword'}>; c: OverlayCtx}> = ({o, c}) => {
  const at = (o.at ?? 0.3) * c.len;
  const p = pop(c.frame, at, c.fps);
  const reveal = interpolate(c.frame, [at, at + 22], [0, 112], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, top: 800, width: W, textAlign: 'center', opacity: p}}>
      <div style={{width: 700 * p, height: 3, margin: '0 auto 22px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
      <div
        style={{
          fontFamily: FONT.title, fontWeight: 700, fontSize: 92, letterSpacing: 6, lineHeight: 1.1, ...goldText,
          WebkitMaskImage: `linear-gradient(to right, #000 ${reveal - 12}%, transparent ${reveal}%)`,
          filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.95))',
        }}
      >
        {o.text}
      </div>
      <div style={{width: 700 * p, height: 3, margin: '22px auto 0', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
    </div>
  );
};

const MihnahTitle: React.FC<{c: OverlayCtx}> = ({c}) => {
  const p = pop(c.frame, 4, c.fps);
  const sub = pop(c.frame, 18, c.fps);
  const spacing = interpolate(c.frame, [0, c.len], [34, 14], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0.65), rgba(0,0,0,0.25) 70%)'}} />
      <div style={{position: 'absolute', left: 0, top: 760, width: W, textAlign: 'center'}}>
        <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 176, letterSpacing: spacing, paddingLeft: spacing, opacity: p, transform: `scale(${1.12 - 0.12 * p})`, ...goldText, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.95))'}}>MIHNAH</div>
        <div style={{width: 640 * sub, height: 3, margin: '14px auto', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 56, color: C.ivory, opacity: sub, textShadow: shadow}}>Ujian keyakinan</div>
      </div>
    </AbsoluteFill>
  );
};

const CALIPHS = [
  {n: 'I', name: "AL-MA'MUN", note: '218 H · awal Mihnah'},
  {n: 'II', name: "AL-MU'TASIM", note: 'meneruskan kebijakan'},
  {n: 'III', name: 'AL-WATHIQ', note: '231 H'},
  {n: 'IV', name: 'AL-MUTAWAKKIL', note: '± 232 H · kebijakan ditinggalkan'},
];

const Caliphs: React.FC<{c: OverlayCtx}> = ({c}) => {
  const bracket = pop(c.frame, 0.72 * c.len, c.fps);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(3,5,12,0.55)'}} />
      <div style={{position: 'absolute', left: 90, top: 250, width: W - 180}}>
        {CALIPHS.map((k, i) => {
          const p = pop(c.frame, (0.06 + i * 0.14) * c.len, c.fps);
          return (
            <div key={k.n} style={{display: 'flex', alignItems: 'center', gap: 26, height: 190, opacity: p, transform: `translateX(${(1 - p) * -80}px)`, borderBottom: `2px solid rgba(201,162,75,0.35)`}}>
              <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 84, width: 120, ...goldText}}>{k.n}</div>
              <div>
                <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 56, letterSpacing: 3, color: C.ivory, textShadow: shadow}}>{k.name}</div>
                <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 38, color: C.goldLight, textShadow: shadow}}>{k.note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, top: 1060, width: W, textAlign: 'center', opacity: bracket, transform: `scale(${1.1 - 0.1 * bracket})`}}>
        <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 64, letterSpacing: 6, ...goldText, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.95))'}}>SEBUAH KEBIJAKAN</div>
      </div>
    </AbsoluteFill>
  );
};

const Finale: React.FC<{c: OverlayCtx}> = ({c}) => {
  const a0 = c.segStart('s18a');
  const b0 = c.segStart('s18b');
  const raja = pop(c.frame, a0, c.fps);
  const dz = pop(c.frame, a0 + 8, c.fps);
  const line = pop(c.frame, a0 + 18, c.fps);
  const tag = pop(c.frame, b0, c.fps);
  const credit = interpolate(c.frame, [c.len - 80, c.len - 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = 0.5 + 0.3 * Math.sin(c.frame / 12);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0.78), rgba(0,0,0,0.3) 75%)', opacity: interpolate(c.frame, [a0 - 10, a0 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <div style={{position: 'absolute', left: 0, top: 560, width: W, textAlign: 'center'}}>
        <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 190, letterSpacing: 20, paddingLeft: 20, lineHeight: 1.05, opacity: raja, transform: `scale(${1.18 - 0.18 * raja})`, ...goldText, filter: `drop-shadow(0 0 ${30 * glow}px rgba(232,200,120,${glow})) drop-shadow(0 8px 20px rgba(0,0,0,0.95))`}}>RAJA</div>
        <div style={{fontFamily: FONT.title, fontWeight: 700, fontSize: 190, letterSpacing: 14, paddingLeft: 14, lineHeight: 1.05, opacity: dz, transform: `scale(${1.18 - 0.18 * dz})`, ...goldText, filter: `drop-shadow(0 0 ${30 * glow}px rgba(232,200,120,${glow})) drop-shadow(0 8px 20px rgba(0,0,0,0.95))`}}>DZOLIM</div>
        <div style={{width: 760 * line, height: 4, margin: '34px auto', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 700, fontSize: 60, lineHeight: 1.25, color: C.ivory, padding: '0 90px', opacity: tag, transform: `translateY(${(1 - tag) * 30}px)`, textShadow: shadow}}>
          Ketika kekuasaan melampaui batas, sejarah menjadi saksi.
        </div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 1440, width: W - 160, textAlign: 'center', opacity: credit * 0.85, fontFamily: FONT.body, fontStyle: 'italic', fontWeight: 600, fontSize: 25, lineHeight: 1.3, color: C.parchment}}>
        Ilustrasi: foto sejarah dan miniatur Persia dari periode kemudian — bukan potret tokoh. Kutipan: Ibn al-Athir, Al-Kamil fi al-Tarikh.
      </div>
    </AbsoluteFill>
  );
};

export const OverlayView: React.FC<{o: Overlay; c: OverlayCtx}> = ({o, c}) => {
  switch (o.type) {
    case 'kicker': return <Kicker text={o.text} c={c} />;
    case 'caption': return <Caption text={o.text} c={c} />;
    case 'year': return <Year o={o} c={c} />;
    case 'plate': return <Plate o={o} c={c} />;
    case 'flow': return <Flow o={o} c={c} />;
    case 'bigword': return <BigWord o={o} c={c} />;
    case 'mihnah': return <MihnahTitle c={c} />;
    case 'caliphs': return <Caliphs c={c} />;
    case 'finale': return <Finale c={c} />;
  }
};
