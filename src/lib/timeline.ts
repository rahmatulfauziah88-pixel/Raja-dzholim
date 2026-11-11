import {SEGMENTS, type Segment} from '../data/script';
import {SHOTS, type Shot} from '../data/shots';

export type Silence = {start: number; end: number};
export type TimingFile = {segments: Record<string, {start: number; end: number}>};

export type TimedSegment = Segment & {start: number; end: number};
export type TimedShot = {shot: Shot; start: number; end: number};
export type Timeline = {segments: TimedSegment[]; shots: TimedShot[]; speechStart: number; speechEnd: number};

const stripHarakat = (s: string): string => s.replace(/[\u064B-\u065F\u0670]/g, '');

/** Bobot durasi ucapan: jumlah huruf + tambahan jeda di akhir kalimat. */
export const weightOf = (seg: Segment): number => {
  const base = seg.kind === 'arabic' ? stripHarakat(seg.text).replace(/\s/g, '').length * 1.6 + 4 : seg.text.length;
  const pause = seg.pause ?? (/[.?:!]$/.test(seg.text.trim()) ? 7 : 2);
  return base + pause;
};

const speechBounds = (durationSec: number, silences: Silence[]): [number, number] => {
  let start = 0.25;
  let end = durationSec - 0.35;
  if (silences.length > 0) {
    const first = silences[0];
    if (first.start <= 0.05) start = Math.min(first.end, 2.0);
    const last = silences[silences.length - 1];
    if (last.end >= durationSec - 0.05) end = Math.max(last.start, start + 1);
  }
  return [start, end];
};

/**
 * Membangun timeline.
 * 1) Jika timing.json ada: pakai waktu tiap segmen persis (wajib lengkap dan menaik).
 * 2) Jika tidak: bagi durasi bicara menurut bobot huruf, lalu tarik tiap batas segmen
 *    ke jeda hening terdekat (silences.json hasil `npm run analyze-audio`) dan kalibrasi ulang sisanya.
 */
export const buildTimeline = (
  durationSec: number,
  opts: {silences?: Silence[]; timing?: TimingFile | null; totalSec?: number} = {},
): Timeline => {
  const total = opts.totalSec ?? durationSec;
  const silences = opts.silences ?? [];
  const [speechStart, speechEnd] = speechBounds(durationSec, silences);
  const n = SEGMENTS.length;
  const starts: number[] = new Array<number>(n).fill(0);
  const ends: number[] = new Array<number>(n).fill(0);

  if (opts.timing) {
    let prev = -1;
    SEGMENTS.forEach((seg, i) => {
      const t = opts.timing?.segments[seg.id];
      if (!t) throw new Error(`timing.json: segmen "${seg.id}" belum ada.`);
      if (!(t.end > t.start) || t.start < prev) {
        throw new Error(`timing.json: waktu segmen "${seg.id}" tidak valid (harus menaik dan end > start).`);
      }
      starts[i] = t.start;
      ends[i] = t.end;
      prev = t.start;
    });
  } else {
    const weights = SEGMENTS.map(weightOf);
    const mids = silences.map((s) => (s.start + s.end) / 2).filter((m) => m > speechStart && m < speechEnd);
    let cursor = speechStart;
    let remainW = weights.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) {
      starts[i] = cursor;
      let boundary: number;
      if (i === n - 1) {
        boundary = speechEnd;
      } else {
        const remainT = speechEnd - cursor;
        const nominal = cursor + (remainT * weights[i]) / remainW;
        boundary = nominal;
        const tol = Math.min(1.3, remainT * (weights[i] / remainW) * 0.6 + 0.4);
        let best = Infinity;
        for (const m of mids) {
          const d = Math.abs(m - nominal);
          if (d < tol && d < best && m > cursor + 0.35) {
            best = d;
            boundary = m;
          }
        }
      }
      ends[i] = boundary;
      remainW -= weights[i];
      cursor = boundary;
    }
  }

  const segments: TimedSegment[] = SEGMENTS.map((s, i) => ({...s, start: starts[i], end: ends[i]}));
  const byId = new Map(segments.map((s) => [s.id, s]));

  const shots: TimedShot[] = SHOTS.map((shot, i) => {
    const first = byId.get(shot.segs[0]);
    if (!first) throw new Error(`Shot ${shot.id}: segmen ${shot.segs[0]} tidak ada.`);
    const start = i === 0 ? 0 : first.start;
    return {shot, start, end: total};
  });
  for (let i = 0; i < shots.length - 1; i++) shots[i].end = shots[i + 1].start;
  return {segments, shots, speechStart, speechEnd};
};

export type Word = {text: string; start: number; end: number};
export type Chunk = {text: string; start: number; end: number; words: Word[]};

/** Memecah satu segmen menjadi frasa subtitle pendek (maks. ±7 kata / 44 huruf) beserta waktu tiap kata. */
export const chunkSegment = (seg: TimedSegment): Chunk[] => {
  const words = seg.text.split(/\s+/).filter(Boolean);
  const groups: string[][] = [];
  let cur: string[] = [];
  const len = (g: string[]) => g.join(' ').length;
  words.forEach((w, i) => {
    cur.push(w);
    const endsPhrase = /[,.;:?!]$/.test(w);
    const full = cur.length >= 7 || len(cur) >= 44;
    const next = words[i + 1];
    const wouldOverflow = next !== undefined && len(cur) + next.length + 1 > 48;
    if (i === words.length - 1) return;
    if (full || wouldOverflow || (endsPhrase && cur.length >= 3)) {
      groups.push(cur);
      cur = [];
    }
  });
  if (cur.length) {
    if (groups.length && cur.length < 2) groups[groups.length - 1].push(...cur);
    else groups.push(cur);
  }
  const totalChars = groups.reduce((a, g) => a + g.join(' ').length + 1, 0);
  const dur = seg.end - seg.start;
  let t = seg.start;
  return groups.map((g) => {
    const cs = g.join(' ').length + 1;
    const cdur = (dur * cs) / totalChars;
    const wordChars = g.reduce((a, w) => a + w.length + 1, 0);
    let wt = t;
    const ws: Word[] = g.map((w) => {
      const wd = (cdur * (w.length + 1)) / wordChars;
      const out = {text: w, start: wt, end: wt + wd};
      wt += wd;
      return out;
    });
    const chunk = {text: g.join(' '), start: t, end: t + cdur, words: ws};
    t += cdur;
    return chunk;
  });
};
