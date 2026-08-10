import React from 'react';
import { MessageCircle, Phone, Send, Tag, User } from 'lucide-react';
import { ComplaintFormData, KATEGORI_PENGADUAN } from '../../utils/contactHelpers';

interface ComplaintFormProps {
  formData: ComplaintFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ formData, onChange, onSubmit }) => (
  <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-white/60 flex flex-col justify-between h-full">
    <form onSubmit={onSubmit} className="flex flex-col justify-between h-full space-y-5 sm:space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-emerald-500 text-white shadow-md shrink-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Form Pengaduan Masyarakat
            </h3>
            <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5 leading-snug">
              Tulis laporan/masukan Anda di bawah ini untuk dikirim langsung ke WhatsApp pengaduan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input
                type="text"
                name="nama"
                required
                value={formData.nama}
                onChange={onChange}
                placeholder="Nama Anda"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              No. WhatsApp / HP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input
                type="text"
                name="noHp"
                value={formData.noHp}
                onChange={onChange}
                placeholder="081234567890"
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Kategori Pengaduan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={onChange}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
            >
              {KATEGORI_PENGADUAN.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pesan Pengaduan <span className="text-red-500">*</span>
          </label>
          <textarea
            name="pesan"
            required
            rows={3}
            value={formData.pesan}
            onChange={onChange}
            placeholder="Tuliskan pesan pengaduan atau masukan Anda di sini..."
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 resize-none"
          />
        </div>
      </div>

      <div className="pt-4 sm:pt-6 border-t border-slate-100 mt-auto">
        <button
          type="submit"
          className="w-full bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl transition-all shadow-md hover:shadow-teal-700/20 flex items-center justify-center gap-2 group cursor-pointer text-xs sm:text-base leading-snug"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-1" />
          <span>Kirim Pengaduan via WhatsApp</span>
        </button>
      </div>
    </form>
  </div>
);
