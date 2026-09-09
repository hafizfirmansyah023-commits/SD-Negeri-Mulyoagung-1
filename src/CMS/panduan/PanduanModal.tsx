import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Copy,
  Check,
  User,
  ExternalLink
} from 'lucide-react';
import { PanduanCategory, formatWhatsAppNumber } from './panduanData';

interface PanduanModalProps {
  category: PanduanCategory | null;
  namaGuru: string;
  adminWhatsApp: string;
  onClose: () => void;
}

export const PanduanModal: React.FC<PanduanModalProps> = ({
  category,
  namaGuru,
  adminWhatsApp,
  onClose
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(false);

  useEffect(() => {
    if (category) {
      // Inisialisasi form default
      const initial: Record<string, string> = {};
      category.fields.forEach((field) => {
        if (field.type === 'select' && field.options && field.options.length > 0) {
          initial[field.name] = field.options[0];
        } else {
          initial[field.name] = '';
        }
      });
      setFormData(initial);
      setErrorMsg('');
      setCopiedFormat(false);

      // Kunci scroll background (body & html) saat modal terbuka
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [category, onClose]);

  if (!category) return null;

  const IconComponent = category.icon;

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleCopyNamaFile = () => {
    navigator.clipboard.writeText(category.contohNamaFile);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  const handleKirimWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field wajib
    for (const field of category.fields) {
      if (field.required && (!formData[field.name] || formData[field.name].trim() === '')) {
        setErrorMsg(`Mohon lengkapi field "${field.label}" terlebih dahulu.`);
        return;
      }
    }

    const cleanNumber = formatWhatsAppNumber(adminWhatsApp);
    if (!cleanNumber) {
      setErrorMsg('Nomor WhatsApp Admin belum dikonfigurasi di Kontak Resmi. Hubungi Admin.');
      return;
    }

    const messageText = category.generateMessage(formData, namaGuru || 'Bapak/Ibu Guru');
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

    // Buka WhatsApp di tab baru
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${category.gradientBg} text-white relative shrink-0`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-white shadow-inner">
                <IconComponent size={26} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 border border-white/25 text-teal-100 mb-1">
                  {category.badge}
                </span>
                <h3 id="modal-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {category.judul}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-100/90 mt-2.5 leading-relaxed">
            {category.penjelasan}
          </p>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          
          {/* Ketentuan & Format Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ketentuan File */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
                Ketentuan Pengumpulan
              </h4>
              <ul className="space-y-1.5 text-slate-600 text-[11px] sm:text-xs">
                {category.ketentuan.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Format File & Penamaan */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm mb-1.5">
                  <FileText size={16} className="text-indigo-600 shrink-0" />
                  Format File yang Diizinkan
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {category.formatFile.map((fmt, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-semibold text-[11px]"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Format Nama File:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNamaFile}
                    className="text-[10px] text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
                    title="Salin contoh format"
                  >
                    {copiedFormat ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedFormat ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <code className="block p-2 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-teal-800 break-all select-all font-semibold">
                  {category.contohNamaFile}
                </code>
              </div>
            </div>
          </div>

          {/* Form Pengisian Data Sebelum Kirim WA */}
          <form onSubmit={handleKirimWhatsApp} id="form-panduan-wa" className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Send size={18} className="text-emerald-600" />
                Form Pengumpulan via WhatsApp
              </h4>
              <span className="text-[11px] text-slate-400">Lengkapi data di bawah</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-shake">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Read-Only Info: Nama Guru & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-teal-600" />
                  Nama Guru
                </label>
                <input
                  type="text"
                  value={namaGuru || 'Guru SDN 1 Mulyoagung'}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Kategori Panduan
                </label>
                <input
                  type="text"
                  value={category.judul}
                  readOnly
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Dynamic Fields Berdasarkan Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {category.fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === 'text' && field.name === 'nama_dokumen' ? 'sm:col-span-2' : ''}
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm font-semibold text-slate-800 bg-white"
                      required={field.required}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Preview Teks WhatsApp */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  Pratinjau Format Pesan WhatsApp:
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-normal">
                  Penerima: WhatsApp Admin
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[11px] sm:text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-100 overflow-x-auto max-h-32">
                {category.generateMessage(formData, namaGuru || 'Bapak/Ibu Guru')}
              </pre>
            </div>
          </form>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Batal &amp; Tutup
          </button>

          <button
            type="submit"
            form="form-panduan-wa"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Send size={16} />
            <span>Kirim Pengumpulan via WhatsApp</span>
            <ExternalLink size={13} className="opacity-80" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
