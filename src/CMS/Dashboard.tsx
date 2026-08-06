import React, { useState, useEffect } from 'react';
import { 
  Users, Image, FileText, User, ShieldAlert, LogOut, 
  Lock, ArrowLeft, School, GraduationCap, LayoutDashboard 
} from 'lucide-react';
import GuruCrud from './GuruCrud';
import GaleriCrud from './GaleriCrud';
import BeritaCrud from './BeritaCrud';
import UserCrud from './UserCrud';
import Verifikasi from './Verifikasi';

interface UserSession {
  id: number;
  username: string;
  role: 'ADMIN' | 'TIM';
  nama_penanggung_jawab: string;
  foto: string;
}

interface DashboardProps {
  onBackToHome: () => void;
}

const API_BASE = 'http://localhost/sd-negeri-mulyoagung-1';

export default function Dashboard({ onBackToHome }: DashboardProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'guru' | 'galeri' | 'berita' | 'user' | 'verifikasi'>('guru');

  // Auth form states
  const [isLoginView, setIsLoginView] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [namaInput, setNamaInput] = useState('');
  const [roleInput, setRoleInput] = useState<'ADMIN' | 'TIM'>('TIM');
  
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  useEffect(() => {
    // Check if user is saved in localStorage
    const savedUser = localStorage.getItem('cms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await fetch(`${API_BASE}/backend/API/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setUser(result.user);
        localStorage.setItem('cms_user', JSON.stringify(result.user));
        // Reset inputs
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setAuthError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setAuthError('Gagal terhubung dengan server database backend.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const response = await fetch(`${API_BASE}/backend/API/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          username: usernameInput,
          password: passwordInput,
          nama_penanggung_jawab: namaInput,
          role: roleInput,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setAuthSuccess(result.message || 'Pendaftaran berhasil. Silakan login.');
        setIsLoginView(true);
        // Reset password
        setPasswordInput('');
      } else {
        setAuthError(result.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setAuthError('Gagal terhubung dengan server database backend.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cms_user');
    setActiveTab('guru');
  };

  const handleUpdateUser = (updatedUser: UserSession) => {
    setUser(updatedUser);
    localStorage.setItem('cms_user', JSON.stringify(updatedUser));
  };

  // If not logged in, show Login/Register Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 cursor-pointer"
        >
          <ArrowLeft size={16} /> Kembali ke Halaman Utama
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden transition-all duration-300">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white text-center">
            <School size={48} className="mx-auto mb-3" />
            <h1 className="text-2xl font-bold">CMS SDN 1 Mulyoagung</h1>
            <p className="text-teal-100/90 text-sm mt-1">Dashboard Konten & Kesiswaan</p>
          </div>

          <div className="p-8 space-y-6">
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-xs font-semibold">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-md transition-all transform hover:translate-y-[-1px] cursor-pointer"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View (Logged In)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
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
                  src={`${API_BASE}/${user.foto}`}
                  alt={user.nama_penanggung_jawab}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-slate-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs truncate text-slate-200">{user.nama_penanggung_jawab}</p>
              <span className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full ${
                user.role === 'ADMIN' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50' : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('guru')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'guru' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Users size={18} /> Direktori Guru
            </button>
            <button
              onClick={() => setActiveTab('galeri')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'galeri' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Image size={18} /> Galeri Foto
            </button>
            <button
              onClick={() => setActiveTab('berita')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'berita' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <FileText size={18} /> Berita & Pengumuman
            </button>

            {user.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('verifikasi')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'verifikasi' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <ShieldAlert size={18} /> Pusat Verifikasi
              </button>
            )}

            <button
              onClick={() => setActiveTab('user')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'user' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <User size={18} /> Pengaturan Akun
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl">
        {activeTab === 'guru' && <GuruCrud />}
        {activeTab === 'galeri' && <GaleriCrud currentUser={user} />}
        {activeTab === 'berita' && <BeritaCrud currentUser={user} />}
        {activeTab === 'verifikasi' && user.role === 'ADMIN' && <Verifikasi />}
        {activeTab === 'user' && <UserCrud currentUser={user} onUpdateCurrentUser={handleUpdateUser} />}
      </main>
    </div>
  );
}
