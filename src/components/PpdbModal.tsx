import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, CheckCircle2, Download, Printer, FileText, ArrowRight } from 'lucide-react';
import { PpdbApplication } from '../types';
import logoImg from '../assets/logo.png';

interface PpdbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PpdbModal: React.FC<PpdbModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    studentName: '',
    nik: '',
    birthPlaceDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    parentName: '',
    parentPhone: '',
    address: '',
    track: 'Zonasi' as 'Zonasi' | 'Afirmasi' | 'Prestasi' | 'Perpindahan Orang Tua',
    previousSchool: '',
  });

  const [submittedData, setSubmittedData] = useState<PpdbApplication | null>(null);

  // Lock body & html scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
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
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRecord: PpdbApplication = {
      id: `ppdb-${Date.now()}`,
      regNumber: `PPDB-2025-SD Negeri1-${randomNum}`,
      studentName: formData.studentName,
      nik: formData.nik,
      birthPlaceDate: formData.birthPlaceDate,
      gender: formData.gender,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      address: formData.address,
      track: formData.track,
      previousSchool: formData.previousSchool || 'TK / PAUD Sederajat',
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Menunggu Verifikasi',
    };

    setSubmittedData(newRecord);
    setStep(3); // Result step
  };

  const handleReset = () => {
    setSubmittedData(null);
    setStep(1);
    setFormData({
      studentName: '',
      nik: '',
      birthPlaceDate: '',
      gender: 'Laki-laki',
      parentName: '',
      parentPhone: '',
      address: '',
      track: 'Zonasi',
      previousSchool: '',
    });
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto overscroll-contain animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1E3A8A] dark:bg-slate-950 text-white p-6 sm:p-8 flex justify-between items-start relative border-b border-blue-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src={logoImg} className="w-full h-full object-contain drop-shadow-md" alt="Logo SD Negeri 1 Mulyoagung" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#F9A825] text-blue-950 text-[11px] font-bold px-3 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Tahun Ajaran 2025/2026
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold">
                Formulir PPDB Online
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 opacity-90">
                Penerimaan Peserta Didik Baru SD Negeri 1 Mulyoagung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
          {step !== 3 && (
            <div className="flex items-center justify-between mb-8 px-2">
              <div
                className={`flex items-center gap-2 text-xs font-bold ${
                  step === 1
                    ? 'text-[#028C84] dark:text-teal-400'
                    : 'text-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
                  1
                </span>
                Data Siswa
              </div>
              <div className="h-0.5 flex-grow mx-4 bg-slate-200 dark:bg-slate-800" />
              <div
                className={`flex items-center gap-2 text-xs font-bold ${
                  step === 2
                    ? 'text-[#028C84] dark:text-teal-400'
                    : 'text-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
                  2
                </span>
                Orang Tua & Jalur
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-2">
                Langkah 1: Informasi Calon Peserta Didik
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sesuai Kartu Keluarga / Akta Kelahiran"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIK Siswa (16 digit) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="3507xxxxxxxxxxxx"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value as 'Laki-laki' | 'Perempuan',
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tempat, Tanggal Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Malang, 12 Mei 2018"
                    value={formData.birthPlaceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthPlaceDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Asal Sekolah TK / PAUD
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: TK Dharma Wanita Mulyoagung"
                    value={formData.previousSchool}
                    onChange={(e) =>
                      setFormData({ ...formData, previousSchool: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.studentName || !formData.nik}
                  onClick={() => setStep(2)}
                  className="bg-[#028C84] hover:bg-[#006a64] disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Lanjut ke Langkah 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-2">
                Langkah 2: Data Orang Tua & Jalur Pendaftaran
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Ayah / Ibu / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap penanggung jawab"
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jalur Pendaftaran *
                </label>
                <select
                  value={formData.track}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      track: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-teal-700 dark:text-teal-300"
                >
                  <option value="Zonasi">Zonasi (Domisili Terdekat Desa Mulyoagung & Sekitarnya)</option>
                  <option value="Afirmasi">Afirmasi (Pemegang KIP / PKH / KKM)</option>
                  <option value="Prestasi">Prestasi (Perlombaan / Nilai TK)</option>
                  <option value="Perpindahan Orang Tua">Perpindahan Tugas Orang Tua</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap Domisili *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jl. Raya / Dusun, RT/RW, Desa Mulyoagung, Kec. Dau, Kab. Malang"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-4 py-2"
                >
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={!formData.parentName || !formData.parentPhone || !formData.address}
                  className="bg-[#1E3A8A] hover:bg-[#00236f] disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Kirim Pendaftaran</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Registration Card Confirmation */}
          {step === 3 && submittedData && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-950 text-[#028C84] dark:text-teal-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A] dark:text-blue-300">
                  Pendaftaran Berhasil Dikirim!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Simpan Bukti Pendaftaran ini untuk proses verifikasi berkas di panitia sekolah.
                </p>
              </div>

              {/* Printable Ticket Card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border-2 border-dashed border-teal-500/40 text-left space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Nomor Registrasi
                    </span>
                    <span className="font-extrabold text-lg text-[#028C84] dark:text-teal-400">
                      {submittedData.regNumber}
                    </span>
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full font-sans">
                    {submittedData.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-sans text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Siswa:</span>
                    <span className="font-bold">{submittedData.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">NIK:</span>
                    <span className="font-bold">{submittedData.nik}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jalur:</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{submittedData.track}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Waktu Daftar:</span>
                    <span className="font-semibold">{submittedData.submittedAt}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">Orang Tua / No. WA:</span>
                    <span className="font-bold">{submittedData.parentName} ({submittedData.parentPhone})</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => alert(`Bukti Pendaftaran ${submittedData.regNumber} berhasil diunduh (PDF)!`)}
                  className="bg-[#028C84] hover:bg-[#006a64] text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Bukti Pendaftaran</span>
                </button>

                <button
                  onClick={handleReset}
                  className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
