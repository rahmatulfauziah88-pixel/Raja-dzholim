// Memastikan semua aset wajib tersedia. Gagal (exit 1) jika ada yang hilang — tidak ada latar kosong/audio pengganti.
import {existsSync, statSync} from 'node:fs';

const IMAGES = [
  '01_samarra_palace_exterior.jpg', '02_archway_corridor.jpg', '03_palace_aerial_courtyard.jpg',
  '04_historic_ruins_bw.jpg', '05_persian_miniature_court.jpg', '06_persian_miniature_man.jpg',
  '07_samarra_historical_map.jpg', '08_malwiya_minaret.jpg', '09_stone_mihrab_inscription.jpg',
  '10_quran_manuscript_folio.jpg',
];
const FONTS = [
  'amiri-arabic-400-normal.woff2', 'amiri-arabic-700-normal.woff2', 'cinzel-latin-600-normal.woff2',
  'cinzel-latin-700-normal.woff2', 'cormorant-garamond-latin-600-normal.woff2',
  'cormorant-garamond-latin-700-normal.woff2', 'cormorant-garamond-latin-600-italic.woff2',
];
const imagesOnly = process.argv.includes('--images-only');
const problems = [];
const need = (path, minBytes, label) => {
  if (!existsSync(path)) return problems.push(`HILANG   ${label}: ${path}`);
  if (statSync(path).size < minBytes) problems.push(`KOSONG   ${label}: ${path} (terlalu kecil)`);
};

IMAGES.forEach((f) => need(`public/img/${f}`, 20_000, 'gambar'));
FONTS.forEach((f) => need(`public/fonts/${f}`, 1_000, 'font'));
need('public/fx/grain.png', 1_000, 'tekstur grain');
if (!imagesOnly) need('public/audio/narration.mp3', 20_000, 'narasi MP3 final');

if (problems.length) {
  console.error('PEMERIKSAAN ASET GAGAL:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`OK: ${IMAGES.length} gambar, ${FONTS.length} font${imagesOnly ? '' : ', narration.mp3'} tersedia.`);
