export type ImageKey =
  | 'palace' | 'archway' | 'aerial' | 'ruins' | 'court'
  | 'man' | 'map' | 'minaret' | 'mihrab' | 'quran';

export type ImageInfo = {file: string; w: number; h: number};

/** Ukuran asli (px) tiap gambar; dipakai agar kamera tidak meregangkan gambar. */
export const IMAGES: Record<ImageKey, ImageInfo> = {
  palace: {file: '01_samarra_palace_exterior.jpg', w: 1536, h: 1149},
  archway: {file: '02_archway_corridor.jpg', w: 1536, h: 1143},
  aerial: {file: '03_palace_aerial_courtyard.jpg', w: 1536, h: 1020},
  ruins: {file: '04_historic_ruins_bw.jpg', w: 1536, h: 1284},
  court: {file: '05_persian_miniature_court.jpg', w: 1193, h: 1536},
  man: {file: '06_persian_miniature_man.jpg', w: 1150, h: 1536},
  map: {file: '07_samarra_historical_map.jpg', w: 1280, h: 2450},
  minaret: {file: '08_malwiya_minaret.jpg', w: 1024, h: 1536},
  mihrab: {file: '09_stone_mihrab_inscription.jpg', w: 1122, h: 1536},
  quran: {file: '10_quran_manuscript_folio.jpg', w: 1536, h: 1070},
};

export const IMAGE_FILES: string[] = Object.values(IMAGES).map((i) => i.file);
