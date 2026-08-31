import React from 'react';
import { X } from 'lucide-react';
import { MedsosItem } from '../types';
import { SocialMediaIcon } from '../../../components/common/SocialMediaIcon';

interface MedsosModalProps {
  open: boolean;
  editing: MedsosItem | null;
  formData: { name: string; url: string; icon: string };
  onChange: (fields: Partial<{ name: string; url: string; icon: string }>) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const MedsosModal: React.FC<MedsosModalProps> = ({
  open,
  editing,
  formData,
  onChange,
  onSave,
  onClose,
}) => {
  React.useEffect(() => {
    if (open) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-base">
            {editing ? 'Edit Media Sosial' : 'Tambah Media Sosial Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nama Platform / Media Sosial *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Instagram, YouTube, TikTok, Facebook, Twitter, WhatsApp"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
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
              onChange={(e) => onChange({ url: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Pilihan Icon
            </label>
            <select
              value={formData.icon}
              onChange={(e) => onChange({ icon: e.target.value })}
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
              onClick={onClose}
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
  );
};
