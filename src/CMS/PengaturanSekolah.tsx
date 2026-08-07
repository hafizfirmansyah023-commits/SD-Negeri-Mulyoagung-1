import React, { useState, useEffect } from 'react';
import { Settings, Save, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';

const API_BASE = getApiBaseUrl();

export default function PengaturanSekolah() {
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/pengaturan.php`);
      const result = await response.json();
      if (result.status === 'success' && result.tahun_ajaran) {
        setTahunAjaran(result.tahun_ajaran);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memuat data pengaturan.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('tahun_ajaran', tahunAjaran);

      const response = await fetch(`${API_BASE}/backend/API/pengaturan.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 'success') {
        setMessage({ type: 'success', text: 'Tahun ajaran berhasil diperbarui!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Pengaturan Sekolah</h2>
          <p className="text-sm text-slate-500">Kelola tahun ajaran dan konfigurasi informasi sekolah</p>
        </div>
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

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              Tahun Ajaran Aktif (Hero Section)
            </label>
            <input
              type="text"
              required
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              placeholder="Contoh: 2025/2026 atau 2026/2027"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm font-semibold text-slate-800"
            />
            <p className="text-xs text-slate-500 mt-2">
              Tahun ajaran ini akan ditampilkan secara otomatis pada badge bagian atas Hero Section di halaman utama website.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving || loading}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-teal-700/20 disabled:opacity-50 cursor-pointer"
            >
              <Save size={18} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
