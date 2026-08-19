import React, { useEffect } from 'react';

import { CmsToast } from './components/CmsToast';
import { Sliders, Save, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { usePengaturanData } from './pengaturan/hooks/usePengaturanData';
import { HeroCarouselSection } from './pengaturan/Sections/HeroCarouselSection';
import { HeroCarouselModal } from './pengaturan/Modals/HeroCarouselModal';
import { ImageCropModal } from './components/ImageCropModal';
import { getImageUrl } from '../config/api';

export default function HeroCrud() {
  const {
    heroSlides,
    heroTitle, setHeroTitle,
    heroSubtitle, setHeroSubtitle,
    loading, saving, message, setMessage,
    heroModalOpen, setHeroModalOpen, editingHero, heroCaption, heroTag, heroUrutan,
    heroPreview, heroCropOpen, heroCropSrc,
    setHeroCaption, setHeroTag, setHeroUrutan,
    handleHeroFileChange, handleHeroReCrop, handleHeroCropConfirm, handleHeroCropCancel,
    handleOpenAddHero, handleOpenEditHero, handleDeleteHero, handleSaveHero,
    handleHeroDragStart, handleHeroDragOver, handleHeroDrop, draggedHeroIndex,
    fetchSettings, fetchHeroSlides, handleSaveAll
  } = usePengaturanData();

  useEffect(() => {
    fetchSettings();
    fetchHeroSlides();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
            <Sliders size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Carousel Hero &amp; Header</h2>
            <p className="text-sm text-slate-500">Kelola gambar slide carousel hero, judul, dan subjudul</p>
          </div>
        </div>

        <button
          onClick={() => handleSaveAll()}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Teks Hero Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Teks Hero</h3>
            <div className="space-y-4 max-w-4xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Hero
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Selamat Datang di SD Negeri 1 Mulyoagung"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subjudul Hero
                </label>
                <textarea
                  rows={4}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Deskripsi singkat hero..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Hero Carousel CRUD */}
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
        </div>
      )}

      {/* Modals & Crop Overlays */}
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
    </div>
  );
}