import React, { useState } from 'react';
import { Plus, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { UserSession } from './types';
import { useAkademikData } from './hooks/useAkademikData';
import { AkademikMenuItem } from '../types';
import { AkademikCard } from './akademik/AkademikCard';
import { AkademikFormModal } from './akademik/AkademikFormModal';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';
import { getApiBaseUrl } from '../config/api';

interface AkademikCrudProps {
  currentUser: UserSession;
}

export default function AkademikCrud({ currentUser }: AkademikCrudProps) {
  const { items, loading, error, setError, fetchItems, deleteItem } = useAkademikData('all');
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkGdrive, setLinkGdrive] = useState('');
  const [isModul, setIsModul] = useState(false);
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState(true);

  // Confirm modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  const resetForm = () => {
    setEditId(null);
    setLabel('');
    setDeskripsi('');
    setLinkGdrive('');
    setIsModul(false);
    setUrutan(items.length + 1);
    setAktif(true);
    setError('');
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (item: AkademikMenuItem) => {
    setError('');
    setEditId(item.id);
    setLabel(item.label);
    setDeskripsi(item.deskripsi || '');
    setLinkGdrive(item.link_gdrive);
    setIsModul(Number(item.is_modul) === 1);
    setUrutan(item.urutan);
    setAktif(Number(item.aktif) === 1);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('action', editId ? 'update' : 'create');
    if (editId) formData.append('id', editId.toString());
    formData.append('label', label);
    formData.append('deskripsi', deskripsi);
    formData.append('link_gdrive', linkGdrive);
    formData.append('is_modul', isModul ? '1' : '0');
    formData.append('urutan', urutan.toString());
    formData.append('aktif', aktif ? '1' : '0');
    formData.append('role', currentUser.role);

    try {
      const response = await fetch(`${getApiBaseUrl()}/backend/API/akademik_menu.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 'success') {
        setToast({ type: 'success', text: result.message });
        setShowModal(false);
        resetForm();
        fetchItems();
      } else {
        setError(result.message || 'Gagal menyimpan menu akademik.');
        setToast({ type: 'error', text: result.message || 'Gagal menyimpan menu.' });
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setToast({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    }
  };

  const handleDelete = (item: AkademikMenuItem) => {
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Hapus Menu Akademik?',
      message: `Apakah Anda yakin ingin menghapus menu "${item.label}"? Menu ini tidak akan lagi tampil di navigasi dropdown publik.`,
      onConfirm: async () => {
        const ok = await deleteItem(item.id, currentUser.role);
        if (ok) {
          setToast({ type: 'success', text: `Menu "${item.label}" berhasil dihapus.` });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus menu akademik.' });
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <CmsToast message={toast} onClose={() => setToast(null)} />

      {/* Confirmation Modal */}
      <CmsConfirmModal
        isOpen={confirmState.isOpen}
        variant={confirmState.variant}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-100">
            <Layers size={14} /> Pengaturan Navigasi
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Menu Akademik (Google Drive)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Kelola daftar submenu yang tampil pada dropdown navigasi Akademik di website utama. Setiap item langsung mengarah ke halaman instruksi &amp; tombol Google Drive resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchItems()}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            title="Muat Ulang"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold shadow-lg shadow-teal-600/20 transition cursor-pointer"
          >
            <Plus size={18} /> Tambah Menu Akademik
          </button>
        </div>
      </div>

      {/* Grid of Akademik Menu Items */}
      {loading && items.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">Belum Ada Menu Akademik</h3>
          <p className="text-xs text-slate-500 mt-1">Tambahkan menu pertama untuk mengisi dropdown navigasi Akademik.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <AkademikCard
              key={item.id}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AkademikFormModal
        showModal={showModal}
        editId={editId}
        label={label}
        setLabel={setLabel}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        linkGdrive={linkGdrive}
        setLinkGdrive={setLinkGdrive}
        isModul={isModul}
        setIsModul={setIsModul}
        urutan={urutan}
        setUrutan={setUrutan}
        aktif={aktif}
        setAktif={setAktif}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
