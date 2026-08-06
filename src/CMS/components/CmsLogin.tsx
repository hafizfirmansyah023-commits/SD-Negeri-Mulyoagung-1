import React, { useState } from 'react';
import { ArrowLeft, School } from 'lucide-react';
import { getApiBaseUrl } from '../../config/api';
import { UserSession } from '../types';

interface CmsLoginProps {
    onLoginSuccess: (user: UserSession) => void;
    onBackToHome: () => void;
}

const API_BASE = getApiBaseUrl();

export default function CmsLogin({ onLoginSuccess, onBackToHome }: CmsLoginProps) {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');

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
                onLoginSuccess(result.user);
                setUsernameInput('');
                setPasswordInput('');
            } else {
                setAuthError(result.message || 'Login gagal.');
            }
        } catch (err) {
            setAuthError('Gagal terhubung dengan server database backend.');
        }
    };

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
