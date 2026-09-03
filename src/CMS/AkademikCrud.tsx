import React, { useState } from 'react';
import { Plus, FolderPlus, Layers, AlertCircle, RefreshCw, GripVertical, ExternalLink, Eye, EyeOff, Edit2, Trash2, LayoutGrid, ListOrdered, FolderOpen, ChevronDown } from 'lucide-react';
import { UserSession } from './types';
import { useAkademikData } from './hooks/useAkademikData';
import { AkademikMenuItem } from '../types';
import { AkademikCard } from './akademik/AkademikCard';
import { AkademikFormModal } from './akademik/AkademikFormModal';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';
import { getApiBaseUrl } from '../config/api';
import { buildAkademikTree, getCategories } from '../utils/akademikHelpers';

interface AkademikCrudProps {
  currentUser: UserSession;
}

export default function AkademikCrud({ currentUser }: AkademikCrudProps) {
  const { items, loading, error, setError, fetchItems, deleteItem, reorderItems } = useAkademikData('all');
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // View Mode: 'list' (Drag & Drop Vertikal) atau 'grid' (Card)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Drag and Drop State: draggable item dan kategori target/pindah
  const [dragId, setDragId] = useState<number | null>(null);
  const [dragType, setDragType] = useState<'category' | 'item' | null>(null);
  const [dropTarget, setDropTarget] = useState<{ type: 'category' | 'item'; catId: number | null; index: number } | null>(null);

  // Expand / collapse per kategori (key = id kategori)
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [linkGdrive, setLinkGdrive] = useState('');
  const [isModul, setIsModul] = useState(false);
  const [urutan, setUrutan] = useState(1);
  const [aktif, setAktif] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);

  // Confirm modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  const categories = getCategories(items);
  const tree = buildAkademikTree(items);

  const openCreateCategory = () => {
    setEditId(null);
    setLabel('');
    setDeskripsi('');
    setLinkGdrive('');
    setIsModul(false);
    setUrutan(categories.length + 1);
    setAktif(true);
    setParentId(null);
    setError('');
    setShowModal(true);
  };

  const openCreateItem = (catId: number | null = null) => {
    setEditId(null);
    setLabel('');
    setDeskripsi('');
    setLinkGdrive('');
    setIsModul(false);
    setUrutan(items.length + 1);
    setAktif(true);
    setParentId(catId);
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: AkademikMenuItem) => {
    setError('');
    const isCat = !item.parent_id || Number(item.parent_id) === 0;
    setEditId(item.id);
    setLabel(item.label);
    setDeskripsi(item.deskripsi || '');
    setLinkGdrive(item.link_gdrive || '');
    setIsModul(Number(item.is_modul) === 1);
    setUrutan(item.urutan);
    setAktif(Number(item.aktif) === 1);
    setParentId(isCat ? null : Number(item.parent_id));
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
    formData.append('parent_id', parentId === null ? '' : String(parentId));
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
    const isCat = !item.parent_id || Number(item.parent_id) === 0;
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: isCat ? 'Hapus Kategori?' : 'Hapus Item Akademik?',
      message: isCat
        ? `Apakah Anda yakin ingin menghapus kategori "${item.label}"? Kategori hanya dapat dihapus jika sudah tidak berisi item.`
        : `Apakah Anda yakin ingin menghapus item "${item.label}"? Item ini tidak akan lagi tampil.`,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const ok = await deleteItem(item.id, currentUser.role);
        if (ok) {
          setToast({ type: 'success', text: `"${item.label}" berhasil dihapus.` });
        } else {
          setToast({ type: 'error', text: 'Gagal menghapus. Kategori mungkin masih berisi item.' });
        }
      },
    });
  };

  // --- Drag & Drop lintas kategori ---
  const handleDragStart = (e: React.DragEvent, item: AkademikMenuItem) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragId(item.id);
    setDragType(!item.parent_id || Number(item.parent_id) === 0 ? 'category' : 'item');
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragType(null);
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, catId: number | null, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragId === null) return;

    // Cari item yang di-drag
    const dragged = items.find((i) => i.id === dragId);
    if (!dragged) return;

    const draggedIsCat = !dragged.parent_id || Number(dragged.parent_id) === 0;

    // Kategori hanya boleh diseret ke posisi kategori lain (catId null = root area)
    if (draggedIsCat) {
      if (catId !== null) {
        setDragId(null);
        return;
      }
      // Kategori masuk ke index dalam daftar kategori root
      const rootCats = items.filter((i) => !i.parent_id || Number(i.parent_id) === 0);
      const reorderedCats = rootCats.filter((i) => i.id !== dragId);
      reorderedCats.splice(index, 0, dragged);
      const allNew = [
        ...reorderedCats.map((c, idx) => ({ id: c.id, parent_id: null, urutan: idx + 1 })),
        ...items.filter((i) => i.parent_id && Number(i.parent_id) > 0).map((i) => ({ id: i.id, parent_id: i.parent_id, urutan: i.urutan })),
      ];
      const ok = await reorderItems(allNew, currentUser.role);
      if (ok) setToast({ type: 'success', text: 'Urutan kategori berhasil diperbarui!' });
      setDragId(null);
      return;
    }

    // Item: pindahkan ke kategori target (catId) dengan urutan index dalam kategori tsb
    const targetChildren = items.filter((i) => Number(i.parent_id) === Number(catId) && i.id !== dragId);
    targetChildren.splice(index, 0, dragged);

    const allNew = [
      ...items.filter((i) => !i.parent_id || Number(i.parent_id) === 0).map((c, ci) => ({ id: c.id, parent_id: null, urutan: ci + 1 })),
      ...items.filter((i) => i.parent_id && Number(i.parent_id) > 0 && i.id !== dragId && Number(i.parent_id) !== Number(catId)).map((i) => ({ id: i.id, parent_id: i.parent_id, urutan: i.urutan })),
      ...targetChildren.map((c, idx) => ({ id: c.id, parent_id: catId, urutan: idx + 1 })),
    ];
    const ok = await reorderItems(allNew, currentUser.role);
    if (ok) setToast({ type: 'success', text: 'Item berhasil dipindah ke kategori target!' });
    setDragId(null);
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
            Menu Akademik (Kategori &amp; Item)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Kelola kategori &amp; item dropdown Akademik. Seret item ke kategori lain (drag lintas kategori) atau atur urutannya. Kategori menampung beberapa item.
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
              title="Tampilan Vertikal Drag & Drop (Urutan & Kategori)"
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
            onClick={openCreateCategory}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition cursor-pointer shrink-0"
          >
            <FolderPlus size={17} />
            <span>Tambah Kategori</span>
          </button>

          <button
            onClick={() => openCreateItem()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer shrink-0"
          >
            <Plus size={17} />
            <span>Tambah Item</span>
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
          <p className="text-xs text-slate-500 mt-1">Tambahkan kategori &amp; item pertama untuk mengisi dropdown navigasi Akademik.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* Vertical Drag and Drop List View (multi-kategori, cross-category drop) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
                <ListOrdered className="text-teal-600" size={20} />
                <span>Urutan &amp; Kategori Menu Akademik</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Seret kategori untuk mengurutkannya. Seret item ke dalam kategori lain untuk memindahkannya.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              {categories.length} Kategori • {items.length - categories.length} Item
            </span>
          </div>

          <div className="space-y-4">
            {tree.map((cat, catIndex) => (
              <div
                key={cat.item.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, null, catIndex)}
                className={`rounded-2xl border transition-all ${dragId && dragType === 'item' ? 'border-teal-300 ring-2 ring-teal-200/50' : 'border-slate-200'} overflow-hidden`}
              >
                {/* Kategori Header (bisa di-drag utk urut antar kategori) */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, cat.item)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between gap-2 px-4 py-3 bg-amber-50/70 border-b border-amber-100 cursor-grab active:cursor-grabbing ${
                    dragId === cat.item.id ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="text-amber-400 shrink-0" size={18} />
                    <FolderOpen size={16} className="text-amber-600 shrink-0" />
                    <span className="font-bold text-sm text-slate-800 truncate">{cat.item.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800">
                      Kategori
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-500">{cat.children.length} item</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        Number(cat.item.aktif) === 1
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {Number(cat.item.aktif) === 1 ? <Eye size={11} /> : <EyeOff size={11} />}
                      {Number(cat.item.aktif) === 1 ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <button onClick={() => openCreateItem(cat.item.id)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition" title="Tambah item di kategori ini">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => handleOpenEdit(cat.item)} className="p-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition" title="Ubah Kategori">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(cat.item)} className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Hapus Kategori">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Item dalam kategori */}
                <div className="px-3 py-2 space-y-2">
                  {cat.children.length === 0 && (
                    <button
                      onClick={() => openCreateItem(cat.item.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, cat.item.id, 0)}
                      className="w-full text-left px-3 py-2 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 hover:text-teal-600 hover:border-teal-300 transition"
                    >
                      Kosong — Seret item ke sini atau tambahkan item baru
                    </button>
                  )}
                  {cat.children.map((child, idx) => (
                    <div
                      key={child.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, child)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, cat.item.id, idx)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-grab active:cursor-grabbing ${
                        dragId === child.id ? 'opacity-40 border-teal-500' : 'hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical className="text-slate-400 shrink-0" size={16} />
                        <span className="font-medium text-sm text-slate-700 truncate">{child.label}</span>
                        {Number(child.is_modul) === 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
                            Modul
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {child.link_gdrive && (
                          <a href={child.link_gdrive} target="_blank" rel="noopener noreferrer" className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition" title="Buka Link">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button onClick={() => handleOpenEdit(child)} className="p-1.5 text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition" title="Ubah Item">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(child)} className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition" title="Hapus Item">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Drop zone akhir untuk kategori (mengurutkan kategori setelah item terakhir) */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, null, tree.length)}
              className={`rounded-2xl border-2 border-dashed py-4 text-center text-xs transition-colors ${
                dragId && dragType === 'item'
                  ? 'border-teal-300 text-teal-600 bg-teal-50/40'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              {dragId && dragType === 'item' ? 'Seret keluar untuk jadikan item utama / kategori' : 'Seret kategori di sini untuk menata urutan'}
            </div>
          </div>
        </div>
      ) : (
        /* Grid Cards View (Semua item termasuk kategori) */
        <div>
          {/* Kategori section */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <FolderOpen size={16} className="text-amber-600" /> Kategori ({categories.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((item) => (
                <AkademikCard key={item.id} item={item} onEdit={handleOpenEdit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
          {/* Item section per kategori */}
          {tree.map((cat) => (
            <div key={cat.item.id} className="mb-8">
              <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <FolderOpen size={16} className="text-amber-600" /> Item dalam {cat.item.label} ({cat.children.length})
              </h3>
              {cat.children.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-4 border border-slate-100">Belum ada item dalam kategori ini.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.children.map((item) => (
                    <AkademikCard key={item.id} item={item} onEdit={handleOpenEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
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
        parentId={parentId}
        setParentId={setParentId}
        categories={categories}
        error={error}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
