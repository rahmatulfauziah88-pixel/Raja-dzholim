import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import './fonts';
import {Dust, Grain, Rays, Vignette} from './components/Atmosphere';
import {ENTER_FRAMES, ShotView} from './components/ShotView';
import {Subtitle} from './components/Subtitle';
import {buildTimeline, type Silence, type TimingFile} from './lib/timeline';
import {C, FONT, TAIL_SEC} from './lib/theme';

export type VideoProps = {
  /** Hanya untuk pratinjau di Studio. Render final HARUS memakai audio sebenarnya (false). */
  previewWithoutAudio: boolean;
  previewSeconds: number;
  /** Diisi otomatis oleh calculateMetadata. */
  audioSec?: number;
  silences?: Silence[];
  timing?: TimingFile | null;
};

export const MihnahVideo: React.FC<VideoProps> = ({previewWithoutAudio, audioSec, silences, timing}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const totalSec = durationInFrames / fps;
  const aSec = audioSec ?? totalSec - TAIL_SEC;
  const timeline = useMemo(
    () => buildTimeline(aSec, {silences, timing, totalSec}),
    [aSec, silences, timing, totalSec],
  );
  const byId = useMemo(() => new Map(timeline.segments.map((s) => [s.id, s])), [timeline]);

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {!previewWithoutAudio && <Audio src={staticFile('audio/narration.mp3')} />}

      {timeline.shots.map((ts, i) => {
        const startF = Math.round(ts.start * fps);
        const next = timeline.shots[i + 1];
        const overlap = next ? ENTER_FRAMES[next.shot.enter] + 2 : 0;
        const endF = Math.round(ts.end * fps);
        const len = Math.max(1, endF - startF + overlap);
        const segStart = (id: string) => Math.round((byId.get(id)?.start ?? 0) * fps) - startF;
        const segEnd = (id: string) => Math.round((byId.get(id)?.end ?? 0) * fps) - startF;
        return (
          <Sequence key={ts.shot.id} from={startF} durationInFrames={len} name={`${ts.shot.scene}. ${ts.shot.label}`}>
            <ShotView shot={ts.shot} len={len} segStart={segStart} segEnd={segEnd} />
          </Sequence>
        );
      })}

      <Rays />
      <Vignette />
      <Dust />
      <Subtitle segments={timeline.segments} time={frame / fps} />
      <Grain />

      {previewWithoutAudio && (
        <div style={{position: 'absolute', top: 60, left: 0, width: '100%', textAlign: 'center', fontFamily: FONT.title, fontSize: 28, color: '#ff6a5a', letterSpacing: 4}}>
          PRATINJAU — BUKAN AUDIO FINAL
        </div>
      )}
    </AbsoluteFill>
  );
};
