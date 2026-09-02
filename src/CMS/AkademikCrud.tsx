import React, { useState } from 'react';
import { Plus, Layers, AlertCircle, RefreshCw, GripVertical, ExternalLink, Eye, EyeOff, Edit2, Trash2, LayoutGrid, ListOrdered } from 'lucide-react';
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
  const { items, loading, error, setError, fetchItems, deleteItem, reorderItems } = useAkademikData('all');
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // View Mode: 'list' (Drag & Drop Vertikal seperti Struktur Halaman) atau 'grid' (Card Lama)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteItem(item.id, currentUser.role);
        if (ok) {
          setToast({ type: 'success', text: `Menu "${item.label}" berhasil dihapus.` });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus menu akademik.' });
        }
      },
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newList = [...items];
    const [draggedItem] = newList.splice(draggedIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);

    const reordered = newList.map((item, idx) => ({
      ...item,
      urutan: idx + 1,
    }));

    setDraggedIndex(null);
    const ok = await reorderItems(reordered, currentUser.role);
    if (ok) {
      setToast({ type: 'success', text: 'Urutan menu akademik berhasil diperbarui!' });
    }
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
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-100">
            <Layers size={14} /> Pengaturan Navigasi
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Menu Akademik (Google Drive)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Kelola daftar submenu yang tampil pada dropdown navigasi Akademik di website utama. Geser (drag &amp; drop) secara vertikal untuk mengubah urutan tampilan dropdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 flex-1 sm:flex-initial justify-center sm:justify-start">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Vertikal Drag & Drop (Struktur Urutan)"
            >
              <ListOrdered size={15} />
              <span>Urutan</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu Grid"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer shrink-0"
          >
            <Plus size={17} />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
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
      ) : viewMode === 'list' ? (
        /* Vertical Drag and Drop List View (Mirip Struktur Halaman Utama) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <ListOrdered className="text-teal-600" size={20} />
                <span>Urutan Menu Akademik Dropdown</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tahan dan geser (drag &amp; drop) baris di bawah secara vertikal untuk mengubah urutan submenu di navbar.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              {items.length} Menu Terdaftar
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const isModul = Number(item.is_modul) === 1;
              const isAktif = Number(item.aktif) === 1;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-4 bg-slate-50 p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                    draggedIndex === index
                      ? 'opacity-40 border-teal-500 scale-[0.98] ring-2 ring-teal-500/20 bg-teal-50/30'
                      : 'border-slate-200 hover:border-teal-400 hover:shadow-sm'
                  }`}
                >
                  {/* Grip & Order & Label */}
                  <div className="flex items-center gap-3 shrink-0">
                    <GripVertical className="text-slate-400 shrink-0" size={20} />
                    <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 font-black text-xs flex items-center justify-center border border-teal-100 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 tracking-tight">
                        {item.label}
                      </span>
                      {isModul && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
                          Modul Ajar
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi & Link */}
                  <div className="flex-grow min-w-0 w-full md:w-auto">
                    <p className="text-xs text-slate-500 truncate">
                      {item.deskripsi || item.link_gdrive}
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 shrink-0">
                    <a
                      href={item.link_gdrive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 p-2 hover:bg-teal-50 rounded-xl transition"
                      title="Buka Link Google Drive"
                    >
                      <ExternalLink size={15} />
                    </a>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        isAktif
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {isAktif ? <Eye size={12} /> : <EyeOff size={12} />}
                      {isAktif ? 'Aktif' : 'Nonaktif'}
                    </span>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition cursor-pointer"
                      title="Ubah Menu"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Hapus Menu"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid Cards View (Tetap Mempertahankan Card Lama Asli) */
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

