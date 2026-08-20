import React, { useState, useEffect, useRef } from 'react';
import { MedsosItem, HeroCarouselItem, HomepageSection } from '../types';
import { getApiBaseUrl } from '../../../config/api';
import { validateImageFile } from '../../utils/fileValidation';

const API_BASE = getApiBaseUrl();

export const usePengaturanData = () => {
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
  const [heroCropName, setHeroCropName] = useState('');
  const heroCropSrcRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Homepage Sections State
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  // Hero Content State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBg, setHeroBg] = useState('');
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [heroBgOriginalFile, setHeroBgOriginalFile] = useState<File | null>(null);
  const [heroBgPreview, setHeroBgPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Vision / Mission / History State
  const [profilVisi, setProfilVisi] = useState('');
  const [profilMisiInput, setProfilMisiInput] = useState('');
  const [profilSejarah, setProfilSejarah] = useState('');

  // Drag and drop for homepage sections
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  // Modal State for Medsos CRUD
  const [medsosModalOpen, setMedsosModalOpen] = useState(false);
  const [medsosEditingItem, setMedsosEditingItem] = useState<MedsosItem | null>(null);
  const [medsosFormData, setMedsosFormData] = useState({ name: '', url: '', icon: 'auto' });

  // Drag and Drop State for Hero Carousel
  const [draggedHeroIndex, setDraggedHeroIndex] = useState<number | null>(null);

  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSectionDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === index) return;

    const newList = [...homepageSections];
    const draggedItem = newList[draggedSectionIndex];
    newList.splice(draggedSectionIndex, 1);
    newList.splice(index, 0, draggedItem);

    setDraggedSectionIndex(null);
    setHomepageSections(newList);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newList = [...homepageSections];
    newList[index] = { ...newList[index], [field]: value };
    setHomepageSections(newList);
  };

  const [heroBgCropOpen, setHeroBgCropOpen] = useState(false);
  const [heroBgCropSrc, setHeroBgCropSrc] = useState<string | null>(null);

  const handleHeroBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = validateImageFile(e.target.files?.[0] || null, e.target);
    if (!file) return;

    setHeroBgOriginalFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setHeroBgCropSrc(reader.result as string);
      setHeroBgCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroBgCropConfirm = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'hero_bg.jpg', { type: 'image/jpeg' });
    setHeroBgFile(file);
    setHeroBgPreview(URL.createObjectURL(croppedBlob));
    setHeroBgCropOpen(false);
  };

  const handleHeroBgCropCancel = () => {
    setHeroBgCropOpen(false);
  };

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

        if (Array.isArray(result.homepage_sections)) setHomepageSections(result.homepage_sections);
        if (result.hero_title) setHeroTitle(result.hero_title);
        if (result.hero_subtitle) setHeroSubtitle(result.hero_subtitle);
        if (result.hero_bg) setHeroBg(result.hero_bg);
        if (result.video_url) setVideoUrl(result.video_url);
        if (result.profil_visi) setProfilVisi(result.profil_visi);
        if (Array.isArray(result.profil_misi)) {
          setProfilMisiInput(result.profil_misi.join('\n'));
        }
        if (result.profil_sejarah) setProfilSejarah(result.profil_sejarah);
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

      form.append('homepage_sections', JSON.stringify(homepageSections));
      form.append('hero_title', heroTitle);
      form.append('hero_subtitle', heroSubtitle);
      form.append('video_url', videoUrl);
      form.append('profil_visi', profilVisi);

      const misiArr = profilMisiInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      form.append('profil_misi', JSON.stringify(misiArr));
      form.append('profil_sejarah', profilSejarah);

      if (heroBgFile) {
        form.append('hero_bg', heroBgFile);
      }

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

  /** Simpan hanya Visi & Misi */
  const handleSaveVisiMisi = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const misiArr = profilMisiInput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      const form = new FormData();
      form.append('profil_visi', profilVisi);
      form.append('profil_misi', JSON.stringify(misiArr));
      const res = await fetch(`${API_BASE}/backend/API/pengaturan.php`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Visi & Misi sekolah berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan Visi & Misi.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  /** Simpan hanya Sejarah Sekolah */
  const handleSaveSejarah = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('profil_sejarah', profilSejarah);
      const res = await fetch(`${API_BASE}/backend/API/pengaturan.php`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Sejarah sekolah berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan sejarah sekolah.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  /** Simpan hanya Kontak Sekolah */
  const handleSaveKontak = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('email_sekolah', emailSekolah);
      form.append('telepon_sekolah', teleponSekolah);
      form.append('whatsapp_sekolah', whatsappSekolah);
      form.append('alamat_sekolah', alamatSekolah);
      const res = await fetch(`${API_BASE}/backend/API/pengaturan.php`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Kontak sekolah berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan kontak sekolah.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  /** Simpan hanya Link PPDB */
  const handleSavePpdb = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('link_ppdb', linkPpdb);
      form.append('tahun_ajaran', tahunAjaran);
      const res = await fetch(`${API_BASE}/backend/API/pengaturan.php`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Pengaturan PPDB berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan pengaturan PPDB.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  /** Simpan hanya Video Profil */
  const handleSaveVideoUrl = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('video_url', videoUrl);
      const res = await fetch(`${API_BASE}/backend/API/pengaturan.php`, { method: 'POST', body: form });
      const result = await res.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Video profil sekolah berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan video profil.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  // Medsos CRUD Handlers
  const handleOpenAddMedsos = () => {
    setMedsosEditingItem(null);
    setMedsosFormData({ name: '', url: '', icon: 'auto' });
    setMedsosModalOpen(true);
  };

  const handleOpenEditMedsos = (item: MedsosItem) => {
    setMedsosEditingItem(item);
    setMedsosFormData({ name: item.name, url: item.url, icon: item.icon || 'auto' });
    setMedsosModalOpen(true);
  };

  const handleDeleteMedsos = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus media sosial ini?')) {
      const newList = medsosList.filter((m) => m.id !== id);
      setMedsosList(newList);
      handleSaveAll(newList);
    }
  };

  const handleMedsosFormChange = (fields: Partial<{ name: string; url: string; icon: string }>) => {
    setMedsosFormData(prev => ({ ...prev, ...fields }));
  };

  const handleSaveMedsosItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medsosFormData.name || !medsosFormData.url) return;

    let newList: MedsosItem[];

    if (medsosEditingItem) {
      newList = medsosList.map((m) =>
        m.id === medsosEditingItem.id ? { ...m, name: medsosFormData.name, url: medsosFormData.url, icon: medsosFormData.icon } : m
      );
    } else {
      const newItem: MedsosItem = {
        id: `medsos-${Date.now()}`,
        name: medsosFormData.name,
        url: medsosFormData.url,
        icon: medsosFormData.icon,
      };
      newList = [...medsosList, newItem];
    }

    setMedsosList(newList);
    setMedsosModalOpen(false);
    handleSaveAll(newList);
  };

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

  const handleOpenAddHero = () => {
    setEditingHero(null);
    setHeroCaption('');
    setHeroTag('Kegiatan Utama');
    setHeroUrutan(heroSlides.length + 1);
    setHeroModalOpen(true);
  };

  const handleOpenEditHero = (item: HeroCarouselItem) => {
    setEditingHero(item);
    setHeroCaption(item.caption);
    setHeroTag(item.tag || 'Kegiatan Utama');
    setHeroUrutan(item.urutan || 0);
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
    setHeroCropSrc(`${API_BASE}/${source}`);
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

  return {
    tahunAjaran, setTahunAjaran, linkPpdb, setLinkPpdb,
    emailSekolah, setEmailSekolah, teleponSekolah, setTeleponSekolah,
    whatsappSekolah, setWhatsappSekolah, alamatSekolah, setAlamatSekolah,
    medsosList, heroSlides, homepageSections, setHomepageSections,
    heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle,
    heroBg, heroBgPreview, videoUrl, setVideoUrl,
    profilVisi, setProfilVisi, profilMisiInput, setProfilMisiInput,
    profilSejarah, setProfilSejarah,
    loading, saving, message, setMessage,
    // Medsos Modal
    medsosModalOpen, setMedsosModalOpen, medsosEditingItem, medsosFormData,
    handleMedsosFormChange, handleOpenAddMedsos, handleOpenEditMedsos,
    handleDeleteMedsos, handleSaveMedsosItem,
    // Hero carousel drag-drop
    handleHeroDragStart, handleHeroDragOver, handleHeroDrop, draggedHeroIndex,
    // Hero Carousel Modal
    heroModalOpen, setHeroModalOpen, editingHero, heroCaption, heroTag, heroUrutan,
    heroPreview, heroCropOpen, heroCropSrc,
    setHeroCaption, setHeroTag, setHeroUrutan,
    handleHeroFileChange, handleHeroReCrop, handleHeroCropConfirm, handleHeroCropCancel,
    handleOpenAddHero, handleOpenEditHero, handleDeleteHero, handleSaveHero,
    // Hero BG crop
    heroBgCropOpen, heroBgCropSrc,
    handleHeroBgFileChange, handleHeroBgCropConfirm, handleHeroBgCropCancel,
    // Homepage Section drag-drop
    handleSectionDragStart, handleSectionDragOver, handleSectionDrop, updateSection, draggedSectionIndex,
    // Actions
    fetchSettings, fetchHeroSlides, handleSaveAll,
    handleSaveVisiMisi, handleSaveSejarah, handleSaveKontak, handleSavePpdb, handleSaveVideoUrl
  };
};
