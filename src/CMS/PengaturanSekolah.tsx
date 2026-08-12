import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Save,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Share2,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Image as ImageIcon,
  Filter,
  Upload,
  Tag,
  GripVertical,
  Crop
} from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { SocialMediaIcon } from '../components/common/SocialMediaIcon';
import { validateImageFile } from './utils/fileValidation';
import { ImageCropModal } from './components/ImageCropModal';

const API_BASE = getApiBaseUrl();

export interface MedsosItem {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface HeroCarouselItem {
  id: number;
  foto: string;
  foto_original?: string;
  caption: string;
  tag: string;
  urutan: number;
  is_active: number;
}

export type SettingsFilter = 'all' | 'ppdb' | 'hero' | 'contact' | 'medsos';

export default function PengaturanSekolah() {
  const [activeFilter, setActiveFilter] = useState<SettingsFilter>('all');

  // General Settings State
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [linkPpdb, setLinkPpdb] = useState('');
  const [emailSekolah, setEmailSekolah] = useState('sdnmulyoagung01@gmail.com');
  const [teleponSekolah, setTeleponSekolah] = useState('(0341) 466-730');
  const [whatsappSekolah, setWhatsappSekolah] = useState('08123456789');
  const [alamatSekolah, setAlamatSekolah] = useState('JL. RAYA MULYOAGUNG NO.121 RT. 1 RW. 10 DUSUN MULYOAGUNG , Kec. Dau, Kab. Malang, Prov. Jawa Timur');
  const [medsosList, setMedsosList] = useState<MedsosItem[]>([]);

  // Hero Carousel State
  const [heroSlides, setHeroSlides] = useState<HeroCarouselItem[]>([]);
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroCarouselItem | null>(null);
  const [heroCaption, setHeroCaption] = useState('');
  const [heroTag, setHeroTag] = useState('Kegiatan Utama');
  const [heroUrutan, setHeroUrutan] = useState(0);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroOriginalFile, setHeroOriginalFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  const [heroCropOpen, setHeroCropOpen] = useState(false);
  const [heroCropSrc, setHeroCropSrc] = useState<string | null>(null);
  const [heroCropName, setHeroCropName] = useState('foto');
  const heroCropSrcRef = useRef<string | null>(null);
  heroCropSrcRef.current = heroCropSrc;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State for Medsos CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedsosItem | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', icon: 'auto' });

  useEffect(() => {
    fetchSettings();
    fetchHeroSlides();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/pengaturan.php`);
      const result = await response.json();
      if (result.status === 'success') {
        if (result.tahun_ajaran) setTahunAjaran(result.tahun_ajaran);
        if (result.link_ppdb !== undefined) setLinkPpdb(result.link_ppdb);
        if (result.email_sekolah) setEmailSekolah(result.email_sekolah);
        if (result.telepon_sekolah) setTeleponSekolah(result.telepon_sekolah);
        if (result.whatsapp_sekolah) setWhatsappSekolah(result.whatsapp_sekolah);
        if (result.alamat_sekolah) setAlamatSekolah(result.alamat_sekolah);
        if (Array.isArray(result.medsos_links)) setMedsosList(result.medsos_links);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memuat data pengaturan.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      const res = await fetch(`${API_BASE}/backend/API/hero_carousel.php`);
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setHeroSlides(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch hero carousel:', e);
    }
  };

  const handleSaveAll = async (updatedMedsos?: MedsosItem[]) => {
    setMessage(null);
    setSaving(true);

    const targetMedsos = updatedMedsos !== undefined ? updatedMedsos : medsosList;

    try {
      const form = new FormData();
      form.append('tahun_ajaran', tahunAjaran);
      form.append('link_ppdb', linkPpdb);
      form.append('email_sekolah', emailSekolah);
      form.append('telepon_sekolah', teleponSekolah);
      form.append('whatsapp_sekolah', whatsappSekolah);
      form.append('alamat_sekolah', alamatSekolah);
      form.append('medsos_links', JSON.stringify(targetMedsos));

      const response = await fetch(`${API_BASE}/backend/API/pengaturan.php`, {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Pengaturan & kontak sekolah berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  // Medsos CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', url: '', icon: 'auto' });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: MedsosItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, url: item.url, icon: item.icon || 'auto' });
    setModalOpen(true);
  };

  const handleDeleteMedsos = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus media sosial ini?')) {
      const newList = medsosList.filter((m) => m.id !== id);
      setMedsosList(newList);
      handleSaveAll(newList);
    }
  };

  const handleSaveMedsosItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    let newList: MedsosItem[];

    if (editingItem) {
      newList = medsosList.map((m) =>
        m.id === editingItem.id ? { ...m, name: formData.name, url: formData.url, icon: formData.icon } : m
      );
    } else {
      const newItem: MedsosItem = {
        id: `medsos-${Date.now()}`,
        name: formData.name,
        url: formData.url,
        icon: formData.icon,
      };
      newList = [...medsosList, newItem];
    }

    setMedsosList(newList);
    setModalOpen(false);
    handleSaveAll(newList);
  };

  // Drag and Drop State & Handlers for Hero Carousel
  const [draggedHeroIndex, setDraggedHeroIndex] = useState<number | null>(null);

  const handleHeroDragStart = (e: React.DragEvent, index: number) => {
    setDraggedHeroIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleHeroDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleHeroDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedHeroIndex === null || draggedHeroIndex === dropIndex) return;

    const newSlides = [...heroSlides];
    const [draggedItem] = newSlides.splice(draggedHeroIndex, 1);
    newSlides.splice(dropIndex, 0, draggedItem);

    // Re-assign urutan sequence
    const reordered = newSlides.map((item, idx) => ({
      ...item,
      urutan: idx + 1,
    }));

    setHeroSlides(reordered);
    setDraggedHeroIndex(null);
    saveHeroOrder(reordered);
  };

  const saveHeroOrder = async (items: HeroCarouselItem[]) => {
    try {
      const payload = items.map((it, idx) => ({
        id: it.id,
        urutan: idx + 1,
      }));
      const form = new FormData();
      form.append('action', 'reorder');
      form.append('items', JSON.stringify(payload));

      const res = await fetch(`${API_BASE}/backend/API/hero_carousel.php`, {
        method: 'POST',
        body: form,
      });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Urutan foto carousel hero berhasil diperbarui!' });
      }
    } catch (e) {
      console.error('Failed to save order:', e);
    }
  };

  // Hero Carousel CRUD Handlers
  const handleOpenAddHero = () => {
    setEditingHero(null);
    setHeroCaption('MA ONE BERGELORA!!!');
    setHeroTag('Kegiatan Utama');
    setHeroUrutan(heroSlides.length + 1);
    setHeroFile(null);
    setHeroOriginalFile(null);
    setHeroPreview(null);
    setHeroModalOpen(true);
  };

  const handleOpenEditHero = (item: HeroCarouselItem) => {
    setEditingHero(item);
    setHeroCaption(item.caption);
    setHeroTag(item.tag || 'Kegiatan Utama');
    setHeroUrutan(item.urutan || 0);
    setHeroFile(null);
    setHeroOriginalFile(null);
    setHeroPreview(item.foto ? getImageUrl(item.foto) : null);
    setHeroModalOpen(true);
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = validateImageFile(e.target.files?.[0] || null, e.target);
    if (!file) return;
    e.target.value = '';
    if (heroCropSrcRef.current) URL.revokeObjectURL(heroCropSrcRef.current);
    setHeroOriginalFile(file);
    setHeroCropName(file.name);
    setHeroCropSrc(URL.createObjectURL(file));
    setHeroCropOpen(true);
  };

  const handleHeroReCrop = () => {
    const source = editingHero?.foto_original || editingHero?.foto;
    if (!source) return;
    if (heroCropSrcRef.current) URL.revokeObjectURL(heroCropSrcRef.current);
    setHeroCropName(source.split('/').pop() || 'foto');
    setHeroCropSrc(getImageUrl(source));
    setHeroCropOpen(true);
  };

  const handleHeroCropCancel = () => {
    setHeroCropOpen(false);
    if (heroCropSrcRef.current) {
      URL.revokeObjectURL(heroCropSrcRef.current);
      setHeroCropSrc(null);
    }
  };

  const handleHeroCropConfirm = (blob: Blob) => {
    const base = (heroCropName.replace(/\.[^.]+$/, '').trim() || 'foto').replace(/[^\w\- ]/g, '');
    const file = new File([blob], `${base || 'foto'}.png`, { type: 'image/png' });
    setHeroFile(file);
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroPreview(URL.createObjectURL(file));
    handleHeroCropCancel();
  };

  const handleDeleteHero = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto carousel ini?')) return;
    try {
      const form = new FormData();
      form.append('action', 'delete');
      form.append('id', id.toString());

      const res = await fetch(`${API_BASE}/backend/API/hero_carousel.php`, {
        method: 'POST',
        body: form,
      });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Foto carousel hero berhasil dihapus.' });
        fetchHeroSlides();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menghapus foto carousel.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Gagal menghubungkan ke server.' });
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroCaption.trim()) {
      setMessage({ type: 'error', text: 'Caption foto tidak boleh kosong.' });
      return;
    }

    try {
      const form = new FormData();
      if (editingHero) {
        form.append('id', editingHero.id.toString());
      }
      form.append('caption', heroCaption);
      form.append('tag', heroTag);
      form.append('urutan', heroUrutan.toString());
      if (heroOriginalFile) {
        form.append('foto_original', heroOriginalFile);
      }
      if (heroFile) {
        form.append('foto', heroFile);
      }

      const res = await fetch(`${API_BASE}/backend/API/hero_carousel.php`, {
        method: 'POST',
        body: form,
      });
      const result = await res.json();

      if (result.status === 'success') {
        setMessage({ type: 'success', text: result.message || 'Foto carousel hero berhasil disimpan.' });
        setHeroModalOpen(false);
        fetchHeroSlides();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan foto carousel.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Gagal menghubungkan ke server.' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pengaturan Sekolah & Carousel Hero</h2>
            <p className="text-sm text-slate-500">Kelola modul PPDB, carousel foto hero, kontak resmi, dan media sosial</p>
          </div>
        </div>

        <button
          onClick={() => handleSaveAll()}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* Module Filter Tabs / Buttons */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 flex items-center gap-1.5 shrink-0">
          <Filter size={14} className="text-teal-600" /> Filter Modul:
        </span>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🌟 Semua Pengaturan
        </button>

        <button
          onClick={() => setActiveFilter('ppdb')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'ppdb'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🎓 Halaman PPDB &amp; Tahun Ajaran
        </button>

        <button
          onClick={() => setActiveFilter('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'hero'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🖼️ Carousel Hero Header
        </button>

        <button
          onClick={() => setActiveFilter('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'contact'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          📞 Kontak &amp; Alamat Sekolah
        </button>

        <button
          onClick={() => setActiveFilter('medsos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'medsos'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          📱 Media Sosial
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 1: Pengaturan Utama & PPDB */}
      {(activeFilter === 'all' || activeFilter === 'ppdb') && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-base">Konfigurasi Halaman PPDB &amp; Tahun Ajaran</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-teal-600" />
                Tahun Ajaran Aktif (Hero Badge)
              </label>
              <input
                type="text"
                required
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                placeholder="Contoh: 2025/2026 atau 2026/2027"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Ditampilkan otomatis pada badge bagian atas Hero Section.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon size={16} className="text-teal-600" />
                Link / URL PPDB Online
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={linkPpdb}
                  onChange={(e) => setLinkPpdb(e.target.value)}
                  placeholder="Contoh: https://ppdb.malangkab.go.id atau link Google Form"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800 pr-10"
                />
                {linkPpdb && (
                  <a
                    href={linkPpdb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 p-1"
                    title="Uji coba buka link PPDB"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Digunakan pada tombol PPDB di Header, Hero, dan Footer. Jika dikosongkan, akan membuka formulir pop-up internal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Carousel Hero Header CRUD */}
      {(activeFilter === 'all' || activeFilter === 'hero') && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal-600" />
                Kelola Foto Carousel Hero Header (Landscape)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Foto-foto ini akan tampil bergantian pada slider di bagian kanan Hero utama. Seluruh foto berukuran lanskap seragam.
              </p>
            </div>

            <button
              onClick={handleOpenAddHero}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Plus size={16} />
              <span>Tambah Foto Hero</span>
            </button>
          </div>

          {/* Hero Carousel Grid in Landscape Ratio with Drag & Drop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {heroSlides.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleHeroDragStart(e, index)}
                onDragOver={handleHeroDragOver}
                onDrop={(e) => handleHeroDrop(e, index)}
                className={`bg-slate-50 rounded-2xl border transition-all duration-200 group flex flex-col cursor-grab active:cursor-grabbing ${
                  draggedHeroIndex === index
                    ? 'opacity-40 border-teal-500 scale-95 ring-2 ring-teal-500/30'
                    : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
                }`}
              >
                {/* Landscape Photo Container */}
                <div className="relative w-full aspect-video bg-slate-900 overflow-hidden rounded-t-2xl">
                  <img
                    src={getImageUrl(item.foto)}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  
                  {/* Drag Handle Overlay Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <GripVertical size={12} className="text-teal-400" />
                    <span>Geser #{item.urutan}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-teal-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                    {item.tag || 'Hero Slide'}
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                      {item.caption}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-400">
                    <span className="text-[10px] font-semibold flex items-center gap-1">
                      <GripVertical size={12} /> Drag &amp; Drop
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditHero(item)}
                        className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                        title="Edit Foto & Caption"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHero(item.id)}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                        title="Hapus Foto"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {heroSlides.length === 0 && (
              <div className="col-span-full py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <ImageIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-700">Belum ada foto carousel hero yang diunggah.</p>
                <p className="text-xs text-slate-500 mt-1">Sistem saat ini menggunakan foto bawaan default.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Kontak Resmi Sekolah */}
      {(activeFilter === 'all' || activeFilter === 'contact') && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-base">Informasi Kontak &amp; Alamat Sekolah</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                <Mail size={15} className="text-teal-600" />
                Email Resmi Sekolah
              </label>
              <input
                type="email"
                value={emailSekolah}
                onChange={(e) => setEmailSekolah(e.target.value)}
                placeholder="sdnmulyoagung01@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <Phone size={15} className="text-teal-600" />
                  Telepon Sekolah
                </label>
                <input
                  type="text"
                  value={teleponSekolah}
                  onChange={(e) => setTeleponSekolah(e.target.value)}
                  placeholder="(0341) 466-730"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                  <MessageCircle size={15} className="text-emerald-600" />
                  WhatsApp Pengaduan
                </label>
                <input
                  type="text"
                  value={whatsappSekolah}
                  onChange={(e) => setWhatsappSekolah(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                <MapPin size={15} className="text-teal-600" />
                Alamat Lengkap Sekolah
              </label>
              <textarea
                rows={2}
                value={alamatSekolah}
                onChange={(e) => setAlamatSekolah(e.target.value)}
                placeholder="Jl. Raya Mulyoagung No. 121 ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Kelola Media Sosial (CRUD) */}
      {(activeFilter === 'all' || activeFilter === 'medsos') && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-teal-600" />
                Kelola Tautan Media Sosial
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Media sosial ini akan muncul pada Footer dan Halaman Kontak. Icon dapat ditentukan secara otomatis berdasarkan nama platform atau dipilih manual.
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Plus size={16} />
              <span>Tambah Media Sosial</span>
            </button>
          </div>

          {/* Medsos Table/List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medsosList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SocialMediaIcon
                    name={item.name}
                    icon={item.icon}
                    className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm"
                    iconClassName="w-5 h-5"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-800 truncate">{item.name}</div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 hover:underline truncate block max-w-[180px]"
                    >
                      {item.url}
                    </a>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Icon: {item.icon === 'auto' ? 'Otomatis' : item.icon}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMedsos(item.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {medsosList.length === 0 && (
              <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-sm text-slate-500 font-semibold">Belum ada media sosial yang ditambahkan.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add / Edit Hero Carousel */}
      {heroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <ImageIcon className="text-teal-600" size={18} />
                {editingHero ? 'Edit Foto Carousel Hero' : 'Tambah Foto Carousel Hero Baru'}
              </h3>
              <button
                onClick={() => setHeroModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Upload size={14} className="text-teal-600" /> File Foto Lanskap *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileChange}
                  className="w-full text-slate-600 text-xs border border-slate-300 rounded-xl file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: Gambar (JPG, PNG, WEBP). Maksimal 5MB. Foto akan dipotong otomatis rasio 16:9 (lanskap).
                </p>
                {editingHero && (
                  <button
                    type="button"
                    onClick={handleHeroReCrop}
                    className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    <Crop size={13} /> Potong Ulang Foto Saat Ini
                  </button>
                )}
              </div>

              {/* Landscape Image Preview Box */}
              {heroPreview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
                  <img
                    src={heroPreview}
                    alt="Pratinjau Hero"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md">
                    Pratinjau Lanskap
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Caption / Keterangan Singkat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembentukan Karakter & Prestasi Siswa"
                  value={heroCaption}
                  onChange={(e) => setHeroCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                    <Tag size={13} className="text-teal-600" /> Kategori / Tag
                  </label>
                  <select
                    value={heroTag}
                    onChange={(e) => setHeroTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-semibold text-slate-800"
                  >
                    <option value="Kegiatan Utama">Kegiatan Utama</option>
                    <option value="Fasilitas Sekolah">Fasilitas Sekolah</option>
                    <option value="Suasana Belajar">Suasana Belajar</option>
                    <option value="Karakter Mulia">Karakter Mulia</option>
                    <option value="Prestasi Siswa">Prestasi Siswa</option>
                    <option value="Galeri Sekolah">Galeri Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={heroUrutan}
                    onChange={(e) => setHeroUrutan(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setHeroModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Simpan Foto Hero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageCropModal
        open={heroCropOpen}
        imageSrc={heroCropSrc}
        aspectRatio={16 / 9}
        circular={false}
        title="Potong Foto Carousel Hero"
        outputWidth={1920}
        outputHeight={1080}
        onCancel={handleHeroCropCancel}
        onConfirm={handleHeroCropConfirm}
      />

      {/* Modal Add / Edit Medsos */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                {editingItem ? 'Edit Media Sosial' : 'Tambah Media Sosial Baru'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMedsosItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Platform / Media Sosial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Instagram, YouTube, TikTok, Facebook, Twitter, WhatsApp"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Link / URL Tautan *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pilihan Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
                >
                  <option value="auto">✨ Otomatis (Berdasarkan Nama Platform)</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Globe">Globe / Website</option>
                  <option value="Link">Tautan Generik (Link)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih "Otomatis" agar icon langsung menyesuaikan saat Anda mengetik nama platform.
                </p>
              </div>

              {/* Icon Preview */}
              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Pratinjau Icon:</span>
                <SocialMediaIcon
                  name={formData.name || 'Platform'}
                  icon={formData.icon}
                  className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center"
                  iconClassName="w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800">{formData.name || 'Pratinjau'}</span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Media Sosial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
