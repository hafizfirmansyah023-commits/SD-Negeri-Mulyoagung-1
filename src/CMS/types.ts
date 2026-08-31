export interface UserSession {
    id: number;
    username: string;
    role: 'ADMIN' | 'TIM' | 'GURU';
    nama_penanggung_jawab: string;
    foto: string;
    foto_original?: string;
}


export type CmsTab = 'dashboard' | 'guru' | 'fasilitas' | 'galeri' | 'berita' | 'modul' | 'akademik' | 'user' | 'verifikasi' | 'sambutan' | 'pengumuman'| 'statistik' | 'pengaturan' | 'visimisi' | 'sejarah' | 'strukturorganisasi' | 'hero' | 'kontenutama' | 'ppdb' | 'kontak' | 'medsos';
