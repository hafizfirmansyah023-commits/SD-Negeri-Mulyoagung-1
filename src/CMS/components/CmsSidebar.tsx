import React from 'react';
import { Users, Image, FileText, User, ShieldAlert, LogOut, ArrowLeft, School, Building, Settings, Award, Megaphone } from 'lucide-react';
import { getImageUrl } from '../../config/api';
import { UserSession, CmsTab } from '../types';

interface CmsSidebarProps {
    user: UserSession;
    activeTab: CmsTab;
    setActiveTab: (tab: CmsTab) => void;
    onBackToHome: () => void;
    onLogout: () => void;
}

export default function CmsSidebar({
    user,
    activeTab,
    setActiveTab,
    onBackToHome,
    onLogout,
}: CmsSidebarProps) {
    return (
        <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
            <div>
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <School className="text-teal-400 shrink-0" size={28} />
                    <div>
                        <h1 className="font-bold text-sm leading-tight text-slate-200">SDN 1 Mulyoagung</h1>
                        <p className="text-xs text-slate-500">Dashboard Konten</p>
                    </div>
                </div>

                {/* User Section */}
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                        {user.foto ? (
                            <img
                                src={getImageUrl(user.foto)}
                                alt={user.nama_penanggung_jawab}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={20} className="text-slate-400" />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-xs truncate text-slate-200">{user.nama_penanggung_jawab}</p>
                        <span
                            className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full ${
                                user.role === 'ADMIN'
                                    ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                                    : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                            }`}
                        >
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-1.5">
                    <button
                        onClick={() => setActiveTab('guru')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'guru'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Users size={18} /> Direktori Guru
                    </button>
                    <button
                        onClick={() => setActiveTab('sambutan')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'sambutan'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Award size={18} /> Sambutan Kepsek
                    </button>
                    <button
                        onClick={() => setActiveTab('pengumuman')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'pengumuman'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Megaphone size={18} /> Pengumuman Penting
                    </button>
                    <button
                        onClick={() => setActiveTab('fasilitas')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'fasilitas'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Building size={18} /> Fasilitas Pembelajaran
                    </button>
                    <button
                        onClick={() => setActiveTab('galeri')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'galeri'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Image size={18} /> Galeri Foto
                    </button>
                    <button
                        onClick={() => setActiveTab('berita')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'berita'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <FileText size={18} /> Berita & Pengumuman
                    </button>

                    {user.role === 'ADMIN' && (
                        <button
                            onClick={() => setActiveTab('verifikasi')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'verifikasi'
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                        >
                            <ShieldAlert size={18} /> Pusat Verifikasi
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab('user')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'user'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <User size={18} /> Pengaturan Akun
                    </button>
                    <button
                        onClick={() => setActiveTab('pengaturan')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            activeTab === 'pengaturan'
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                    >
                        <Settings size={18} /> Pengaturan Sekolah
                    </button>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                    onClick={onBackToHome}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Ke Web Utama
                </button>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                >
                    <LogOut size={14} /> Keluar Akun
                </button>
            </div>
        </aside>
    );
}
