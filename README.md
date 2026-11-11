# RAJA DZOLIM — Tragedi Mihnah (Remotion)

Dokumenter sejarah Islam, vertikal 1080×1920, 30 fps, H.264 MP4. Durasi mengikuti `public/audio/narration.mp3`.

## Isi proyek
- `public/img/` — 10 gambar sejarah asli (tidak diubah, tidak diregangkan)
- `public/audio/narration.mp3` — **belum ada**; dibuat terpisah (ChatGPT) lalu diletakkan di sini
- `src/data/script.ts` — naskah final + ibarat Arab
- `src/data/shots.ts` — 24 shot (15 adegan): gambar, kamera, efek, teks layar
- `src/lib/timeline.ts` — mesin timing subtitle dan adegan
- `scripts/` — pemeriksaan aset, analisis audio, ekspor timing
- `.github/workflows/render.yml` — render otomatis di GitHub Actions
- `NASKAH.md` — naskah lengkap + catatan sumber

## Cara merender (GitHub Actions, cocok dari HP)
1. Unggah isi proyek ini ke repositori GitHub.
2. Tambahkan MP3 narasi final ke `public/audio/narration.mp3` (nama harus persis).
3. Buka tab **Actions** → **Render RAJA DZOLIM** → **Run workflow**.
4. Setelah selesai, buka run tersebut → **Artifacts** → unduh `raja-dzolim-mp4`.

Workflow berhenti dengan error jika ada gambar, font, atau MP3 yang hilang. Tidak ada latar kosong atau audio pengganti.

## Cara merender (komputer)
```bash
npm ci
npm run render        # typecheck + cek aset + analisis audio + render -> out/raja-dzolim.mp4
```
`npm run analyze-audio` butuh `ffmpeg`.

## Sinkron subtitle dengan MP3
Durasi video = durasi MP3 + 1,5 detik. Tiga tingkat ketelitian:
1. **Otomatis (default)**: durasi bicara dibagi menurut panjang teks, lalu tiap pergantian segmen ditarik ke jeda hening terdekat dari `public/audio/silences.json` (dibuat `npm run analyze-audio`). Cocok bila narator berjeda di akhir kalimat.
2. **Tanpa analisis audio**: pembagian hanya berdasar panjang teks (kurang presisi).
3. **Manual presisi**: `npm run export-timing -- <durasi_detik>` membuat `public/audio/timing.estimate.json`. Sesuaikan `start`/`end` tiap segmen dengan audio, simpan sebagai `public/audio/timing.json`. File ini otomatis dipakai dan harus memuat semua segmen dengan waktu menaik; jika tidak, render gagal dengan pesan jelas.

## Pratinjau
```bash
npm run dev                    # Remotion Studio
```
Bila MP3 belum ada, di Studio ubah prop `previewWithoutAudio` menjadi `true` (muncul tulisan "PRATINJAU — BUKAN AUDIO FINAL"). Jangan dipakai untuk render final.

Cek satu frame:
```bash
npx remotion still src/index.ts RajaDzolim out/frame.png --frame=300 --props='{"previewWithoutAudio":true,"previewSeconds":118}'
```

## Mengubah isi
- Teks layar, kamera, gambar per adegan: `src/data/shots.ts`
- Naskah: `src/data/script.ts` (jangan diubah tanpa izin)
- Warna dan font: `src/lib/theme.ts`, font ada di `public/fonts/` (Amiri untuk Arab berharakat, Cinzel, Cormorant Garamond)

## Catatan akurasi dan hak cipta
- Miniatur Persia (gambar 05, 06) adalah karya periode kemudian; di video diberi keterangan dan tidak disebut sebagai potret tokoh.
- Tidak ada Sa'id bin Jubayr; penghentian Mihnah ditulis "sekitar 232 H".
- Periksa sumber dan lisensi tiap gambar sebelum publikasi (lihat `ASSET_MANIFEST.txt`).
- Periksa redaksi dan halaman kutipan Arab pada edisi *Al-Kamil fi al-Tarikh* sebelum publikasi.
