import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Enter, Shot} from '../data/shots';
import {ArabicCard} from './ArabicCard';
import {CinematicImage} from './CinematicImage';
import {Bars, Lash, Reveal, lashShake} from './Effects';
import {MapShot} from './MapShot';
import {OverlayView, type OverlayCtx} from './Overlays';
import {C} from '../lib/theme';
import {clamp} from '../lib/theme';

/** Lama (frame) tiap transisi masuk. */
export const ENTER_FRAMES: Record<Enter, number> = {fade: 14, dip: 20, wipe: 22, iris: 26, flash: 12};

const enterStyle = (enter: Enter, frame: number): {style: React.CSSProperties; flash: number; dip: number} => {
  const n = ENTER_FRAMES[enter];
  const p = interpolate(frame, [0, n], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  switch (enter) {
    case 'wipe': return {style: {clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}, flash: 0, dip: 0};
    case 'iris': return {style: {clipPath: `circle(${p * 150}% at 50% 55%)`}, flash: 0, dip: 0};
    case 'flash': return {style: {opacity: p}, flash: Math.sin(p * Math.PI) * 0.55, dip: 0};
    case 'dip': return {style: {opacity: p}, flash: 0, dip: 1 - p};
    default: return {style: {opacity: p}, flash: 0, dip: 0};
  }
};

type Props = {shot: Shot; len: number; segStart: (id: string) => number; segEnd: (id: string) => number};

export const ShotView: React.FC<Props> = ({shot, len, segStart, segEnd}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = clamp(frame / Math.max(1, len), 0, 1);
  const {style, flash, dip} = enterStyle(shot.enter, frame);
  const ctx: OverlayCtx = {frame, fps, len, t, segStart};
  const shake = shot.kind === 'image' && shot.effect === 'lash' ? lashShake(frame, len) : {x: 0, y: 0};

  return (
    <AbsoluteFill style={style}>
      <AbsoluteFill style={{transform: `translate(${shake.x}px, ${shake.y}px) scale(${shake.x || shake.y ? 1.03 : 1})`}}>
        {shot.kind === 'map' && <MapShot frame={frame} fps={fps} len={len} />}
        {shot.kind === 'image' && (
          <>
            <CinematicImage img={shot.img} from={shot.from} to={shot.to} t={t} frame={frame} grade={shot.grade} layout={shot.layout} />
            {shot.effect === 'bars' && <Bars frame={frame} len={len} />}
            {shot.effect === 'lash' && <Lash frame={frame} len={len} />}
            {shot.effect === 'reveal' && <Reveal frame={frame} len={len} />}
            {shot.overlays.map((o, i) => <OverlayView key={i} o={o} c={ctx} />)}
          </>
        )}
        {shot.kind === 'arabic' && (
          <>
            <CinematicImage img={shot.img} from={shot.from} to={shot.to} t={t} frame={frame} grade={shot.grade} layout="full" brightness={0.7} />
            <ArabicCard
              frame={frame}
              fps={fps}
              len={len}
              arabic={shot.arabic}
              translation={shot.translation}
              arabicStart={segStart(shot.arabicSeg)}
              arabicEnd={segEnd(shot.arabicSeg)}
              transStart={segStart(shot.transSeg)}
            />
          </>
        )}
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{background: C.goldLight, opacity: flash, mixBlendMode: 'screen'}} />}
      {dip > 0 && <AbsoluteFill style={{background: '#000', opacity: dip * 0.85}} />}
    </AbsoluteFill>
  );
};
