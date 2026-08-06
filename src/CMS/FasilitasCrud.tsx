import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Image as ImageIcon, Monitor, BookOpen, Activity,
    HeartPulse, Coffee, Trees, Building, Sparkles, AlertCircle, X
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { UserSession } from './types';

export interface FasilitasItem {
    id: number;
    judul: string;
    deskripsi: string;
    foto: string;
}



interface FasilitasCrudProps {
    currentUser: UserSession;
}

const API_BASE = getApiBaseUrl();

// Helper to determine dynamic icon based on facility title keywords
export const getFacilityIconByTitle = (title: string, className = "w-5 h-5 text-[#028C84]") => {
    const t = title.toLowerCase();
    if (t.includes('lab') || t.includes('komputer') || t.includes('tik') || t.includes('coding') || t.includes('multimedia')) {
        return <Monitor className={className} />;
    }
    if (t.includes('pustaka') || t.includes('buku') || t.includes('baca') || t.includes('literasi')) {
        return <BookOpen className={className} />;
    }
    if (t.includes('lapangan') || t.includes('olahraga') || t.includes('futsal') || t.includes('basket') || t.includes('senam') || t.includes('fisik')) {
        return <Activity className={className} />;
    }
    if (t.includes('uks') || t.includes('sehat') || t.includes('kesehatan') || t.includes('poliklinik') || t.includes('medis')) {
        return <HeartPulse className={className} />;
    }
    if (t.includes('kantin') || t.includes('makan') || t.includes('gizi') || t.includes('kuliner') || t.includes('minum')) {
        return <Coffee className={className} />;
    }
    if (t.includes('taman') || t.includes('green') || t.includes('kebun') || t.includes('adiwiyata') || t.includes('pohon') || t.includes('hidroponik')) {
        return <Trees className={className} />;
    }
    if (t.includes('musa') || t.includes('masjid') || t.includes('agama') || t.includes('ibadah')) {
        return <Sparkles className={className} />;
    }
    return <Building className={className} />;
};

export default function FasilitasCrud({ currentUser }: FasilitasCrudProps) {
    const [items, setItems] = useState<FasilitasItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal & Form States
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    // Delete Confirmation Modal State
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`);
            const result = await response.json();
            if (result.status === 'success') {
                setItems(result.data || []);
            } else {
                setError(result.message || 'Gagal memuat data fasilitas.');
            }
        } catch (err) {
            setError('Gagal menghubungi server database backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const resetForm = () => {
        setJudul('');
        setDeskripsi('');
        setFotoUrl('');
        setFotoFile(null);
        setEditId(null);
        setError('');
    };

    const handleOpenCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const handleOpenEdit = (item: FasilitasItem) => {
        setError('');
        setEditId(item.id);
        setJudul(item.judul);
        setDeskripsi(item.deskripsi);
        setFotoUrl(item.foto && !item.foto.startsWith('backend/') ? item.foto : '');
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
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);

        if (fotoFile) {
            formData.append('foto', fotoFile);
        } else if (fotoUrl) {
            formData.append('foto_url', fotoUrl);
        }

        try {
            const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSuccess(result.message || 'Berhasil menyimpan data fasilitas.');
                setShowModal(false);
                resetForm();
                fetchFacilities();
            } else {
                setError(result.message || 'Gagal menyimpan fasilitas.');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghubungkan ke server.');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalId) return;
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', deleteModalId.toString());

        try {
            const response = await fetch(`${API_BASE}/backend/API/fasilitas.php`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.status === 'success') {
                setSuccess(result.message || 'Fasilitas berhasil dihapus.');
                setDeleteModalId(null);
                fetchFacilities();
            } else {
                setError(result.message || 'Gagal menghapus fasilitas.');
            }
        } catch (err) {
            setError('Gagal menghapus data.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Manajemen Fasilitas Pembelajaran</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Kelola daftar sarana dan prasarana pembelajaran yang ditampilkan pada profil sekolah.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                    <Plus size={18} /> Tambah Fasilitas
                </button>
            </div>

            {/* Notifications */}
            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-700">
                        <X size={18} />
                    </button>
                </div>
            )}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Card Grid */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Memuat data fasilitas...</div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
                    Belum ada data fasilitas pembelajaran. Klik tombol "Tambah Fasilitas" di atas untuk menambah.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((fac) => (
                        <div
                            key={fac.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                                    {fac.foto ? (
                                        <img
                                            src={getImageUrl(fac.foto)}
                                            alt={fac.judul}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <ImageIcon size={36} />
                                        </div>
                                    )}
                                    {/* Auto Icon Tag */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow border border-white/70 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                        {getFacilityIconByTitle(fac.judul)}
                                        <span>Icon Terdeteksi</span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-2">
                                    <h3 className="font-bold text-slate-800 text-base">{fac.judul}</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                        {fac.deskripsi}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                                <button
                                    onClick={() => handleOpenEdit(fac)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Fasilitas"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteModalId(fac.id)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Fasilitas"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 animate-scale-in">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editId ? 'Edit Fasilitas Pembelajaran' : 'Tambah Fasilitas Pembelajaran Baru'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-slate-700 text-sm font-medium mb-1">
                                    Judul Fasilitas <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                    placeholder="Contoh: Laboratorium Komputer & TIK"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                                />
                                {judul && (
                                    <div className="mt-1.5 text-xs text-teal-600 flex items-center gap-1 font-medium">
                                        <span>Icon otomatis:</span>
                                        {getFacilityIconByTitle(judul)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-700 text-sm font-medium mb-1">
                                    Deskripsi Fasilitas <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    placeholder="Jelaskan sarana, jumlah peralatan, dan manfaat bagi siswa..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-slate-700 text-sm font-medium">
                                    Foto Fasilitas (Upload / URL)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFotoFile(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                />
                                <div className="text-center text-xs text-slate-400 font-semibold my-1">Atau</div>
                                <input
                                    type="text"
                                    value={fotoUrl}
                                    onChange={(e) => setFotoUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium shadow-sm transition-colors cursor-pointer"
                                >
                                    {editId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModalId && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Konfirmasi Hapus</h3>
                        <p className="text-xs text-slate-600">
                            Apakah Anda yakin ingin menghapus fasilitas ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalId(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 shadow-sm cursor-pointer"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
