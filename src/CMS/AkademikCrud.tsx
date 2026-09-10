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
import { buildAkademikTree, getCategories, getStandaloneItems, isCategory } from '../utils/akademikHelpers';

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
  const [formType, setFormType] = useState<'category' | 'item'>('category');
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
  const standaloneItems = getStandaloneItems(items);
  const tree = buildAkademikTree(items);

  const openCreateCategory = () => {
    setFormType('category');
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
    setFormType('item');
    setEditId(null);
    setLabel('');
    setDeskripsi('');
    setLinkGdrive('');
    setIsModul(false);
    
    // Hitung urutan default berdasarkan jumlah item di kelompok yang dituju
    if (catId === null) {
      setUrutan(standaloneItems.length + 1);
    } else {
      const catGroup = tree.find((t) => t.item.id === catId);
      setUrutan(catGroup ? catGroup.children.length + 1 : 1);
    }

    setAktif(true);
    setParentId(catId);
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: AkademikMenuItem) => {
    setError('');
    const isCat = isCategory(item);
    setFormType(isCat ? 'category' : 'item');
    setEditId(item.id);
    setLabel(item.label);
    setDeskripsi(item.deskripsi || '');
    setLinkGdrive(item.link_gdrive || '');
    setIsModul(Number(item.is_modul) === 1);
    setUrutan(item.urutan);
    setAktif(Number(item.aktif) === 1);
    setParentId(isCat ? null : (item.parent_id && Number(item.parent_id) > 0 ? Number(item.parent_id) : null));
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isModulTaken = isModul && items.some((it) => Number(it.is_modul) === 1 && (!editId || Number(it.id) !== Number(editId)));
    if (isModulTaken) {
      setError('Item Modul Ajar & LKPD hanya boleh ditandai pada satu item. Item lain sudah memakai penanda ini.');
      return;
    }

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

  // --- Drag & Drop state ---
  const [draggedItem, setDraggedItem] = useState<AkademikMenuItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    catId: number | null; // null = standalone item zone or root category zone
    index: number;
    position: 'before' | 'after' | 'inside';
  } | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // --- Drag & Drop handlers ---
  const handleDragStart = (e: React.DragEvent, item: AkademikMenuItem, type: 'category' | 'item') => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(item.id));
    setDragId(item.id);
    setDragType(type);
    setDraggedItem(item);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragType(null);
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleDragOverItem = (e: React.DragEvent, catId: number | null, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    // Calculate whether hovering on upper half (before) or lower half (after)
    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = targetRect.top + targetRect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setDragOverTarget({
      catId,
      index,
      position,
    });
  };

  const handleDragOverCategory = (e: React.DragEvent, catId: number | null) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragType === 'item') {
      setDragOverTarget({
        catId,
        index: 0,
        position: 'inside',
      });
    }
  };

  const handleDrop = async (e: React.DragEvent, targetCatId: number | null, targetIndex: number, dropPos: 'before' | 'after' | 'inside' = 'before') => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedItem) {
      handleDragEnd();
      return;
    }

    const currentDragged = draggedItem;
    const isCat = dragType === 'category';

    // 1. Reordering Categories (Root Categories only)
    if (isCat) {
      if (targetCatId !== null && targetCatId !== undefined) {
        // Can only drop categories at category root level
        handleDragEnd();
        return;
      }

      const rootCats = categories.filter((c) => c.id !== currentDragged.id);
      let insertionIndex = targetIndex;
      if (dropPos === 'after') insertionIndex += 1;
      insertionIndex = Math.max(0, Math.min(insertionIndex, rootCats.length));

      rootCats.splice(insertionIndex, 0, currentDragged);

      // Build payload
      const allNew = [
        ...rootCats.map((c, idx) => ({ id: c.id, parent_id: null, urutan: idx + 1 })),
        ...items.filter((i) => !isCategory(i)).map((i) => ({ id: i.id, parent_id: i.parent_id, urutan: i.urutan })),
      ];

      setIsSavingOrder(true);
      const ok = await reorderItems(allNew, currentUser.role);
      setIsSavingOrder(false);
      if (ok) {
        setToast({ type: 'success', text: 'Urutan kategori berhasil diperbarui.' });
      } else {
        setToast({ type: 'error', text: 'Gagal memperbarui urutan kategori.' });
      }
      handleDragEnd();
      return;
    }

    // 2. Item Drag & Drop: Standalone <-> Standalone, Standalone <-> Category, Category A <-> Category B
    const isTargetStandalone = targetCatId === null;
    let targetList: AkademikMenuItem[] = [];

    if (isTargetStandalone) {
      targetList = standaloneItems.filter((i) => i.id !== currentDragged.id);
    } else {
      const parentCat = tree.find((t) => t.item.id === targetCatId);
      targetList = parentCat ? parentCat.children.filter((i) => i.id !== currentDragged.id) : [];
    }

    let insertIndex = targetIndex;
    if (dropPos === 'after') insertIndex += 1;
    if (dropPos === 'inside') insertIndex = targetList.length; // appended to the end of category
    insertIndex = Math.max(0, Math.min(insertIndex, targetList.length));

    // Create updated item with new parent_id
    const updatedDragged: AkademikMenuItem = {
      ...currentDragged,
      parent_id: targetCatId,
    };

    targetList.splice(insertIndex, 0, updatedDragged);

    // Construct the overall new list
    const updatedStandalone = isTargetStandalone
      ? targetList
      : standaloneItems.filter((i) => i.id !== currentDragged.id);

    const updatedCategoriesItems: AkademikMenuItem[] = [];
    tree.forEach((cat) => {
      if (cat.item.id === targetCatId) {
        updatedCategoriesItems.push(...targetList);
      } else {
        updatedCategoriesItems.push(...cat.children.filter((i) => i.id !== currentDragged.id));
      }
    });

    const allNew = [
      ...categories.map((c, ci) => ({ id: c.id, parent_id: null, urutan: ci + 1 })),
      ...updatedStandalone.map((s, si) => ({ id: s.id, parent_id: null, urutan: si + 1 })),
      ...updatedCategoriesItems.map((ci) => ({ id: ci.id, parent_id: ci.parent_id, urutan: ci.urutan })),
    ];

    setIsSavingOrder(true);
    const ok = await reorderItems(allNew, currentUser.role);
    setIsSavingOrder(false);

    if (ok) {
      if (currentDragged.parent_id !== targetCatId) {
        setToast({ type: 'success', text: `Item "${currentDragged.label}" berhasil dipindahkan.` });
      } else {
        setToast({ type: 'success', text: 'Urutan item berhasil diperbarui.' });
      }
    } else {
      setToast({ type: 'error', text: 'Gagal memperbarui urutan/kategori item.' });
    }
    handleDragEnd();
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
            Kelola kategori &amp; item dropdown Akademik. Seret item untuk mengatur urutan atau memindahkannya antar kategori dan item mandiri secara bebas.
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
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 sm:pb-4 border-b border-slate-100">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base lg:text-lg flex flex-wrap items-center gap-2">
                <ListOrdered className="text-teal-600 shrink-0" size={20} />
                <span>Urutan &amp; Kategori Menu Akademik</span>
                {isSavingOrder && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-teal-600 font-normal">
                    <RefreshCw size={12} className="animate-spin shrink-0" /> Menyimpan urutan...
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Gunakan grip icon untuk drag &amp; drop item ke atas/bawah atau seret lintas kategori &amp; item mandiri.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0 mt-1 sm:mt-0">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {categories.length} Kategori
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {standaloneItems.length} Item Mandiri
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {items.length - categories.length - standaloneItems.length} Item Kategori
              </span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {/* 1. Item Mandiri (Di Luar Kategori) */}
            <div
              onDragOver={(e) => handleDragOverCategory(e, null)}
              onDrop={(e) => {
                if (dragType === 'item') {
                  const dropPos = dragOverTarget?.catId === null ? dragOverTarget.position : 'inside';
                  const dropIdx = dragOverTarget?.catId === null ? dragOverTarget.index : standaloneItems.length;
                  handleDrop(e, null, dropIdx, dropPos);
                }
              }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs w-full ${
                dragType === 'item' && dragOverTarget?.catId === null
                  ? 'border-teal-400 ring-2 ring-teal-400/30 bg-teal-50/40'
                  : 'border-teal-200/80 bg-teal-50/20'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 sm:px-4 py-3 bg-teal-50/80 border-b border-teal-100">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Layers size={16} className="text-teal-700 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-teal-900 break-words">Item Mandiri (Tanpa Kategori)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                    {standaloneItems.length}
                  </span>
                </div>
                <button
                  onClick={() => openCreateItem(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus size={13} />
                  <span>Tambah Item Mandiri</span>
                </button>
              </div>

              <div className="p-2.5 sm:p-3 space-y-2">
                {standaloneItems.length === 0 ? (
                  <div
                    className={`py-6 px-4 text-center text-xs rounded-xl border border-dashed transition-colors ${
                      dragType === 'item' && dragOverTarget?.catId === null
                        ? 'border-teal-500 bg-teal-100/60 text-teal-800 font-semibold'
                        : 'border-teal-200 text-teal-700/70'
                    }`}
                  >
                    Belum ada item mandiri. Seret item ke area ini untuk menjadikannya item mandiri.
                  </div>
                ) : (
                  standaloneItems.map((item, idx) => {
                    const isBeingDragged = dragId === item.id;
                    const isDropTargetBefore = dragOverTarget?.catId === null && dragOverTarget.index === idx && dragOverTarget.position === 'before';
                    const isDropTargetAfter = dragOverTarget?.catId === null && dragOverTarget.index === idx && dragOverTarget.position === 'after';

                    return (
                      <React.Fragment key={item.id}>
                        {/* Placeholder Line Above */}
                        {isDropTargetBefore && (
                          <div className="h-1.5 bg-teal-500 rounded-full my-1 animate-pulse shadow-xs" />
                        )}

                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, item, 'item')}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOverItem(e, null, idx)}
                          onDrop={(e) => handleDrop(e, null, idx, dragOverTarget?.position || 'before')}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border transition-all duration-150 bg-white ${
                            isBeingDragged
                              ? 'opacity-30 border-dashed border-teal-500 scale-[0.98]'
                              : 'border-slate-200/90 shadow-2xs hover:border-teal-400 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                            <div
                              className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition shrink-0 mt-0.5 sm:mt-0 touch-none"
                              title="Geser untuk mengatur urutan atau memindahkan kategori"
                            >
                              <GripVertical size={16} />
                            </div>
                            <span className="w-5 h-5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-bold flex items-center justify-center shrink-0 border border-teal-100 mt-0.5 sm:mt-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-xs sm:text-sm text-slate-800 break-words leading-tight">
                                {item.label}
                              </span>
                              {Number(item.is_modul) === 1 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
                                  Modul
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                                  Number(item.aktif) === 1
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {Number(item.aktif) === 1 ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 pl-8 sm:pl-0">
                            {item.link_gdrive && (
                              <a href={item.link_gdrive} target="_blank" rel="noopener noreferrer" className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition" title="Buka Link Google Drive">
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition cursor-pointer" title="Ubah Item">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(item)} className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer" title="Hapus Item">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Placeholder Line Below */}
                        {isDropTargetAfter && (
                          <div className="h-1.5 bg-teal-500 rounded-full my-1 animate-pulse shadow-xs" />
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Daftar Kategori & Item di dalamnya */}
            {tree.map((cat, catIndex) => {
              const isCatBeingDragged = dragId === cat.item.id;
              const isTargetCat = dragOverTarget?.catId === cat.item.id;
              const isCatDropBefore = dragType === 'category' && dragOverTarget?.catId === null && dragOverTarget.index === catIndex && dragOverTarget.position === 'before';
              const isCatDropAfter = dragType === 'category' && dragOverTarget?.catId === null && dragOverTarget.index === catIndex && dragOverTarget.position === 'after';

              return (
                <React.Fragment key={cat.item.id}>
                  {/* Category Placeholder Line Above */}
                  {isCatDropBefore && (
                    <div className="h-2 bg-amber-500 rounded-full my-1 animate-pulse shadow-xs" />
                  )}

                  <div
                    onDragOver={(e) => {
                      if (dragType === 'category') {
                        handleDragOverItem(e, null, catIndex);
                      } else if (dragType === 'item') {
                        handleDragOverCategory(e, cat.item.id);
                      }
                    }}
                    onDrop={(e) => {
                      if (dragType === 'category') {
                        handleDrop(e, null, catIndex, dragOverTarget?.position || 'before');
                      } else if (dragType === 'item') {
                        const dropPos = dragOverTarget?.catId === cat.item.id ? dragOverTarget.position : 'inside';
                        const dropIdx = dragOverTarget?.catId === cat.item.id ? dragOverTarget.index : cat.children.length;
                        handleDrop(e, cat.item.id, dropIdx, dropPos);
                      }
                    }}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden w-full ${
                      isCatBeingDragged
                        ? 'opacity-30 border-dashed border-amber-500'
                        : isTargetCat && dragType === 'item'
                        ? 'border-amber-400 ring-2 ring-amber-300/60 bg-amber-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Kategori Header (bisa di-drag utk urut antar kategori) */}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, cat.item, 'category')}
                      onDragEnd={handleDragEnd}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 sm:px-4 py-3 bg-amber-50/80 border-b border-amber-100 select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="cursor-grab active:cursor-grabbing p-1.5 text-amber-500 hover:text-amber-700 rounded-lg hover:bg-amber-100/80 transition shrink-0 touch-none"
                          title="Geser untuk mengatur urutan kategori"
                        >
                          <GripVertical size={18} />
                        </div>
                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0 border border-amber-200">
                          {catIndex + 1}
                        </span>
                        <FolderOpen size={16} className="text-amber-600 shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-slate-800 break-words leading-tight flex-1">
                          {cat.item.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-800 shrink-0">
                          Kategori
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-amber-100 pl-8 sm:pl-0">
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
                        <div className="flex items-center gap-1">
                          <button onClick={() => openCreateItem(cat.item.id)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition cursor-pointer" title="Tambah item di kategori ini">
                            <Plus size={15} />
                          </button>
                          <button onClick={() => handleOpenEdit(cat.item)} className="p-1.5 text-slate-600 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition cursor-pointer" title="Ubah Kategori">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(cat.item)} className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer" title="Hapus Kategori">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item dalam kategori */}
                    <div className="p-2.5 sm:p-3 space-y-2">
                      {cat.children.length === 0 ? (
                        <div
                          className={`py-5 px-4 rounded-xl border border-dashed text-xs text-center transition-colors ${
                            isTargetCat && dragType === 'item'
                              ? 'border-amber-500 bg-amber-100/60 text-amber-900 font-semibold'
                              : 'border-slate-200 text-slate-400'
                          }`}
                        >
                          Kosong — Seret item ke area ini untuk memasukkannya ke kategori {cat.item.label}
                        </div>
                      ) : (
                        cat.children.map((child, idx) => {
                          const isChildBeingDragged = dragId === child.id;
                          const isChildDropBefore = isTargetCat && dragOverTarget.index === idx && dragOverTarget.position === 'before';
                          const isChildDropAfter = isTargetCat && dragOverTarget.index === idx && dragOverTarget.position === 'after';

                          return (
                            <React.Fragment key={child.id}>
                              {/* Child Item Placeholder Above */}
                              {isChildDropBefore && (
                                <div className="h-1.5 bg-teal-500 rounded-full my-1 animate-pulse shadow-xs" />
                              )}

                              <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, child, 'item')}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOverItem(e, cat.item.id, idx)}
                                onDrop={(e) => handleDrop(e, cat.item.id, idx, dragOverTarget?.position || 'before')}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border transition-all duration-150 ${
                                  isChildBeingDragged
                                    ? 'opacity-30 border-dashed border-teal-500 scale-[0.98]'
                                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 hover:shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                                  <div
                                    className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-200/60 transition shrink-0 mt-0.5 sm:mt-0 touch-none"
                                    title="Geser untuk mengatur urutan atau memindahkan kategori"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0 border border-slate-200 mt-0.5 sm:mt-0">
                                    {idx + 1}
                                  </span>
                                  <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                                    <span className="font-semibold text-xs sm:text-sm text-slate-700 break-words leading-tight">
                                      {child.label}
                                    </span>
                                    {Number(child.is_modul) === 1 && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
                                        Modul
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 pl-8 sm:pl-0">
                                  {child.link_gdrive && (
                                    <a href={child.link_gdrive} target="_blank" rel="noopener noreferrer" className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition" title="Buka Link Google Drive">
                                      <ExternalLink size={14} />
                                    </a>
                                  )}
                                  <button onClick={() => handleOpenEdit(child)} className="p-1.5 text-slate-600 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition cursor-pointer" title="Ubah Item">
                                    <Edit2 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(child)} className="p-1.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition cursor-pointer" title="Hapus Item">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              {/* Child Item Placeholder Below */}
                              {isChildDropAfter && (
                                <div className="h-1.5 bg-teal-500 rounded-full my-1 animate-pulse shadow-xs" />
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Category Placeholder Line Below */}
                  {isCatDropAfter && (
                    <div className="h-2 bg-amber-500 rounded-full my-1 animate-pulse shadow-xs" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid Cards View (Semua item termasuk kategori) */
        <div>
          {/* Item Mandiri section */}
          {standaloneItems.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <Layers size={16} className="text-teal-600" /> Item Mandiri / Di Luar Kategori ({standaloneItems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {standaloneItems.map((item) => (
                  <AkademikCard key={item.id} item={item} onEdit={handleOpenEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {/* Kategori section */}
          {categories.length > 0 && (
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
          )}

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
        formType={formType}
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
