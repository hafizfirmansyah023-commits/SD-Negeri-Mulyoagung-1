import React, { useState, useEffect } from 'react';
import { User, Plus, Trash2, Key, Shield, FileText, Search, Filter, RotateCcw, X } from 'lucide-react';
import { getApiBaseUrl, getImageUrl } from '../config/api';
import { UserSession } from './types';


interface UserData {
  id: number;
  username: string;
  role: 'ADMIN' | 'TIM';
  nama_penanggung_jawab: string;
  foto: string;
}

interface UserCrudProps {
  currentUser: UserSession;
  onUpdateCurrentUser: (user: UserSession) => void;
}

const API_BASE = getApiBaseUrl();

export default function UserCrud({ currentUser, onUpdateCurrentUser }: UserCrudProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Self Update form states
  const [username, setUsername] = useState(currentUser.username);
  const [nama, setNama] = useState(currentUser.nama_penanggung_jawab);
  const [password, setPassword] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  // Admin Create User form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'TIM'>('TIM');
  const [newFotoFile, setNewFotoFile] = useState<File | null>(null);

  const fetchUsers = async () => {
    if (currentUser.role !== 'ADMIN') return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data || []);
      }
    } catch (err) {
      setError('Gagal memuat daftar pengguna.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const handleUpdateSelf = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', currentUser.id.toString());
    formData.append('username', username);
    formData.append('nama_penanggung_jawab', nama);
    if (password) {
      formData.append('password', password);
    }
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess('Profil Anda berhasil diperbarui.');
        setPassword('');
        setFotoFile(null);
        // Update dashboard state
        onUpdateCurrentUser(result.user);
        fetchUsers();
      } else {
        setError(result.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengirim data.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('username', newUsername);
    formData.append('password', newPassword);
    formData.append('nama_penanggung_jawab', newNama);
    formData.append('role', newRole);
    if (newFotoFile) {
      formData.append('foto', newFotoFile);
    }

    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess('Pengguna baru berhasil ditambahkan.');
        setShowAddModal(false);
        setNewUsername('');
        setNewPassword('');
        setNewNama('');
        setNewRole('TIM');
        setNewFotoFile(null);
        fetchUsers();
      } else {
        setError(result.message || 'Gagal menambahkan pengguna.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (id === currentUser.id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri.');
      return;
    }
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSuccess(result.message);
        fetchUsers();
      } else {
        setError(result.message || 'Gagal menghapus pengguna.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-teal-600" /> Pengaturan Akun & Pengguna
          </h2>
          <p className="text-slate-500 text-sm">Ubah profil Anda atau kelola akses pengguna lain.</p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all transform hover:scale-102 cursor-pointer"
          >
            <Plus size={18} /> Tambah User
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Key className="text-teal-600" size={18} /> Profil & Keamanan Saya
          </h3>
          
          <form onSubmit={handleUpdateSelf} className="space-y-4">
            <div className="flex justify-center pb-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500/20 bg-slate-100 flex items-center justify-center">
                {currentUser.foto ? (
                  <img
                    src={getImageUrl(currentUser.foto)}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-slate-400" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1">Nama Penanggung Jawab</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1">Ganti Password (Opsional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password baru"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-1">Foto Profil Baru (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                className="w-full text-slate-600 text-xs border border-slate-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium py-2.5 rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Perbarui Profil
            </button>
          </form>
        </div>

        {/* User Management List (Admin Only) */}
        {currentUser.role === 'ADMIN' && (() => {
          const availableRoles = Array.from(new Set(users.map((u) => u.role).filter(Boolean)));
          const filteredUsers = users.filter((u) => {
            const matchesSearch =
              !searchTerm.trim() ||
              u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u.nama_penanggung_jawab.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
            return matchesSearch && matchesRole;
          });
          const isFiltered = searchTerm !== '' || selectedRole !== 'ALL';

          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="text-teal-600" size={18} /> Kelola Akses Pengguna
                </h3>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari username / nama..."
                    className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs text-slate-700 placeholder-slate-400 bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={15} className="text-slate-400" />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                  >
                    <option value="ALL">Semua Role</option>
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {isFiltered && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedRole('ALL');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} /> Reset
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold">
                        <th className="pb-3">User</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                              {u.foto ? (
                                <img
                                  src={getImageUrl(u.foto)}
                                  alt={u.nama_penanggung_jawab}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{u.nama_penanggung_jawab}</p>
                              <p className="text-xs text-slate-400">@{u.username}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === currentUser.id}
                              className={`p-2 rounded-lg transition-colors inline-flex cursor-pointer ${
                                u.id === currentUser.id
                                  ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                                  : 'text-red-600 bg-red-50 hover:bg-red-100'
                              }`}
                              title="Hapus User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-slate-400 text-sm font-medium">
                            {isFiltered ? 'Tidak ada pengguna yang sesuai dengan filter atau kata kunci pencarian.' : 'Belum ada pengguna terdaftar.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Admin Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-slate-200 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Nama Penanggung Jawab</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Nama Lengkap / Jabatan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Username untuk login"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password akun"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Akses Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'TIM')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="TIM">TIM (Upload berita & galeri perlu verifikasi)</option>
                  <option value="ADMIN">ADMIN (Akses penuh CRUD & Verifikasi)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-1">Foto Profil (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewFotoFile(e.target.files?.[0] || null)}
                  className="w-full text-slate-600 text-xs border border-slate-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 font-medium cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
