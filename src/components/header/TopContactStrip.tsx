import React from 'react';
import { Mail, Phone } from 'lucide-react';

export const TopContactStrip: React.FC = () => (
  <div className="bg-gradient-to-r from-[#0D4A46]/100 to-[#156B63]/100">
    {/*
      FIX MOBILE: div ini di kode asli sama sekali tidak punya padding,
      jadi kontennya nempel ke tepi layar (terutama terlihat di HP).
      Ditambahkan px-4 & py-1.5 HANYA untuk breakpoint di bawah "sm" (sm:px-0 sm:py-0),
      supaya tampilan sm ke atas (tablet/desktop) tetap 100% sama seperti kode asli.
    */}
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-0 sm:py-0">
      <div className="flex items-center gap-4 text-slate-300 min-w-0">
        {/* FIX MOBILE: email dibatasi lebar & di-truncate di HP (max-w-none dari sm ke atas = tidak berubah) */}
        <span className="flex items-center gap-1 min-w-0">
          <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="truncate max-w-[170px] sm:max-w-none">sdnmulyoagung01@gmail.com</span>
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-teal-400" />
          (0341) 466-730
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-400/30 whitespace-nowrap">
          Akreditasi A
        </span>
        {/* FIX MOBILE: disembunyikan di layar sangat sempit agar tidak berdesakan dengan badge di atas,
            sama seperti nomor telepon yang sudah disembunyikan di mobile. Tampil normal dari sm ke atas. */}
        <span className="hidden sm:inline text-slate-300 text-[11px] whitespace-nowrap">
          Kec. Dau, Kab. Malang
        </span>
      </div>
    </div>
  </div>
);
