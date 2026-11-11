/**
 * NASKAH FINAL — RAJA DZOLIM (Mihnah). Isi naskah TIDAK boleh diubah tanpa izin.
 * Beberapa kalimat dipecah menjadi segmen agar adegan dapat berganti tepat pada jedanya;
 * jika semua segmen digabung urut, hasilnya sama dengan naskah asli.
 *
 * kind:
 *  - narration : narasi biasa (tampil sebagai subtitle di bawah)
 *  - arabic    : ibarat Arab (tampil pada kartu Arab, bukan subtitle)
 *  - artinya   : terjemahan ibarat (tampil pada kartu Arab, bukan subtitle)
 */
export type SegKind = 'narration' | 'arabic' | 'artinya';

export type Segment = {
  id: string;
  kind: SegKind;
  text: string;
  /** false = subtitle bawah disembunyikan (teks sudah tampil sebagai judul besar). */
  sub?: boolean;
  /** Tambahan bobot jeda dramatis setelah segmen (setara jumlah huruf). */
  pause?: number;
};

export const ARABIC_1 = 'فَمَنْ أَقَرَّ أَنَّهُ مَخْلُوقٌ مُحْدَثٌ خُلِّيَ سَبِيلُهُ';
export const ARABIC_2 = 'وَمَنْ أَبَى أَعْلَمَهُ بِهِ لِيَأْمُرَهُ فِيهِ بِرَأْيِهِ';
export const ARTI_1 = "Barang siapa mengakui bahwa Al-Qur'an adalah makhluk yang diciptakan, maka ia dibebaskan.";
export const ARTI_2 = 'Barang siapa menolak, maka keadaannya dilaporkan kepada khalifah untuk diputuskan.';

export const SEGMENTS: Segment[] = [
  {id: 's01', kind: 'narration', text: 'Pernahkah seorang penguasa merasa bahwa kekuasaannya bukan hanya untuk mengatur rakyat, tetapi juga menentukan apa yang harus mereka yakini?'},
  {id: 's02a', kind: 'narration', text: 'Inilah Mihnah.', pause: 16},
  {id: 's02b', kind: 'narration', text: 'Sebuah ujian keyakinan yang terjadi pada masa Dinasti Abbasiyah.'},
  {id: 's03a', kind: 'narration', text: "Pada tahun 218 Hijriah, Khalifah Al-Ma'mun memerintahkan para pejabatnya untuk menguji para hakim dan ulama ahli hadis"},
  {id: 's03b', kind: 'narration', text: "mengenai keyakinan bahwa Al-Qur'an adalah makhluk."},
  {id: 's04', kind: 'narration', text: 'Dalam surat perintah yang dinukil dalam kitab Al-Kamil fi al-Tarikh, terdapat kalimat:'},
  {id: 's05a', kind: 'arabic', text: ARABIC_1},
  {id: 's05b', kind: 'artinya', text: 'Artinya: ' + ARTI_1},
  {id: 's06', kind: 'narration', text: 'Kemudian disebutkan:'},
  {id: 's07a', kind: 'arabic', text: ARABIC_2},
  {id: 's07b', kind: 'artinya', text: 'Artinya: ' + ARTI_2},
  {id: 's08', kind: 'narration', text: 'Demikianlah, sebuah persoalan keyakinan berubah menjadi kebijakan negara.'},
  {id: 's09', kind: 'narration', text: "Setelah Al-Ma'mun wafat, Khalifah Al-Mu'tasim meneruskan kebijakan tersebut."},
  {id: 's10', kind: 'narration', text: 'Di antara ulama yang mengalami tekanan adalah Imam Ahmad bin Hanbal.'},
  {id: 's11a', kind: 'narration', text: "Beliau dipenjara dan dicambuk karena menolak menyatakan Al-Qur'an sebagai makhluk."},
  {id: 's11b', kind: 'narration', text: 'Bayangkan, seorang ulama yang mempertahankan keyakinannya harus menghadapi cambuk atas nama kekuasaan.'},
  {id: 's12', kind: 'narration', text: 'Kemudian datang masa Khalifah Al-Wathiq.'},
  {id: 's13a', kind: 'narration', text: "Pada tahun 231 Hijriah, Ahmad bin Nasr al-Khuza'i dihukum mati setelah peristiwa penolakannya terhadap doktrin yang dipaksakan penguasa."},
  {id: 's13b', kind: 'narration', text: 'Peristiwa ini juga memiliki konteks politik yang harus dijelaskan secara hati-hati.'},
  {id: 's13c', kind: 'narration', text: 'Perbedaan keyakinan telah berubah menjadi perkara hidup dan mati.'},
  {id: 's14a', kind: 'narration', text: 'Namun sejarah tidak berhenti di sana.', pause: 10},
  {id: 's14b', kind: 'narration', text: 'Ketika Al-Mutawakkil naik takhta, kebijakan Mihnah mulai ditinggalkan sekitar tahun 232 Hijriah.'},
  {id: 's14c', kind: 'narration', text: 'Tekanan negara terhadap para ulama berangsur mereda.'},
  {id: 's15', kind: 'narration', text: 'Empat khalifah. Sebuah kebijakan. Dan luka panjang dalam sejarah umat Islam.'},
  {id: 's16', kind: 'narration', text: 'Mihnah menjadi pelajaran bahwa kekuasaan dapat memaksa manusia mengucapkan sesuatu, tetapi tidak berhak mengubah kebenaran dengan ancaman.'},
  {id: 's17a', kind: 'narration', text: 'Sebab jabatan akan berakhir. Kekuasaan akan berlalu.'},
  {id: 's17b', kind: 'narration', text: 'Namun catatan sejarah akan tetap mengingat siapa yang menindas dan siapa yang bertahan.'},
  {id: 's18a', kind: 'narration', text: 'RAJA DZOLIM.', sub: false, pause: 14},
  {id: 's18b', kind: 'narration', text: 'Ketika kekuasaan melampaui batas, sejarah menjadi saksi.', sub: false},
];

export const SEGMENT_MAP: Record<string, Segment> = Object.fromEntries(SEGMENTS.map((s) => [s.id, s]));
