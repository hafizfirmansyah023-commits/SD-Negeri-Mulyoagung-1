import React, { useState } from 'react';
import { Plus, User, Users, RotateCcw } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { useTeacherData, Teacher } from './hooks/useTeacherData';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { GuruCard } from './guru/GuruCard';
import { GuruFormModal } from './guru/GuruFormModal';
import { ImageUploadPayload } from './components/ImageUploadField';

const API_BASE = getApiBaseUrl();

export default function GuruCrud() {
  const {
    teachers,
    loading,
    error,
    setError,
    success,
    setSuccess,
    fetchTeachers,
    deleteTeacher,
  } = useTeacherData();

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('Guru Wali Kelas');
  const [tugas, setTugas] = useState('');
  const [riwayatPendidikan, setRiwayatPendidikan] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [status, setStatus] = useState('Aktif');
  const [motto, setMotto] = useState('');
  const [fotoSelection, setFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });
  const [currentFoto, setCurrentFoto] = useState('');
  const [currentOriginalFoto, setCurrentOriginalFoto] = useState('');

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems: filteredTeachers,
  } = useCmsFilter<Teacher>({
    items: teachers,
    searchFields: ['nama', 'nip', 'tugas', 'riwayat_pendidikan'],
    initialFilters: { jabatan: 'ALL', jenis_kelamin: 'ALL', status: 'ALL' },
  });

  const availableJabatan = getUniqueValues(teachers, 'jabatan');
  const availableGenders = getUniqueValues(teachers, 'jenis_kelamin');
  const availableStatuses = getUniqueValues(teachers, 'status');

  const resetForm = () => {
    setNama('');
    setNip('');
    setJabatan('Guru Wali Kelas');
    setTugas('');
    setRiwayatPendidikan('');
    setJenisKelamin('Laki-laki');
    setStatus('Aktif');
    setMotto('');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto('');
    setCurrentOriginalFoto('');
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
    setStatus(t.status || 'Aktif');
    setMotto(t.motto || '');
    setFotoSelection({ original: null, cropped: null });
    setCurrentFoto(t.foto || '');
    setCurrentOriginalFoto(t.foto_original || '');
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
    formData.append('nip', nip);
    formData.append('jabatan', jabatan);
    formData.append('tugas', tugas);
    formData.append('riwayat_pendidikan', riwayatPendidikan);
    formData.append('jenis_kelamin', jenisKelamin);
    formData.append('status', status);
    formData.append('motto', motto);
    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
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
        setError(result.message || 'Gagal menyimpan data guru.');
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data guru ini?')) return;
    await deleteTeacher(id);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-teal-600 shrink-0" /> Manajemen Guru & Staff
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola profil guru, staf tata usaha, dan tenaga kependidikan sekolah.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
        >
          <Plus size={18} /> Tambah Guru / Staff
        </button>
      </div>

      {/* Filter Bar Component */}
      <CmsFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari nama, NIP, tugas, pendidikan..."
        isFiltered={isFiltered}
        onReset={resetFilter}
        selectFilters={[
          {
            key: 'jabatan',
            value: filters.jabatan || 'ALL',
            onChange: (val) => setFilter('jabatan', val),
            options: [
              { value: 'ALL', label: 'Semua Jabatan' },
              ...availableJabatan.map((j) => ({ value: j, label: j })),
            ],
          },
          {
            key: 'jenis_kelamin',
            value: filters.jenis_kelamin || 'ALL',
            onChange: (val) => setFilter('jenis_kelamin', val),
            options: [
              { value: 'ALL', label: 'Semua Gender' },
              ...availableGenders.map((g) => ({ value: g, label: g })),
            ],
          },
          {
            key: 'status',
            value: filters.status || 'ALL',
            onChange: (val) => setFilter('status', val),
            options: [
              { value: 'ALL', label: 'Semua Status' },
              ...availableStatuses.map((st) => ({ value: st, label: st })),
            ],
          },
        ]}
      />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {/* Teacher Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTeachers.map((t) => (
            <GuruCard
              key={t.id}
              teacher={t}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}

          {filteredTeachers.length === 0 && (
            <div className="col-span-full bg-white p-8 sm:p-12 rounded-2xl text-center border border-slate-100">
              <User size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-sm">
                {isFiltered ? 'Tidak ada data guru/staff yang sesuai dengan filter atau kata kunci pencarian.' : 'Belum ada data guru/staff kependidikan.'}
              </p>
              {isFiltered && (
                <button
                  onClick={resetFilter}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} /> Reset Filter
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <GuruFormModal
        showModal={showModal}
        editId={editId}
        currentFoto={currentFoto}
        currentOriginalFoto={currentOriginalFoto}
        nama={nama}
        setNama={setNama}
        nip={nip}
        setNip={setNip}
        jabatan={jabatan}
        setJabatan={setJabatan}
        tugas={tugas}
        setTugas={setTugas}
        riwayatPendidikan={riwayatPendidikan}
        setRiwayatPendidikan={setRiwayatPendidikan}
        jenisKelamin={jenisKelamin}
        setJenisKelamin={setJenisKelamin}
        status={status}
        setStatus={setStatus}
        motto={motto}
        setMotto={setMotto}
        setFotoSelection={setFotoSelection}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
