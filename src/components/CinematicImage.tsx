import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import type {Cam, Grade} from '../data/shots';
import {IMAGES, type ImageKey} from '../lib/images';
import {C, H, W, clamp} from '../lib/theme';

export const GRADES: Record<Grade, {filter: string; wash: string; blend: React.CSSProperties['mixBlendMode']}> = {
  warm: {filter: 'sepia(0.32) saturate(0.95) contrast(1.12) brightness(0.8)', wash: 'rgba(90,50,20,0.45)', blend: 'multiply'},
  cold: {filter: 'saturate(0.7) contrast(1.15) brightness(0.72) hue-rotate(-8deg)', wash: 'rgba(10,22,52,0.55)', blend: 'multiply'},
  bw: {filter: 'grayscale(1) contrast(1.22) brightness(0.8)', wash: 'rgba(120,88,48,0.5)', blend: 'multiply'},
  red: {filter: 'grayscale(0.85) contrast(1.25) brightness(0.7)', wash: 'rgba(138,26,36,0.6)', blend: 'multiply'},
  gold: {filter: 'sepia(0.5) saturate(1.05) contrast(1.15) brightness(0.78)', wash: 'rgba(120,80,20,0.4)', blend: 'multiply'},
};

/** Menghitung ukuran dan posisi gambar (cover) untuk kamera tertentu tanpa meregangkan gambar. */
export const coverCam = (key: ImageKey, boxW: number, boxH: number, cam: Cam) => {
  const info = IMAGES[key];
  const s0 = Math.max(boxW / info.w, boxH / info.h);
  const s = s0 * Math.max(1, cam.z);
  const dw = info.w * s;
  const dh = info.h * s;
  const tx = clamp(boxW / 2 - cam.x * dw, boxW - dw, 0);
  const ty = clamp(boxH / 2 - cam.y * dh, boxH - dh, 0);
  return {dw, dh, tx, ty};
};

export const lerpCam = (from: Cam, to: Cam, t: number, frame: number): Cam => {
  const e = Easing.inOut(Easing.sin)(clamp(t, 0, 1));
  // Getar tangan sangat halus agar kamera terasa hidup.
  const sway = Math.sin(frame / 41) * 0.0035;
  const bob = Math.cos(frame / 53) * 0.003;
  return {
    x: interpolate(e, [0, 1], [from.x, to.x]) + sway,
    y: interpolate(e, [0, 1], [from.y, to.y]) + bob,
    z: interpolate(e, [0, 1], [from.z, to.z]),
  };
};

type Props = {
  img: ImageKey;
  from: Cam;
  to: Cam;
  t: number;
  frame: number;
  grade: Grade;
  layout?: 'full' | 'window';
  brightness?: number;
};

const PhotoLayer: React.FC<{img: ImageKey; boxW: number; boxH: number; cam: Cam; grade: Grade; extraFilter?: string}> = ({img, boxW, boxH, cam, grade, extraFilter}) => {
  const {dw, dh, tx, ty} = coverCam(img, boxW, boxH, cam);
  const g = GRADES[grade];
  return (
    <div style={{position: 'absolute', inset: 0, width: boxW, height: boxH, overflow: 'hidden'}}>
      <Img
        src={staticFile('img/' + IMAGES[img].file)}
        style={{position: 'absolute', left: tx, top: ty, width: dw, height: dh, maxWidth: 'none', filter: `${g.filter} ${extraFilter ?? ''}`}}
      />
      <div style={{position: 'absolute', inset: 0, background: g.wash, mixBlendMode: g.blend}} />
    </div>
  );
};

export const CinematicImage: React.FC<Props> = ({img, from, to, t, frame, grade, layout = 'full', brightness = 1}) => {
  const cam = lerpCam(from, to, t, frame);
  if (layout === 'full') {
    return (
      <AbsoluteFill style={{background: C.ink, opacity: brightness}}>
        <PhotoLayer img={img} boxW={W} boxH={H} cam={cam} grade={grade} />
      </AbsoluteFill>
    );
  }
  // Mode "window": latar blur bergerak lambat + jendela berbingkai emas bergerak berlawanan (parallax).
  const bgCam: Cam = {x: 0.5 + (from.x - 0.5) * 0.5 + (t - 0.5) * 0.06, y: 0.5 + (t - 0.5) * 0.08, z: 1.25};
  const winW = 940;
  const winH = 1040;
  const winTop = 300 - (t - 0.5) * 30;
  const winCam = lerpCam(from, to, t, frame);
  return (
    <AbsoluteFill style={{background: C.ink, opacity: brightness}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(t - 0.5) * 36}px) scale(1.04)`}}>
        <PhotoLayer img={img} boxW={W} boxH={H} cam={bgCam} grade={grade} extraFilter="blur(26px) brightness(0.55)" />
      </div>
      <div
        style={{
          position: 'absolute', left: (W - winW) / 2, top: winTop, width: winW, height: winH, overflow: 'hidden',
          border: `4px solid ${C.gold}`, boxShadow: '0 30px 90px rgba(0,0,0,0.75), inset 0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        <PhotoLayer img={img} boxW={winW} boxH={winH} cam={winCam} grade={grade} />
      </div>
    </AbsoluteFill>
  );
};
