import { useEffect, useState } from 'react';
import { TEACHERS_DIRECTORY } from '../data/schoolData';
import { Teacher } from '../types';
import { getApiBaseUrl, getImageUrl } from '../config/api';

/**
 * Mengambil data guru/tendik dari backend (guru.php).
 * Jika API gagal atau mengembalikan data kosong, otomatis fallback
 * ke TEACHERS_DIRECTORY (data statis lokal).
 */
export const useTeachersData = (): Teacher[] => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/backend/API/guru.php`);
        const result = await response.json();

        if (result.status === 'success' && result.data && result.data.length > 0) {
          const mapped: Teacher[] = result.data.map((t: any) => ({
            id: t.id.toString(),
            name: t.nama,
            title: t.jabatan,
            role: t.jabatan,
            nip: t.nip || '',
            subject: t.tugas,
            image: t.foto
              ? getImageUrl(t.foto)
              : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            education: t.riwayat_pendidikan,
            gender: t.jenis_kelamin,
            status: t.status,
            quote: t.motto,
          }));
          setTeachers(mapped);
        } else {
          setTeachers(TEACHERS_DIRECTORY);
        }
      } catch (e) {
        setTeachers(TEACHERS_DIRECTORY);
      }
    };

    loadTeachers();
  }, []);

  return teachers;
};
