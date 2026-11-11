// Menghasilkan public/audio/timing.estimate.json (perkiraan awal per segmen) untuk disunting manual.
// Pakai: npm run export-timing -- 118.4   (durasi MP3 dalam detik)
import {writeFileSync} from 'node:fs';
import {buildTimeline} from '../src/lib/timeline';

const dur = parseFloat(process.argv[2] ?? '');
if (!Number.isFinite(dur) || dur < 30) {
  console.error('Pakai: npm run export-timing -- <durasi_detik>');
  process.exit(1);
}
const tl = buildTimeline(dur);
const segments: Record<string, {start: number; end: number; text: string}> = {};
for (const s of tl.segments) segments[s.id] = {start: +s.start.toFixed(2), end: +s.end.toFixed(2), text: s.text};
writeFileSync('public/audio/timing.estimate.json', JSON.stringify({segments}, null, 2));
console.log('Ditulis: public/audio/timing.estimate.json. Ubah nilainya sesuai audio, lalu simpan sebagai timing.json.');
