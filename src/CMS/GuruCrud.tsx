import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, BookOpen, GraduationCap, Users } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';

interface Teacher {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  tugas: string;
  foto: string;
  riwayat_pendidikan: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  status: string;
  motto: string;
}

const API_BASE = getApiBaseUrl();

export default function GuruCrud() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('Guru Wali Kelas');
  const [tugas, setTugas] = useState('');
  const [riwayatPendidikan, setRiwayatPendidikan] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [status, setStatus] = useState('');
  const [motto, setMotto] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/guru.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setTeachers(result.data || []);
      } else {
        setError(result.message || 'Gagal memuat data guru.');
      }
    } catch (err) {
      setError('Gagal menghubungi server backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const resetForm = () => {
    setNama('');
    setNip('');
    setJabatan('Guru Wali Kelas');
    setTugas('');
    setRiwayatPendidikan('');
    setJenisKelamin('Laki-laki');
    setStatus('');
    setMotto('');
    setFotoFile(null);
    setEditId(null);
    setError('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setError('');
    setEditId(t.id);
    setNama(t.nama);
    setNip(t.nip);
    setJabatan(t.jabatan);
    setTugas(t.tugas);
    setRiwayatPendidikan(t.riwayat_pendidikan);
    setJenisKelamin(t.jenis_kelamin);
    setStatus(t.status);
    setMotto(t.motto || '');
    setFotoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) {
      formData.append('id', editId.toString());
    }
    formData.append('nama', nama);
    formData.append('nip', nip ? nip.trim() : '');
    formData.append('jabatan', jabatan);
    formData.append('tugas', tugas);
    formData.append('riwayat_pendidikan', riwayatPendidikan);
    formData.append('jenis_kelamin', jenisKelamin);
    formData.append('status', status);
    formData.append('motto', motto);
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/guru.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        setShowModal(false);
        resetForm();
        fetchTeachers();
      } else {
        setError(result.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data guru ini?')) return;
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/guru.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchTeachers();
      } else {
        setError(result.message || 'Gagal menghapus data.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-teal-600" /> Direktori Guru & Tendik
          </h2>
          <p className="text-slate-500 text-sm">Kelola profil guru, kepala sekolah, dan staf kependidikan.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all transform hover:scale-102 cursor-pointer"
        >
          <Plus size={18} /> Tambah Guru / Staff
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                  {t.foto ? (
                    <img
                      src={getImageUrl(t.foto)}
                      alt={t.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-slate-400" />
                  )}
                  <span className="absolute top-3 right-3 bg-teal-600/90 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {t.jabatan}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{t.nama}</h3>
                  <p className="text-slate-400 text-xs font-mono">NIP. {t.nip}</p>
                  
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <BookOpen size={16} className="text-slate-400 shrink-0" />
                      <span>{t.tugas}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <GraduationCap size={16} className="text-slate-400 shrink-0" />
                      <span>{t.riwayat_pendidikan}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex justify-between pt-1">
                      <span>JK: {t.jenis_kelamin}</span>
                      <span>Status: {t.status}</span>
                    </div>
                    {t.motto && (
                      <p className="text-xs italic text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        "{t.motto}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="flex items-center gap-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Edit2 size={14} /> Ubah
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex items-center gap-1.5 text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}

          {teachers.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl text-center border border-slate-100">
              <User size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">Belum ada data guru/staff kependidikan.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-slate-100 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editId ? 'Ubah Profil Guru/Staff' : 'Tambah Guru/Staff Baru'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-slate-200 text-2xl font-semibold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama beserta gelar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">NIP</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 19820315..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Jabatan Utama</label>
                  <select
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Komite Sekolah">Komite Sekolah</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Guru Wali Kelas">Guru Wali Kelas</option>
                    <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                    <option value="Tata Usaha">Tata Usaha</option>
                    <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Tugas Spesifik / Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={tugas}
                    onChange={(e) => setTugas(e.target.value)}
                    placeholder="Contoh: Guru Kelas I, Agama Islam, PJOK, dll"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Status Kepegawaian</label>
                  <input
                    type="text"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="AKTIF,PENSIUN,MUTASI"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-sm font-medium mb-1.5">Riwayat Pendidikan</label>
                  <input
                    type="text"
                    required
                    value={riwayatPendidikan}
                    onChange={(e) => setRiwayatPendidikan(e.target.value)}
                    placeholder="Contoh: S1 PGSD Univ Negeri Malang"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Motto / Kutipan Pribadi</label>
                <textarea
                  rows={2}
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Contoh: Mendidik dengan hati, membentuk karakter mulia."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1.5">Foto Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-600 text-sm border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                <p className="text-slate-400 text-xs mt-1">Biarkan kosong jika tidak ingin mengubah foto.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
