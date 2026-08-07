export interface UserSession {
    id: number;
    username: string;
    role: 'ADMIN' | 'TIM';
    nama_penanggung_jawab: string;
    foto: string;
}

export type CmsTab = 'guru' | 'fasilitas' | 'galeri' | 'berita' | 'user' | 'verifikasi' | 'pengaturan';
