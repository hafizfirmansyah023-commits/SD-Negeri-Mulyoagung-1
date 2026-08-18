import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';
import { SettingsFilter } from './types';
import { usePengaturanData } from './hooks/usePengaturanData';
import { PpdbSection } from './Sections/PpdbSection';
import { KontakSection } from './Sections/KontakSection';
import { MedsosSection } from './Sections/MedsosSection';
import { HeroCarouselSection } from './Sections/HeroCarouselSection';
import { StrukturHalamanUtamaSection } from './Sections/StrukturHalamanUtamaSection';
import { KontenUtamaSection } from './Sections/KontenUtamaSection';
import { HeroCarouselModal } from './Modals/HeroCarouselModal';
import { MedsosModal } from './Modals/MedsosModal';
import { ImageCropModal } from '../components/ImageCropModal';

export default function PengaturanSekolah() {
  const [activeFilter, setActiveFilter] = useState<SettingsFilter>('all');

  const {
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
    // Hero drag drop
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
    // Homepage Section drag drop
    handleSectionDragStart, handleSectionDragOver, handleSectionDrop, updateSection, draggedSectionIndex,
    // Actions
    fetchSettings, fetchHeroSlides, handleSaveAll
  } = usePengaturanData();

  useEffect(() => {
    fetchSettings();
    fetchHeroSlides();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Pengaturan Website & Carousel Hero</h2>
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
          onClick={() => setActiveFilter('homepage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'homepage'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🏠 Struktur Halaman Utama
        </button>

        <button
          onClick={() => setActiveFilter('konten')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'konten'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ✍️ Konten Utama
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

      {/* SECTION: STRUKTUR HALAMAN UTAMA */}
      {(activeFilter === 'all' || activeFilter === 'homepage') && (
        <StrukturHalamanUtamaSection
          homepageSections={homepageSections}
          onDragStart={handleSectionDragStart}
          onDragOver={handleSectionDragOver}
          onDrop={handleSectionDrop}
          onUpdate={updateSection}
          draggedSectionIndex={draggedSectionIndex}
        />
      )}

      {/* SECTION: KONTEN UTAMA */}
      {(activeFilter === 'all' || activeFilter === 'konten') && (
        <KontenUtamaSection
          heroTitle={heroTitle}
          setHeroTitle={setHeroTitle}
          heroSubtitle={heroSubtitle}
          setHeroSubtitle={setHeroSubtitle}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          profilVisi={profilVisi}
          setProfilVisi={setProfilVisi}
          profilMisiInput={profilMisiInput}
          setProfilMisiInput={setProfilMisiInput}
          profilSejarah={profilSejarah}
          setProfilSejarah={setProfilSejarah}
        />
      )}

      {/* SECTION: Pengaturan Utama & PPDB */}
      {(activeFilter === 'all' || activeFilter === 'ppdb') && (
        <PpdbSection
          tahunAjaran={tahunAjaran}
          setTahunAjaran={setTahunAjaran}
          linkPpdb={linkPpdb}
          setLinkPpdb={setLinkPpdb}
        />
      )}

      {/* SECTION: Carousel Hero Header CRUD */}
      {(activeFilter === 'all' || activeFilter === 'hero') && (
        <HeroCarouselSection
          heroSlides={heroSlides}
          onAdd={handleOpenAddHero}
          onEdit={handleOpenEditHero}
          onDelete={handleDeleteHero}
          onDragStart={handleHeroDragStart}
          onDragOver={handleHeroDragOver}
          onDrop={handleHeroDrop}
          draggedHeroIndex={draggedHeroIndex}
        />
      )}

      {/* SECTION: Kontak Resmi Sekolah */}
      {(activeFilter === 'all' || activeFilter === 'contact') && (
        <KontakSection
          emailSekolah={emailSekolah}
          setEmailSekolah={setEmailSekolah}
          teleponSekolah={teleponSekolah}
          setTeleponSekolah={setTeleponSekolah}
          whatsappSekolah={whatsappSekolah}
          setWhatsappSekolah={setWhatsappSekolah}
          alamatSekolah={alamatSekolah}
          setAlamatSekolah={setAlamatSekolah}
        />
      )}

      {/* SECTION: Kelola Media Sosial (CRUD) */}
      {(activeFilter === 'all' || activeFilter === 'medsos') && (
        <MedsosSection
          medsosList={medsosList}
          onAdd={handleOpenAddMedsos}
          onEdit={handleOpenEditMedsos}
          onDelete={handleDeleteMedsos}
        />
      )}

      {/* Modals & Crop Overlays */}
      <ImageCropModal
        open={heroBgCropOpen}
        imageSrc={heroBgCropSrc}
        aspectRatio={16 / 9}
        circular={false}
        title="Potong Foto Background Hero"
        outputWidth={1920}
        outputHeight={1080}
        onCancel={handleHeroBgCropCancel}
        onConfirm={handleHeroBgCropConfirm}
      />

      <HeroCarouselModal
        open={heroModalOpen}
        editing={editingHero}
        caption={heroCaption}
        tag={heroTag}
        urutan={heroUrutan}
        preview={heroPreview}
        onChangeCaption={setHeroCaption}
        onChangeTag={setHeroTag}
        onChangeUrutan={setHeroUrutan}
        onFileChange={handleHeroFileChange}
        onReCrop={handleHeroReCrop}
        onSave={handleSaveHero}
        onClose={() => setHeroModalOpen(false)}
      />

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

      <MedsosModal
        open={medsosModalOpen}
        editing={medsosEditingItem}
        formData={medsosFormData}
        onChange={handleMedsosFormChange}
        onSave={handleSaveMedsosItem}
        onClose={() => setMedsosModalOpen(false)}
      />
    </div>
  );
}
