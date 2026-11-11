import type {ImageKey} from '../lib/images';
import {ARABIC_1, ARABIC_2, ARTI_1, ARTI_2} from './script';

export type Cam = {x: number; y: number; z: number};
export type Enter = 'fade' | 'wipe' | 'iris' | 'flash' | 'dip';
export type Grade = 'warm' | 'cold' | 'bw' | 'red' | 'gold';

export type Overlay =
  | {type: 'kicker'; text: string}
  | {type: 'caption'; text: string}
  | {type: 'year'; text: string; sub?: string; at?: number}
  | {type: 'plate'; text: string; sub?: string; at?: number}
  | {type: 'flow'; from: string; to: string; at?: number}
  | {type: 'bigword'; text: string; at?: number}
  | {type: 'mihnah'}
  | {type: 'caliphs'}
  | {type: 'finale'};

type Base = {id: string; scene: number; label: string; segs: string[]; enter: Enter};

export type ImageShot = Base & {
  kind: 'image';
  img: ImageKey;
  layout: 'full' | 'window';
  from: Cam;
  to: Cam;
  grade: Grade;
  effect?: 'bars' | 'lash' | 'reveal';
  overlays: Overlay[];
};

export type MapShot = Base & {kind: 'map'};

export type ArabicShot = Base & {
  kind: 'arabic';
  img: ImageKey;
  from: Cam;
  to: Cam;
  grade: Grade;
  arabicSeg: string;
  transSeg: string;
  arabic: string;
  translation: string;
  overlays: Overlay[];
};

export type Shot = ImageShot | MapShot | ArabicShot;

export const SRC_KAMIL = "Ibn al-Athir · Al-Kamil fi al-Tarikh · jld. 5, hlm. 572";
const MINIATUR = 'Miniatur Persia dari periode kemudian — ilustrasi, bukan dokumentasi langsung Mihnah.';

/**
 * 15 adegan (dengan sub-adegan). Kamera: x,y = titik fokus (0–1 dari gambar), z = zoom (≥1).
 */
export const SHOTS: Shot[] = [
  // 1 — Pembukaan istana Abbasiyah
  {id: 'sh01', scene: 1, label: 'Pembukaan istana Abbasiyah', segs: ['s01'], enter: 'fade', kind: 'image', img: 'palace', layout: 'full',
    from: {x: 0.12, y: 0.55, z: 1.0}, to: {x: 0.78, y: 0.5, z: 1.25}, grade: 'cold', effect: 'reveal',
    overlays: [{type: 'kicker', text: 'RAJA DZOLIM · TRAGEDI MIHNAH'}]},
  // 2 — Judul Mihnah + peta
  {id: 'sh02', scene: 2, label: 'Judul Mihnah', segs: ['s02a'], enter: 'flash', kind: 'image', img: 'archway', layout: 'full',
    from: {x: 0.5, y: 0.5, z: 1.0}, to: {x: 0.5, y: 0.45, z: 1.3}, grade: 'gold', overlays: [{type: 'mihnah'}]},
  {id: 'sh03', scene: 2, label: 'Peta Samarra dan arah Baghdad', segs: ['s02b'], enter: 'wipe', kind: 'map'},
  // 3 — Al-Ma'mun, 218 H
  {id: 'sh04', scene: 3, label: "Al-Ma'mun dan awal Mihnah 218 H", segs: ['s03a'], enter: 'iris', kind: 'image', img: 'court', layout: 'window',
    from: {x: 0.5, y: 0.6, z: 1.0}, to: {x: 0.5, y: 0.35, z: 1.35}, grade: 'warm',
    overlays: [
      {type: 'kicker', text: 'DINASTI ABBASIYAH'},
      {type: 'caption', text: MINIATUR},
      {type: 'year', text: '218 H', sub: "Khalifah Al-Ma'mun", at: 0.15},
    ]},
  // 4 — Manuskrip, khalq al-Qur'an
  {id: 'sh05', scene: 4, label: "Manuskrip Al-Qur'an dan khalq al-Qur'an", segs: ['s03b'], enter: 'fade', kind: 'image', img: 'quran', layout: 'full',
    from: {x: 0.2, y: 0.5, z: 1.0}, to: {x: 0.8, y: 0.5, z: 1.15}, grade: 'warm',
    overlays: [
      {type: 'kicker', text: "FOLIO MANUSKRIP AL-QUR'AN"},
      {type: 'bigword', text: "KHALQ AL-QUR'AN", at: 0.3},
    ]},
  // 5 — Surat perintah dan tekanan terhadap ulama
  {id: 'sh06', scene: 5, label: 'Surat perintah: pengantar kutipan', segs: ['s04'], enter: 'dip', kind: 'image', img: 'archway', layout: 'full',
    from: {x: 0.5, y: 0.55, z: 1.0}, to: {x: 0.5, y: 0.5, z: 1.45}, grade: 'warm',
    overlays: [{type: 'kicker', text: 'AL-KAMIL FI AL-TARIKH'}, {type: 'plate', text: 'SURAT PERINTAH', sub: 'Mihnah, 218 H', at: 0.35}]},
  {id: 'sh07', scene: 5, label: 'Ibarat Arab pertama', segs: ['s05a', 's05b'], enter: 'fade', kind: 'arabic', img: 'mihrab',
    from: {x: 0.5, y: 0.3, z: 1.0}, to: {x: 0.5, y: 0.5, z: 1.3}, grade: 'gold',
    arabicSeg: 's05a', transSeg: 's05b', arabic: ARABIC_1, translation: ARTI_1, overlays: []},
  {id: 'sh08', scene: 5, label: 'Ibarat Arab kedua', segs: ['s06', 's07a', 's07b'], enter: 'fade', kind: 'arabic', img: 'mihrab',
    from: {x: 0.5, y: 0.75, z: 1.2}, to: {x: 0.5, y: 0.55, z: 1.5}, grade: 'gold',
    arabicSeg: 's07a', transSeg: 's07b', arabic: ARABIC_2, translation: ARTI_2, overlays: []},
  {id: 'sh09', scene: 5, label: 'Keyakinan menjadi kebijakan negara', segs: ['s08'], enter: 'wipe', kind: 'image', img: 'ruins', layout: 'full',
    from: {x: 0.3, y: 0.5, z: 1.0}, to: {x: 0.7, y: 0.5, z: 1.2}, grade: 'bw',
    overlays: [{type: 'flow', from: 'KEYAKINAN', to: 'KEBIJAKAN NEGARA', at: 0.3}]},
  // 6 — Al-Mu'tasim
  {id: 'sh10', scene: 6, label: "Pergantian kekuasaan kepada Al-Mu'tasim", segs: ['s09'], enter: 'iris', kind: 'image', img: 'aerial', layout: 'full',
    from: {x: 0.2, y: 0.5, z: 1.0}, to: {x: 0.8, y: 0.5, z: 1.2}, grade: 'warm',
    overlays: [{type: 'flow', from: "AL-MA'MUN", to: "AL-MU'TASIM", at: 0.2}]},
  // 7 — Imam Ahmad bin Hanbal
  {id: 'sh11', scene: 7, label: 'Imam Ahmad bin Hanbal', segs: ['s10'], enter: 'fade', kind: 'image', img: 'man', layout: 'window',
    from: {x: 0.5, y: 0.45, z: 1.0}, to: {x: 0.5, y: 0.4, z: 1.25}, grade: 'cold',
    overlays: [
      {type: 'caption', text: 'Ilustrasi simbolis (detail miniatur Persia periode kemudian) — bukan potret tokoh.'},
      {type: 'plate', text: 'IMAM AHMAD BIN HANBAL', sub: 'Ulama ahli hadis', at: 0.35},
    ]},
  // 8 — Penahanan dan cambuk (simbolis)
  {id: 'sh12', scene: 8, label: 'Penahanan (simbolis)', segs: ['s11a'], enter: 'dip', kind: 'image', img: 'archway', layout: 'full',
    from: {x: 0.5, y: 0.5, z: 1.35}, to: {x: 0.5, y: 0.55, z: 1.0}, grade: 'cold', effect: 'bars', overlays: []},
  {id: 'sh13', scene: 8, label: 'Cambuk (simbolis)', segs: ['s11b'], enter: 'flash', kind: 'image', img: 'ruins', layout: 'full',
    from: {x: 0.6, y: 0.5, z: 1.15}, to: {x: 0.35, y: 0.55, z: 1.35}, grade: 'red', effect: 'lash', overlays: []},
  // 9 — Al-Wathiq
  {id: 'sh14', scene: 9, label: 'Al-Wathiq', segs: ['s12'], enter: 'wipe', kind: 'image', img: 'palace', layout: 'full',
    from: {x: 0.85, y: 0.5, z: 1.15}, to: {x: 0.3, y: 0.5, z: 1.0}, grade: 'cold',
    overlays: [{type: 'plate', text: 'KHALIFAH AL-WATHIQ', sub: 'Penerus kebijakan Mihnah', at: 0.3}]},
  // 10 — Ahmad bin Nasr al-Khuza'i, 231 H
  {id: 'sh15', scene: 10, label: "Ahmad bin Nasr al-Khuza'i, 231 H", segs: ['s13a'], enter: 'fade', kind: 'image', img: 'ruins', layout: 'full',
    from: {x: 0.75, y: 0.4, z: 1.5}, to: {x: 0.5, y: 0.5, z: 1.1}, grade: 'red',
    overlays: [
      {type: 'year', text: '231 H', sub: "Ahmad bin Nasr al-Khuza'i", at: 0.1},
    ]},
  {id: 'sh16', scene: 10, label: 'Konteks politik', segs: ['s13b'], enter: 'iris', kind: 'image', img: 'court', layout: 'full',
    from: {x: 0.3, y: 0.3, z: 1.6}, to: {x: 0.7, y: 0.45, z: 1.35}, grade: 'cold',
    overlays: [{type: 'caption', text: MINIATUR}, {type: 'bigword', text: 'KONTEKS POLITIK', at: 0.3}]},
  {id: 'sh17', scene: 10, label: 'Perkara hidup dan mati', segs: ['s13c'], enter: 'dip', kind: 'image', img: 'ruins', layout: 'full',
    from: {x: 0.2, y: 0.6, z: 1.2}, to: {x: 0.2, y: 0.4, z: 1.7}, grade: 'bw', overlays: [{type: 'bigword', text: 'HIDUP DAN MATI', at: 0.35}]},
  // 11 — Al-Mutawakkil, 232 H
  {id: 'sh18', scene: 11, label: 'Sejarah tidak berhenti', segs: ['s14a'], enter: 'fade', kind: 'image', img: 'minaret', layout: 'full',
    from: {x: 0.5, y: 0.95, z: 1.0}, to: {x: 0.5, y: 0.7, z: 1.1}, grade: 'cold', effect: 'reveal', overlays: []},
  {id: 'sh19', scene: 11, label: 'Al-Mutawakkil dan perubahan kebijakan', segs: ['s14b', 's14c'], enter: 'wipe', kind: 'image', img: 'minaret', layout: 'full',
    from: {x: 0.5, y: 0.75, z: 1.1}, to: {x: 0.5, y: 0.2, z: 1.35}, grade: 'gold',
    overlays: [{type: 'year', text: '± 232 H', sub: 'Khalifah Al-Mutawakkil', at: 0.05}]},
  // 12 — Empat khalifah, satu kebijakan
  {id: 'sh20', scene: 12, label: 'Empat khalifah, satu kebijakan', segs: ['s15'], enter: 'fade', kind: 'image', img: 'aerial', layout: 'full',
    from: {x: 0.5, y: 0.5, z: 1.05}, to: {x: 0.35, y: 0.45, z: 1.3}, grade: 'cold', overlays: [{type: 'caliphs'}]},
  // 13 — Refleksi
  {id: 'sh21', scene: 13, label: 'Refleksi penyalahgunaan kekuasaan', segs: ['s16'], enter: 'iris', kind: 'image', img: 'archway', layout: 'full',
    from: {x: 0.5, y: 0.5, z: 1.5}, to: {x: 0.5, y: 0.5, z: 1.0}, grade: 'gold',
    overlays: [{type: 'kicker', text: 'PELAJARAN MIHNAH'}]},
  // 14 — Manuskrip dan warisan sejarah
  {id: 'sh22', scene: 14, label: 'Jabatan berakhir', segs: ['s17a'], enter: 'fade', kind: 'image', img: 'quran', layout: 'full',
    from: {x: 0.85, y: 0.5, z: 1.1}, to: {x: 0.25, y: 0.5, z: 1.0}, grade: 'warm', overlays: []},
  {id: 'sh23', scene: 14, label: 'Catatan sejarah mengingat', segs: ['s17b'], enter: 'dip', kind: 'image', img: 'mihrab', layout: 'full',
    from: {x: 0.5, y: 0.65, z: 1.0}, to: {x: 0.5, y: 0.6, z: 1.45}, grade: 'gold', overlays: []},
  // 15 — Penutup monumental
  {id: 'sh24', scene: 15, label: 'Penutup: RAJA DZOLIM', segs: ['s18a', 's18b'], enter: 'flash', kind: 'image', img: 'minaret', layout: 'full',
    from: {x: 0.5, y: 0.95, z: 1.0}, to: {x: 0.5, y: 0.3, z: 1.2}, grade: 'gold', overlays: [{type: 'finale'}]},
];
