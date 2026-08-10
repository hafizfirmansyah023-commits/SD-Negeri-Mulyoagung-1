import { Teacher } from '../types';

// Ekstrak nomor & huruf kelas dari field "tugas"/subject seorang guru
// Contoh: "Kelas 3A" -> { number: 3, letter: 'A' }, "Wali Kelas 6B" -> { number: 6, letter: 'B' }
export const extractKelasInfo = (subject: string) => {
  const match = (subject || '').match(/kelas\s*(\d+)\s*([a-zA-Z]?)/i);
  if (match) {
    return { number: parseInt(match[1], 10), letter: (match[2] || '').toUpperCase() };
  }
  return { number: 999, letter: '' };
};

// Aturan pencocokan role/tugas guru terhadap kode target (dipakai oleh
// getTeacherNameByRole & findOrBuildTeacherObj agar tidak duplikasi logic)
const matchesRoleOrTask = (teacher: Teacher, term: string): boolean => {
  const subj = (teacher.subject || '').toLowerCase();
  const role = (teacher.role || teacher.title || '').toLowerCase();

  if (term === 'komite sekolah') return role.includes('komite');
  if (term === 'kepala sekolah') return role.includes('kepala');
  if (term === 'tata usaha') return role.includes('tata usaha') || subj.includes('tata usaha');
  if (term === 'unit perpustakaan') return subj.includes('perpustakaan') || role.includes('perpustakaan');
  if (term.startsWith('kelas ')) {
    const classCode = term.replace('kelas ', '').trim();
    return subj.includes(classCode) || subj.includes(`kelas ${classCode}`) || subj.includes(`fase ${classCode}`);
  }
  if (term === 'penjaga') return role.includes('penjaga') || subj.includes('penjaga');
  if (term === 'tenaga kebersihan') return role.includes('kebersihan') || subj.includes('kebersihan');
  if (term === 'tenaga keamanan') {
    return role.includes('keamanan') || role.includes('satpam') || subj.includes('keamanan') || subj.includes('satpam');
  }
  return false;
};

// Cari nama guru secara dinamis berdasarkan role/tugas dari data DB (guru_tendik).
// Dipakai untuk menampilkan nama di kotak-kotak Bagan Struktur.
export const getTeacherNameByRole = (
  teachers: Teacher[],
  targetRoleOrTask: string,
  fallbackName: string
): string => {
  if (!teachers || teachers.length === 0) return fallbackName;
  const term = targetRoleOrTask.toLowerCase();

  const matches = teachers.filter((t) => matchesRoleOrTask(t, term));

  if (matches.length === 1) return matches[0].name;
  if (matches.length > 1) return matches.map((m) => m.name).join(' & ');
  return fallbackName;
};

// Cari (atau bangun) objek Teacher lengkap dari DB, dipakai saat kotak Bagan
// Struktur diklik untuk menampilkan modal ringkasan profil.
export const findOrBuildTeacherObj = (
  teachers: Teacher[],
  targetRoleOrTask: string,
  fallbackName: string
): Teacher => {
  if (teachers && teachers.length > 0) {
    const term = targetRoleOrTask.toLowerCase();
    const fallbackTerm = fallbackName.toLowerCase();

    // 1. Coba cocokkan nama secara langsung
    let found = teachers.find(
      (t) => t.name.toLowerCase().includes(fallbackTerm) || fallbackTerm.includes(t.name.toLowerCase())
    );

    // 2. Jika tidak ketemu, cocokkan berdasarkan role/tugas
    if (!found) {
      found = teachers.find((t) => matchesRoleOrTask(t, term));
    }

    if (found) return found;
  }

  return {
    id: `modal-${targetRoleOrTask}`,
    name: fallbackName,
    title: targetRoleOrTask.toUpperCase(),
    role: targetRoleOrTask.toUpperCase(),
    nip: '-',
    subject: targetRoleOrTask,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    education: 'Pendidikan Pendidik / Tendik SD Negeri 1 Mulyoagung',
    gender: 'Laki-laki / Perempuan',
    status: 'Aktif',
    quote: 'Berdedikasi untuk kemajuan pendidikan siswa-siswi SD Negeri 1 Mulyoagung.',
  };
};

// Kelompokkan "Guru Mata Pelajaran" berdasarkan mapel (tugas) yang sama persis.
// Card baru otomatis muncul saat ada guru baru dengan mapel baru dari halaman admin.
export const getMapelGroups = (teachers: Teacher[]) => {
  const mapelTeachers = teachers.filter(
    (t) => (t.role || t.title || '').trim().toLowerCase() === 'guru mata pelajaran'
  );

  const groups: { [subjectKey: string]: { label: string; teachers: Teacher[] } } = {};

  mapelTeachers.forEach((t) => {
    const rawSubject = (t.subject || 'Lainnya').trim();
    const key = rawSubject.toLowerCase(); // normalisasi agar "PJOK" & "pjok" dianggap sama

    if (!groups[key]) {
      groups[key] = { label: rawSubject.toUpperCase(), teachers: [] };
    }
    groups[key].teachers.push(t);
  });

  return Object.values(groups).sort((a, b) => a.label.localeCompare(b.label));
};

export const ROLE_FILTERS = [
  'Semua',
  'Bagan Struktur',
  'Kepala Sekolah',
  'Komite Sekolah',
  'Guru Wali Kelas',
  'Guru Mata Pelajaran',
  'Tata Usaha',
  'Tenaga Kependidikan',
];

export const ROLE_ORDER: { [key: string]: number } = {
  'Kepala Sekolah': 1,
  'Komite Sekolah': 2,
  'Guru Wali Kelas': 3,
  'Guru Mata Pelajaran': 4,
  'Tata Usaha': 5,
  'Tenaga Kependidikan': 6,
};

export const CATEGORY_GROUPS = [
  { title: 'Kepimpinan & Komite Sekolah', roles: ['Kepala Sekolah', 'Komite Sekolah'] },
  { title: 'Tata Usaha', roles: ['Tata Usaha'] },
  { title: 'Guru Wali Kelas', roles: ['Guru Wali Kelas'] },
  { title: 'Guru Mata Pelajaran', roles: ['Guru Mata Pelajaran'] },
  { title: 'Tenaga Kependidikan', roles: ['Tenaga Kependidikan'] },
];

// Daftar Kelas A & B dipakai OrgChartSection untuk kolom "Guru Kelas"
export const KELAS_A_LIST = [
  { label: 'Kelas 1A', code: 'kelas 1a', default: 'SUNU HAYUTAMA, S.Pd.' },
  { label: 'Kelas 2A', code: 'kelas 2a', default: 'RATNA YULIYA KIRNAWATI, S.Pd.' },
  { label: 'Kelas 3A', code: 'kelas 3a', default: 'ADI KURNIAWAN, S.Pd.' },
  { label: 'Kelas 4A', code: 'kelas 4a', default: 'NUR AINI FARIDA, S.Pd.' },
  { label: 'Kelas 5A', code: 'kelas 5a', default: 'SITI MAISAROH, S.Pd.' },
  { label: 'Kelas 6A', code: 'kelas 6a', default: 'VIVIN NOHTAHFIAH, S.Pd.' },
];

export const KELAS_B_LIST = [
  { label: 'Kelas 1B', code: 'kelas 1b', default: 'PUTRI ANGGUN LIARTA, S.Pd.' },
  { label: 'Kelas 2B', code: 'kelas 2b', default: 'YUNIA NUR AFIYAH, S.Pd.' },
  { label: 'Kelas 3B', code: 'kelas 3b', default: 'SOQIBATUL ISLAMIYAH, S.Pd.' },
  { label: 'Kelas 4B', code: 'kelas 4b', default: 'SRI HARTATIK, S.Pd.' },
  { label: 'Kelas 5B', code: 'kelas 5b', default: 'YUNI TRI HARIANTI, S.IP., S.Pd.' },
  { label: 'Kelas 6B', code: 'kelas 6b', default: 'YULIDA ARIANI, S.Pd.' },
];

// Filter berdasarkan pencarian + role aktif, lalu urutkan sesuai ROLE_ORDER
// (khusus Guru Wali Kelas diurutkan dari kelas terendah ke tertinggi).
export const filterAndSortTeachers = (
  teachers: Teacher[],
  searchTerm: string,
  roleFilter: string
): Teacher[] => {
  return teachers
    .filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.nip && teacher.nip.includes(searchTerm));

      const matchesRole = roleFilter === 'Semua' || roleFilter === 'Bagan Struktur' || teacher.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const orderA = ROLE_ORDER[a.role] || 99;
      const orderB = ROLE_ORDER[b.role] || 99;
      if (orderA !== orderB) return orderA - orderB;

      if (a.role === 'Guru Wali Kelas' && b.role === 'Guru Wali Kelas') {
        const kelasA = extractKelasInfo(a.subject);
        const kelasB = extractKelasInfo(b.subject);
        if (kelasA.number !== kelasB.number) return kelasA.number - kelasB.number;
        return kelasA.letter.localeCompare(kelasB.letter);
      }

      return a.name.localeCompare(b.name);
    });
};
