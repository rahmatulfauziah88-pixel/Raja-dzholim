import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

type Face = {family: string; file: string; weight: string; style?: string};

const FACES: Face[] = [
  {family: 'Amiri', file: 'amiri-arabic-400-normal.woff2', weight: '400'},
  {family: 'Amiri', file: 'amiri-arabic-700-normal.woff2', weight: '700'},
  {family: 'Cinzel', file: 'cinzel-latin-600-normal.woff2', weight: '600'},
  {family: 'Cinzel', file: 'cinzel-latin-700-normal.woff2', weight: '700'},
  {family: 'Cormorant Garamond', file: 'cormorant-garamond-latin-600-normal.woff2', weight: '600'},
  {family: 'Cormorant Garamond', file: 'cormorant-garamond-latin-700-normal.woff2', weight: '700'},
  {family: 'Cormorant Garamond', file: 'cormorant-garamond-latin-600-italic.woff2', weight: '600', style: 'italic'},
];

// Font dimuat dari public/fonts. Jika gagal, render dihentikan (tidak diam-diam memakai font cadangan).
if (typeof document !== 'undefined') {
  const handle = delayRender('Memuat font Arab dan Latin');
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile('fonts/' + f.file)})`, {
        weight: f.weight,
        style: f.style ?? 'normal',
      });
      await face.load();
      (document.fonts as unknown as {add(f: FontFace): void}).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
}
