import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, School, Eye, EyeOff, RotateCw, ShieldAlert, Clock } from 'lucide-react';
import { getApiBaseUrl } from '../../config/api';
import { UserSession } from '../types';
import heroImg1 from '../../assets/images/img2.webp';
import logoImg from '../../assets/images/logo.png';

interface CmsLoginProps {
    onLoginSuccess: (user: UserSession) => void;
    onBackToHome: () => void;
}

const API_BASE = getApiBaseUrl();

export default function CmsLogin({ onLoginSuccess, onBackToHome }: CmsLoginProps) {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Captcha states
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');

    // Rate limiter state
    const [isBlocked, setIsBlocked] = useState(false);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Generate random 5-character alphanumeric captcha
    const generateCaptcha = () => {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setCaptchaInput('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // Countdown timer saat diblokir
    useEffect(() => {
        if (retryCountdown <= 0) {
            setIsBlocked(false);
            if (countdownRef.current) clearInterval(countdownRef.current);
            return;
        }
        countdownRef.current = setInterval(() => {
            setRetryCountdown(prev => {
                if (prev <= 1) {
                    setIsBlocked(false);
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
    }, [retryCountdown > 0 && isBlocked]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthSuccess('');

        if (isBlocked) return;

        // Validate Captcha
        if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
            setAuthError('Kode Captcha tidak sesuai. Silakan coba lagi.');
            generateCaptcha();
            return;
        }

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
                setCaptchaInput('');
            } else if (response.status === 429) {
                // Diblokir rate limiter
                setIsBlocked(true);
                setRetryCountdown(result.retry_after ?? 900);
                setAuthError(result.message || 'Terlalu banyak percobaan. Coba lagi nanti.');
                generateCaptcha();
            } else {
                setAuthError(result.message || 'Login gagal.');
                generateCaptcha();
            }
        } catch (err) {
            setAuthError('Gagal terhubung dengan server database backend.');
            generateCaptcha();
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#0D4A46]">
            {/* Hero-styled Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="bg-cover bg-center w-full h-full opacity-30 scale-105"
                    style={{
                        backgroundImage: `url(${heroImg1})`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D4A46]/85 via-[#0D4A46]/70 to-[#156B63]/85" />
            </div>

            {/* Ambient Ambient Glow Circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#20C997]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#79EEDE]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Login Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-w-md w-full overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D4A46] to-[#156B63] p-8 text-white text-center border-b border-teal-500/20">
                    <img src={logoImg} alt="Logo SD" className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow-md" />
                    <h1 className="text-2xl font-bold">CMS SD Negeri 1 Mulyoagung</h1>
                    <p className="text-teal-100/90 text-sm mt-1">Dashboard Konten & Kesiswaan</p>
                </div>

                <div className="p-8 space-y-5">
                    {isBlocked && retryCountdown > 0 ? (
                        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <ShieldAlert size={16} className="text-red-600 shrink-0" />
                                Akses Sementara Diblokir
                            </div>
                            <p className="text-xs text-red-700">
                                Terlalu banyak percobaan login gagal. Silakan tunggu sebelum mencoba kembali.
                            </p>
                            <div className="flex items-center gap-1.5 bg-red-100 rounded-lg px-3 py-2 font-mono font-bold text-red-800 text-sm">
                                <Clock size={14} className="text-red-600" />
                                Buka kunci dalam: {Math.floor(retryCountdown / 60).toString().padStart(2, '0')}:{(retryCountdown % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    ) : authError && (
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
                        {/* Username Input */}
                        <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Username</label>
                            <input
                                type="text"
                                required
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                                placeholder="Masukkan username"
                            />
                        </div>

                        {/* Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-800"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                                    title={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Captcha Section */}
                        <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Verifikasi Captcha</label>
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="flex-grow bg-slate-900 text-[#79EEDE] font-mono text-xl font-bold tracking-[0.3em] px-4 py-2.5 rounded-xl text-center select-none shadow-inner border border-slate-700 relative overflow-hidden"
                                    style={{
                                        backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                                        backgroundSize: '8px 8px',
                                    }}
                                >
                                    <span className="line-through decoration-teal-400/50 decoration-2 italic drop-shadow">
                                        {captchaCode}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={generateCaptcha}
                                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all shrink-0 cursor-pointer"
                                    title="Acak ulang Captcha"
                                >
                                    <RotateCw size={18} />
                                </button>
                            </div>
                            <input
                                type="text"
                                required
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 uppercase tracking-widest font-mono text-center text-slate-800"
                                placeholder="Masukkan kode captcha"
                            />
                        </div>

                        {/* Login Submit Button */}
                        <button
                            type="submit"
                            disabled={isBlocked}
                            className={`w-full font-medium py-3 rounded-xl shadow-md transition-all mt-2 ${
                                isBlocked
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#0D4A46] to-[#156B63] hover:from-[#093532] hover:to-[#0f4e48] text-white hover:shadow-lg transform hover:translate-y-[-1px] cursor-pointer'
                            }`}
                        >
                            {isBlocked ? 'Login Dinonaktifkan Sementara' : 'Masuk ke Dashboard'}
                        </button>

                        <button
                            type="button"
                            onClick={onBackToHome}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-teal-800 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Kembali ke Halaman Utama
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
