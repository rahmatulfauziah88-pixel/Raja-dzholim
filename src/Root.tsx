import React from 'react';
import {Composition, staticFile, type CalculateMetadataFunction} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {MihnahVideo, type VideoProps} from './Video';
import type {Silence, TimingFile} from './lib/timeline';
import {FPS, H, TAIL_SEC, W} from './lib/theme';

const AUDIO = 'audio/narration.mp3';

/** Mengambil JSON opsional dari public/. Tidak ada = null; ada tetapi rusak = error (tidak diam-diam diabaikan). */
const fetchOptionalJson = async <T,>(path: string): Promise<T | null> => {
  let res: Response;
  try {
    res = await fetch(staticFile(path));
  } catch {
    return null;
  }
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.includes('json')) return null;
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error(`public/${path} ada tetapi bukan JSON yang valid. Perbaiki atau hapus file tersebut.`);
  }
};

const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({props}) => {
  let audioSec: number;
  if (props.previewWithoutAudio) {
    audioSec = props.previewSeconds;
  } else {
    try {
      audioSec = await getAudioDurationInSeconds(staticFile(AUDIO));
    } catch {
      throw new Error(
        'public/audio/narration.mp3 tidak ditemukan atau tidak dapat dibaca. ' +
          'Letakkan MP3 narasi final di public/audio/narration.mp3 (render final tidak memakai audio pengganti).',
      );
    }
  }
  const silences = props.previewWithoutAudio ? null : await fetchOptionalJson<{silences: Silence[]}>('audio/silences.json');
  const timing = await fetchOptionalJson<TimingFile>('audio/timing.json');
  return {
    durationInFrames: Math.ceil((audioSec + TAIL_SEC) * FPS),
    props: {...props, audioSec, silences: silences?.silences ?? [], timing},
  };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RajaDzolim"
    component={MihnahVideo}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={Math.ceil((120 + TAIL_SEC) * FPS)}
    defaultProps={{previewWithoutAudio: false, previewSeconds: 120} satisfies VideoProps}
    calculateMetadata={calculateMetadata}
  />
);
