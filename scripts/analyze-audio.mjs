// Mendeteksi jeda hening pada narration.mp3 (butuh ffmpeg) -> public/audio/silences.json.
// Dipakai agar pergantian adegan dan subtitle jatuh tepat pada jeda napas narator.
import {spawnSync} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs';

const file = 'public/audio/narration.mp3';
if (!existsSync(file)) {
  console.error('public/audio/narration.mp3 tidak ada.');
  process.exit(1);
}
const noise = process.env.SILENCE_DB ?? '-34dB';
const minDur = process.env.SILENCE_MIN ?? '0.22';
const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `silencedetect=noise=${noise}:d=${minDur}`, '-f', 'null', '-'], {encoding: 'utf8'});
if (r.error || r.status !== 0) {
  console.error('ffmpeg gagal dijalankan:', r.error?.message ?? r.stderr);
  process.exit(1);
}
const log = r.stderr;
const silences = [];
let start = null;
for (const line of log.split('\n')) {
  const s = line.match(/silence_start:\s*(-?[\d.]+)/);
  const e = line.match(/silence_end:\s*([\d.]+)/);
  if (s) start = Math.max(0, parseFloat(s[1]));
  if (e && start !== null) {
    silences.push({start: +start.toFixed(3), end: +parseFloat(e[1]).toFixed(3)});
    start = null;
  }
}
const dur = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
const duration = dur ? +dur[1] * 3600 + +dur[2] * 60 + parseFloat(dur[3]) : null;
if (start !== null && duration) silences.push({start: +start.toFixed(3), end: +duration.toFixed(3)});
writeFileSync('public/audio/silences.json', JSON.stringify({duration, noise, silences}, null, 2));
console.log(`Durasi ${duration}s, ${silences.length} jeda hening -> public/audio/silences.json`);
