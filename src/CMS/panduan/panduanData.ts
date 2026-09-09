import React from 'react';
import {
  BookOpen,
  Calendar,
  FileCheck,
  CalendarRange,
  CalendarDays,
  FolderArchive,
  GraduationCap,
  LucideIcon
} from 'lucide-react';

export interface PanduanFormField {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface PanduanCategory {
  id: string;
  judul: string;
  subjudul: string;
  icon: LucideIcon;
  badge: string;
  gradientBg: string;
  badgeColor: string;
  penjelasan: string;
  ketentuan: string[];
  formatFile: string[];
  contohNamaFile: string;
  infoTambahan?: string;
  fields: PanduanFormField[];
  generateMessage: (data: Record<string, string>, namaGuru: string) => string;
}

export const PANDUAN_CATEGORIES: PanduanCategory[] = [
  {
    id: 'panduan-kurikulum',
    judul: 'PANDUAN KURIKULUM',
    subjudul: 'Panduan pengumpulan dokumen Panduan & Perangkat Kurikulum Sekolah.',
    icon: BookOpen,
    badge: 'Kurikulum',
    gradientBg: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    penjelasan: 'Silakan kumpulkan dokumen Panduan Kurikulum Operasional Satuan Pendidikan (KOSP/KOM) dan instrumen pendukung sesuai ketetapan kurikulum sekolah. Pastikan kelengkapan lembar pengesahan.',
    ketentuan: [
      'Dokumen telah direview secara mandiri sebelum dikumpulkan.',
      'Sertakan identitas mata pelajaran/tingkat kelas secara jelas.',
      'Dapat berupa file PDF dokumen resmi atau tautan penyimpanan Google Drive resmi.'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx / .doc)'],
    contohNamaFile: 'NamaGuru_PanduanKurikulum_TahunAjaran',
    infoTambahan: 'Kumpulkan tepat waktu sesuai jadwal kalender akademik yang telah ditetapkan oleh tim kurikulum.',
    fields: [
      { name: 'nama_dokumen', label: 'Nama Dokumen', type: 'text', placeholder: 'Contoh: Panduan Kurikulum Fase B IPAS', required: true },
      { name: 'keterangan', label: 'Keterangan Tambahan', type: 'text', placeholder: 'Catatan atau pesan tambahan (opsional)', required: false }
    ],
    generateMessage: (data, namaGuru) => {
      const namaDok = data.nama_dokumen?.trim() || '-';
      const ket = data.keterangan?.trim() ? `\nKeterangan: ${data.keterangan.trim()}` : '';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: PANDUAN KURIKULUM
Dokumen: ${namaDok}${ket}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'analisis-hari-efektif',
    judul: 'ANALISIS HARI EFEKTIF',
    subjudul: 'Panduan penghitungan dan pengumpulan Analisis Hari Efektif (HE).',
    icon: Calendar,
    badge: 'Administrasi',
    gradientBg: 'from-teal-600 to-cyan-700',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    penjelasan: 'Silakan kumpulkan dokumen Analisis Hari Efektif dan Rincian Minggu Efektif (RME) yang disesuaikan dengan kalender pendidikan tahun ajaran berjalan.',
    ketentuan: [
      'Penghitungan hari efektif semester gasal & genap terinci jelas.',
      'Sudah mencantumkan alokasi libur nasional, jeda tengah semester, dan asesmen.',
      'Format tabel rapi dan mudah dibaca.'
    ],
    formatFile: ['PDF (.pdf)', 'Excel (.xlsx / .xls)', 'Word (.docx)'],
    contohNamaFile: 'NamaGuru_AnalisisHariEfektif_Kelas_TahunAjaran',
    fields: [
      { name: 'tahun_pelajaran', label: 'Tahun Pelajaran', type: 'text', placeholder: 'Contoh: 2025/2026', required: true },
      {
        name: 'kelas',
        label: 'Kelas',
        type: 'select',
        options: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6', 'Semua Kelas'],
        required: true
      },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Analisis HE & RME Kelas 4 TA 2025/2026', required: true }
    ],
    generateMessage: (data, namaGuru) => {
      const tapel = data.tahun_pelajaran?.trim() || '-';
      const kls = data.kelas?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: ANALISIS HARI EFEKTIF
Tahun Pelajaran: ${tapel}
Kelas: ${kls}
Nama Dokumen: ${namaDok}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'bedah-cp',
    judul: 'BEDAH CP',
    subjudul: 'Panduan analisis Capaian Pembelajaran, TP, dan ATP Kurikulum Merdeka.',
    icon: FileCheck,
    badge: 'Capaian Pembelajaran',
    gradientBg: 'from-cyan-700 to-blue-700',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    penjelasan: 'Silakan kumpulkan dokumen analisis Bedah Capaian Pembelajaran (CP), perumusan Tujuan Pembelajaran (TP), dan Alur Tujuan Pembelajaran (ATP) sesuai fase yang diampu.',
    ketentuan: [
      'Menjabarkan elemen, kompetensi, dan lingkup materi esensial.',
      'Struktur alur tujuan pembelajaran runtut dan terpetakan semester.',
      'Mencakup rincian asesmen diagnostik dan formatif relevan.'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx)', 'Excel (.xlsx)'],
    contohNamaFile: 'NamaGuru_BedahCP_Fase_MataPelajaran',
    fields: [
      { name: 'mata_pelajaran', label: 'Mata Pelajaran', type: 'text', placeholder: 'Contoh: IPAS / Matematika / PJOK', required: true },
      {
        name: 'fase_kelas',
        label: 'Fase / Kelas',
        type: 'select',
        options: ['Fase A (Kelas 1 - 2)', 'Fase B (Kelas 3 - 4)', 'Fase C (Kelas 5 - 6)', 'Fase A', 'Fase B', 'Fase C', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
        required: true
      },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Bedah CP-TP-ATP Fase B IPAS', required: true }
    ],
    generateMessage: (data, namaGuru) => {
      const mapel = data.mata_pelajaran?.trim() || '-';
      const fase = data.fase_kelas?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: BEDAH CP
Mata Pelajaran: ${mapel}
Fase/Kelas: ${fase}
Nama Dokumen: ${namaDok}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'program-tahunan',
    judul: 'PROGRAM TAHUNAN',
    subjudul: 'Panduan penyusunan dan pengumpulan Program Tahunan (PROTA).',
    icon: CalendarRange,
    badge: 'Prota',
    gradientBg: 'from-blue-700 to-indigo-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    penjelasan: 'Silakan kumpulkan dokumen Program Tahunan (PROTA) yang memetakan alokasi jam pelajaran (JP) per mata pelajaran selama satu tahun ajaran penuh.',
    ketentuan: [
      'Alokasi jam pelajaran sesuai dengan ketetapan struktur kurikulum.',
      'Memuat pemetaan tema/bab/elemen untuk semester gasal dan genap.',
      'Lengkap dengan tanda tangan penyusun dan Kepala Sekolah.'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx)', 'Excel (.xlsx)'],
    contohNamaFile: 'NamaGuru_Prota_Kelas_MataPelajaran_TahunAjaran',
    fields: [
      { name: 'tahun_pelajaran', label: 'Tahun Pelajaran', type: 'text', placeholder: 'Contoh: 2025/2026', required: true },
      {
        name: 'kelas',
        label: 'Kelas',
        type: 'select',
        options: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6', 'Semua Kelas'],
        required: true
      },
      { name: 'mata_pelajaran', label: 'Mata Pelajaran', type: 'text', placeholder: 'Contoh: Matematika / Semua Mapel', required: true },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Prota Kelas 5 TA 2025/2026', required: true }
    ],
    generateMessage: (data, namaGuru) => {
      const tapel = data.tahun_pelajaran?.trim() || '-';
      const kls = data.kelas?.trim() || '-';
      const mapel = data.mata_pelajaran?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: PROGRAM TAHUNAN
Tahun Pelajaran: ${tapel}
Kelas: ${kls}
Mata Pelajaran: ${mapel}
Nama Dokumen: ${namaDok}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'program-semester',
    judul: 'PROGRAM SEMESTER',
    subjudul: 'Panduan penyusunan dan pengumpulan Program Semester (PROMES/PROSEM).',
    icon: CalendarDays,
    badge: 'Promes',
    gradientBg: 'from-indigo-700 to-violet-800',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    penjelasan: 'Silakan kumpulkan dokumen Program Semester (PROMES) yang membagi rincian pokok bahasan ke dalam matriks mingguan dan bulanan pada semester berjalan.',
    ketentuan: [
      'Sinkron dengan kalender pendidikan dan alokasi hari efektif.',
      'Distribusi jam pelajaran per minggu tersusun rapi.',
      'Sudah mencantumkan jadwal asesmen sumatif & projek P5 (jika ada).'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx)', 'Excel (.xlsx)'],
    contohNamaFile: 'NamaGuru_Promes_Kelas_Semester_TahunAjaran',
    fields: [
      { name: 'tahun_pelajaran', label: 'Tahun Pelajaran', type: 'text', placeholder: 'Contoh: 2025/2026', required: true },
      {
        name: 'semester',
        label: 'Semester',
        type: 'select',
        options: ['Semester 1 (Ganjil)', 'Semester 2 (Genap)'],
        required: true
      },
      {
        name: 'kelas',
        label: 'Kelas',
        type: 'select',
        options: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
        required: true
      },
      { name: 'mata_pelajaran', label: 'Mata Pelajaran', type: 'text', placeholder: 'Contoh: Bahasa Indonesia / Tematik', required: true },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Promes Semester 1 Kelas 3', required: true }
    ],
    generateMessage: (data, namaGuru) => {
      const tapel = data.tahun_pelajaran?.trim() || '-';
      const smt = data.semester?.trim() || '-';
      const kls = data.kelas?.trim() || '-';
      const mapel = data.mata_pelajaran?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: PROGRAM SEMESTER
Tahun Pelajaran: ${tapel}
Semester: ${smt}
Kelas: ${kls}
Mata Pelajaran: ${mapel}
Nama Dokumen: ${namaDok}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'modul-ajar-lkpd',
    judul: 'MODUL AJAR & LKPD',
    subjudul: 'Panduan pengumpulan Modul Ajar dan Lembar Kerja Peserta Didik (LKPD).',
    icon: GraduationCap,
    badge: 'Modul & LKPD',
    gradientBg: 'from-[#073632] via-[#0b4843] to-[#103632]',
    badgeColor: 'bg-emerald-50 text-teal-800 border-teal-200',
    penjelasan: 'Silakan kumpulkan Modul Ajar dan LKPD sesuai dengan ketentuan yang telah ditetapkan. Pastikan dokumen sudah diperiksa sebelum dikirim.',
    ketentuan: [
      'Modul ajar mencakup komponen tujuan pembelajaran, langkah kegiatan, dan asesmen.',
      'Sertakan Lembar Kerja Peserta Didik (LKPD) yang siap cetak / digital.',
      'Pastikan dokumen bebas dari plagiasi dan mengusung pembelajaran interaktif.'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx)', 'Tautan Google Drive'],
    contohNamaFile: 'NamaGuru_ModulAjar_Kelas_MataPelajaran',
    fields: [
      {
        name: 'kelas',
        label: 'Kelas',
        type: 'select',
        options: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
        required: true
      },
      { name: 'mata_pelajaran', label: 'Mata Pelajaran', type: 'text', placeholder: 'Contoh: IPAS / Matematika / PJOK', required: true },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Modul Ajar IPAS Bab 3 & LKPD', required: true },
      { name: 'keterangan', label: 'Keterangan Tambahan', type: 'text', placeholder: 'Catatan atau pesan tambahan (opsional)', required: false }
    ],
    generateMessage: (data, namaGuru) => {
      const kls = data.kelas?.trim() || '-';
      const mapel = data.mata_pelajaran?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';
      const ket = data.keterangan?.trim() ? `\nKeterangan: ${data.keterangan.trim()}` : '';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Kategori: MODUL AJAR & LKPD
Kelas: ${kls}
Mata Pelajaran: ${mapel}
Nama File: ${namaDok}${ket}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  },
  {
    id: 'mpls-asesmen',
    judul: 'MPLS & ASESMEN',
    subjudul: 'Panduan administrasi Masa Pengenalan Lingkungan Sekolah & Bank Soal Asesmen.',
    icon: FolderArchive,
    badge: 'MPLS & Asesmen',
    gradientBg: 'from-slate-700 to-slate-900',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    penjelasan: 'Silakan kumpulkan berkas kegiatan MPLS (Masa Pengenalan Lingkungan Sekolah) atau instrumen Asesmen (Diagnostik, Formatif, Sumatif Lingkup Materi, PTS, PAS/SAS).',
    ketentuan: [
      'Instrumen soal dilengkapi dengan kisi-kisi dan rubrik penilaian/kunci jawaban.',
      'Untuk berkas MPLS, lampirkan jadwal kegiatan, materi, dan dokumentasi pendukung.',
      'Gunakan format file resmi agar mudah dikompilasi oleh panitia ujian/sekolah.'
    ],
    formatFile: ['PDF (.pdf)', 'Word (.docx)', 'Excel (.xlsx)'],
    contohNamaFile: 'NamaGuru_AsesmenSAS_Kelas_MataPelajaran',
    fields: [
      {
        name: 'jenis_dokumen',
        label: 'Jenis Dokumen',
        type: 'select',
        options: [
          'Instrumen Asesmen Sumatif (SAS / STS)',
          'Asesmen Formatif & Diagnostik',
          'Administrasi / Laporan MPLS',
          'Bank Soal Ulangan Harian',
          'Kisi-Kisi & Rubrik Penilaian'
        ],
        required: true
      },
      {
        name: 'kelas_fase',
        label: 'Kelas / Fase',
        type: 'select',
        options: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6', 'Fase A', 'Fase B', 'Fase C', 'Semua Kelas'],
        required: true
      },
      { name: 'nama_dokumen', label: 'Nama Dokumen / File', type: 'text', placeholder: 'Contoh: Kisi-kisi & Naskah Soal SAS Semester 1', required: true },
      { name: 'keterangan', label: 'Keterangan Tambahan', type: 'text', placeholder: 'Catatan atau pesan tambahan (opsional)', required: false }
    ],
    generateMessage: (data, namaGuru) => {
      const jenis = data.jenis_dokumen?.trim() || '-';
      const kls = data.kelas_fase?.trim() || '-';
      const namaDok = data.nama_dokumen?.trim() || '-';
      const ket = data.keterangan?.trim() ? `\nKeterangan: ${data.keterangan.trim()}` : '';

      return `Assalamu’alaikum, saya ingin mengumpulkan dokumen.

Nama Guru: ${namaGuru}
Jenis Dokumen: ${jenis}
Kelas/Fase: ${kls}
Nama Dokumen: ${namaDok}${ket}

Dokumen akan saya kirimkan melalui WhatsApp ini.

Terima kasih.`;
    }
  }
];

/**
 * Format nomor WhatsApp ke format internasional (misal 08123... -> 628123...)
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  // Ambil hanya digit angka
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}
