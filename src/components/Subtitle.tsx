import React from 'react';
import {interpolate} from 'remotion';
import {chunkSegment, type TimedSegment} from '../lib/timeline';
import {C, FONT, W} from '../lib/theme';

/** Subtitle bahasa Indonesia: frasa pendek, kata aktif disorot emas, sinkron dengan waktu segmen. */
export const Subtitle: React.FC<{segments: TimedSegment[]; time: number}> = ({segments, time}) => {
  const seg = segments.find((s) => time >= s.start && time < s.end);
  if (!seg || seg.kind !== 'narration' || seg.sub === false) return null;
  const chunks = chunkSegment(seg);
  const chunk = chunks.find((c) => time >= c.start && time < c.end) ?? chunks[chunks.length - 1];
  const inP = interpolate(time, [chunk.start, chunk.start + 0.14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const isLast = chunk === chunks[chunks.length - 1];
  const outP = isLast ? interpolate(time, [chunk.end - 0.1, chunk.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <div
      style={{
        position: 'absolute', left: 70, bottom: 330, width: W - 140, textAlign: 'center', opacity: inP * outP,
        transform: `translateY(${(1 - inP) * 14}px)`, fontFamily: FONT.body, fontWeight: 700, fontSize: 68, lineHeight: 1.14,
        textShadow: '0 3px 16px rgba(0,0,0,0.95), 0 0 5px rgba(0,0,0,0.95), 0 0 2px #000',
      }}
    >
      {chunk.words.map((w, i) => {
        const active = time >= w.start && time < w.end;
        const upcoming = time < w.start;
        return (
          <span key={i} style={{color: active ? C.goldLight : C.ivory, opacity: upcoming ? 0.72 : 1, marginRight: 16, display: 'inline-block'}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
