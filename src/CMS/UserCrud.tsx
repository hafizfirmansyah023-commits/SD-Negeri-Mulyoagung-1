import React, { useState, useEffect } from 'react';
import { User, Plus, Shield } from 'lucide-react';
import { getApiBaseUrl } from '../config/api';
import { UserSession } from './types';
import { useCmsFilter } from './hooks/useCmsFilter';
import CmsFilterBar from './components/CmsFilterBar';
import { getUniqueValues } from './utils/cmsHelpers';
import { SelfProfileCard } from './user/SelfProfileCard';
import { UserTable, UserData } from './user/UserTable';
import { UserFormModal } from './user/UserFormModal';
import { ResetPasswordModal } from './user/ResetPasswordModal';
import { ImageUploadPayload } from './components/ImageUploadField';
import { CmsToast, ToastType } from './components/CmsToast';
import { CmsConfirmModal, ConfirmState } from './components/CmsConfirmModal';

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
  const [toast, setToast] = useState<{ type: ToastType; text: string } | null>(null);

  // Confirm Modal state
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    variant: 'delete',
    onConfirm: () => {},
  });

  // Self Update form states
  const [username, setUsername] = useState(currentUser.username);
  const [nama, setNama] = useState(currentUser.nama_penanggung_jawab);
  const [password, setPassword] = useState('');
  const [fotoSelection, setFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });

  // Admin Create User form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'TIM' | 'GURU'>('GURU');
  const [newFotoSelection, setNewFotoSelection] = useState<ImageUploadPayload>({ original: null, cropped: null });

  // Reset Password states
  const [targetUserForReset, setTargetUserForReset] = useState<UserData | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Filter Hook
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilter,
    isFiltered,
    filteredItems: filteredUsers,
  } = useCmsFilter<UserData>({
    items: users,
    searchFields: ['username', 'nama_penanggung_jawab'],
    initialFilters: { role: 'ALL' },
  });

  const availableRoles = getUniqueValues(users, 'role');

  const fetchUsers = async () => {
    if (currentUser.role !== 'ADMIN') return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`);
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data || []);
      }
    } catch {
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

    if (password && password.length < 6) {
      setError('Password baru harus memiliki minimal 6 karakter.');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'update');
    formData.append('id', currentUser.id.toString());
    formData.append('username', username);
    formData.append('nama_penanggung_jawab', nama);
    if (password) {
      formData.append('password', password);
    }
    if (fotoSelection.original) {
      formData.append('foto_original', fotoSelection.original);
    }
    if (fotoSelection.cropped) {
      formData.append('foto', fotoSelection.cropped);
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
        setFotoSelection({ original: null, cropped: null });
        onUpdateCurrentUser(result.user);
        fetchUsers();
      } else {
        setError(result.message || 'Gagal memperbarui profil.');
      }
    } catch {
      setError('Terjadi kesalahan saat mengirim data.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password harus memiliki minimal 6 karakter.');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('username', newUsername);
    formData.append('password', newPassword);
    formData.append('nama_penanggung_jawab', newNama);
    formData.append('role', newRole);
    if (newFotoSelection.original) {
      formData.append('foto_original', newFotoSelection.original);
    }
    if (newFotoSelection.cropped) {
      formData.append('foto', newFotoSelection.cropped);
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
        setNewFotoSelection({ original: null, cropped: null });
        fetchUsers();
      } else {
        setError(result.message || 'Gagal menambah pengguna.');
      }
    } catch {
      setError('Terjadi kesalahan saat mengirim data.');
    }
  };

  const handleDeleteUser = (id: number) => {
    if (id === currentUser.id) {
      setToast({ type: 'error', text: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' });
      return;
    }
    setConfirmState({
      isOpen: true,
      variant: 'delete',
      title: 'Konfirmasi Hapus Pengguna',
      message: 'Apakah Anda yakin ingin menghapus akun pengguna ini? Data yang dihapus tidak dapat dikembalikan.',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
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
            setToast({ type: 'delete', text: 'Pengguna berhasil dihapus.' });
            fetchUsers();
          } else {
            setToast({ type: 'error', text: result.message || 'Gagal menghapus pengguna.' });
          }
        } catch {
          setToast({ type: 'error', text: 'Terjadi kesalahan saat menghapus pengguna.' });
        }
      },
    });
  };

  const handleConfirmResetPassword = async (user: UserData) => {
    setIsResetting(true);
    setError('');

    const formData = new FormData();
    formData.append('action', 'reset_password');
    formData.append('id', user.id.toString());

    try {
      const response = await fetch(`${API_BASE}/backend/API/users.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success' && result.new_password) {
        setGeneratedPassword(result.new_password);
        setSuccess(`Password untuk @${user.username} berhasil di-reset.`);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id ? { ...u, lastResetPassword: result.new_password } : u
          )
        );
      } else {
        setError(result.message || 'Gagal mereset password pengguna.');
        setTargetUserForReset(null);
      }
    } catch {
      setError('Terjadi kesalahan saat menghubungi server untuk reset password.');
      setTargetUserForReset(null);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-teal-600 shrink-0" /> Pengaturan Akun & Akses
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola profil pribadi dan hak akses pengguna CMS.</p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all cursor-pointer text-sm"
          >
            <Plus size={18} /> Tambah User Baru
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

      {currentUser.role === 'ADMIN' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Self Profile Card */}
          <SelfProfileCard
            currentUser={currentUser}
            username={username}
            setUsername={setUsername}
            nama={nama}
            setNama={setNama}
            password={password}
            setPassword={setPassword}
            setFotoSelection={setFotoSelection}
            onSubmit={handleUpdateSelf}
          />

          {/* User Management List (Admin Only) */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 sm:space-y-6 lg:col-span-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Shield className="text-teal-600 shrink-0" size={18} /> Kelola Akses Pengguna
              </h3>
            </div>

            {/* Filter Bar */}
            <CmsFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Cari username / nama..."
              isFiltered={isFiltered}
              onReset={resetFilter}
              selectFilters={[
                {
                  key: 'role',
                  value: filters.role || 'ALL',
                  onChange: (val) => setFilter('role', val),
                  options: [
                    { value: 'ALL', label: 'Semua Role' },
                    ...availableRoles.map((r) => ({ value: r, label: r })),
                  ],
                },
              ]}
            />

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-600"></div>
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                currentUser={currentUser}
                isFiltered={isFiltered}
                onDeleteUser={handleDeleteUser}
                onResetPassword={(u) => {
                  setTargetUserForReset(u);
                  setGeneratedPassword(null);
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full py-2 sm:py-6">
          <div className="w-full max-w-xl mx-auto">
            <SelfProfileCard
              currentUser={currentUser}
              username={username}
              setUsername={setUsername}
              nama={nama}
              setNama={setNama}
              password={password}
              setPassword={setPassword}
              setFotoSelection={setFotoSelection}
              onSubmit={handleUpdateSelf}
            />
          </div>
        </div>
      )}

      {/* Admin Add User Modal */}
      <UserFormModal
        showAddModal={showAddModal}
        newNama={newNama}
        setNewNama={setNewNama}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        newRole={newRole}
        setNewRole={setNewRole}
        setNewFotoSelection={setNewFotoSelection}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddUser}
      />

      {/* Admin Reset Password Modal */}
      <ResetPasswordModal
        user={targetUserForReset}
        generatedPassword={generatedPassword}
        isLoading={isResetting}
        onClose={() => {
          setTargetUserForReset(null);
          setGeneratedPassword(null);
        }}
        onConfirmReset={handleConfirmResetPassword}
      />

      <CmsToast message={toast} onClose={() => setToast(null)} />

      <CmsConfirmModal
        isOpen={confirmState.isOpen}
        variant={confirmState.variant}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
