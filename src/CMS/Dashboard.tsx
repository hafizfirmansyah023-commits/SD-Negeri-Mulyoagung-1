import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserSession, CmsTab } from './types';
import CmsLogin from './components/CmsLogin';
import CmsSidebar from './components/CmsSidebar';
import { CmsOverviewDashboard } from './CmsOverviewDashboard';

// Lazy load heavy CRUD modules for CMS
const GuruCrud = lazy(() => import('./GuruCrud'));
const GaleriCrud = lazy(() => import('./GaleriCrud'));
const BeritaCrud = lazy(() => import('./BeritaCrud'));
const ModulPembelajaranCrud = lazy(() => import('./ModulPembelajaranCrud'));
const AkademikCrud = lazy(() => import('./AkademikCrud'));
const UserCrud = lazy(() => import('./UserCrud'));
const Verifikasi = lazy(() => import('./Verifikasi'));
const FasilitasCrud = lazy(() => import('./FasilitasCrud'));
const SambutanKepsekCrud = lazy(() => import('./SambutanKepsekCrud'));
const PengumumanCrud = lazy(() => import('./PengumumanCrud'));
const StatistikCrud = lazy(() => import('./Statistikcrud'));
const VisiMisiCrud = lazy(() => import('./VisiMisiCrud'));
const SejarahCrud = lazy(() => import('./SejarahCrud'));
const StrukturHalamanUtamaCrud = lazy(() => import('./StrukturHalamanUtamaCrud'));
const HeroCrud = lazy(() => import('./HeroCrud'));
const KontenUtamaCrud = lazy(() => import('./KontenUtamaCrud'));
const PPDBCrud = lazy(() => import('./PPDBCrud'));
const KontakCrud = lazy(() => import('./KontakCrud'));
const MedsosCrud = lazy(() => import('./MedsosCrud'));

import { FileValidationModal } from './components/FileValidationModal';

interface DashboardProps {
    onBackToHome: () => void;
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const activeTab = (location.pathname.split('/')[2] || 'dashboard') as CmsTab;

    const setActiveTab = (tab: CmsTab) => {
        navigate(`/cms/${tab}`);
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('cms_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                const currentTab = location.pathname.split('/')[2] || '';
                if (parsed.role === 'TIM') {
                    if (
                        currentTab !== 'dashboard' &&
                        currentTab !== 'galeri' &&
                        currentTab !== 'berita' &&
                        currentTab !== 'user'
                    ) {
                        navigate('/cms/dashboard', { replace: true });
                    }
                } else if (parsed.role === 'GURU') {
                    if (
                        currentTab !== 'dashboard' &&
                        currentTab !== 'modul' &&
                        currentTab !== 'user'
                    ) {
                        navigate('/cms/dashboard', { replace: true });
                    }
                } else if (parsed.role === 'ADMIN') {
                    if (!currentTab || currentTab === '' || currentTab === 'pengaturan') {
                        navigate('/cms/dashboard', { replace: true });
                    }
                }
            } catch (e) {
                localStorage.removeItem('cms_user');
            }
        }
    }, [location.pathname, navigate]);

    const handleLoginSuccess = (loggedInUser: UserSession) => {
        setUser(loggedInUser);
        localStorage.setItem('cms_user', JSON.stringify(loggedInUser));
        navigate('/cms/dashboard', { replace: true });
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('cms_user');
        navigate('/cms', { replace: true });
    };

    const handleUpdateUser = (updatedUser: UserSession) => {
        setUser(updatedUser);
        localStorage.setItem('cms_user', JSON.stringify(updatedUser));
    };

    if (!user) {
        return (
            <>
                <CmsLogin onLoginSuccess={handleLoginSuccess} onBackToHome={onBackToHome} />
                <FileValidationModal />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative w-full overflow-x-clip">
            <CmsSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBackToHome={onBackToHome}
                onLogout={handleLogout}
            />

            <main className="md:ml-64 p-3.5 sm:p-6 md:p-8 min-h-screen max-w-full overflow-x-clip">
                <Suspense fallback={<div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div></div>}>
                {activeTab === 'dashboard' && (
                    <CmsOverviewDashboard currentUser={user} setActiveTab={setActiveTab} />
                )}
                {activeTab === 'guru' && user.role === 'ADMIN' && <GuruCrud />}
                {activeTab === 'sambutan' && user.role === 'ADMIN' && <SambutanKepsekCrud />}
                {activeTab === 'pengumuman' && user.role === 'ADMIN' && <PengumumanCrud />}
                {activeTab === 'statistik' && user.role === 'ADMIN' && <StatistikCrud currentUser={user} />}
                {activeTab === 'fasilitas' && user.role === 'ADMIN' && <FasilitasCrud currentUser={user} />}
                {activeTab === 'galeri' && user.role !== 'GURU' && <GaleriCrud currentUser={user} />}
                {activeTab === 'berita' && user.role !== 'GURU' && <BeritaCrud currentUser={user} />}
                {activeTab === 'modul' && user.role !== 'TIM' && <ModulPembelajaranCrud currentUser={user} />}
                {activeTab === 'akademik' && user.role === 'ADMIN' && <AkademikCrud currentUser={user} />}
                {activeTab === 'verifikasi' && user.role === 'ADMIN' && <Verifikasi />}
                {activeTab === 'user' && (
                    <UserCrud currentUser={user} onUpdateCurrentUser={handleUpdateUser} />
                )}
                {activeTab === 'pengaturan' && user.role === 'ADMIN' && <StrukturHalamanUtamaCrud />}
                {activeTab === 'visimisi' && user.role === 'ADMIN' && <VisiMisiCrud />}
                {activeTab === 'sejarah' && user.role === 'ADMIN' && <SejarahCrud />}
                {activeTab === 'strukturorganisasi' && user.role === 'ADMIN' && <StrukturHalamanUtamaCrud />}
                {activeTab === 'hero' && user.role === 'ADMIN' && <HeroCrud />}
                {activeTab === 'kontenutama' && user.role === 'ADMIN' && <KontenUtamaCrud />}
                {activeTab === 'ppdb' && user.role === 'ADMIN' && <PPDBCrud />}
                {activeTab === 'kontak' && user.role === 'ADMIN' && <KontakCrud />}
                {activeTab === 'medsos' && user.role === 'ADMIN' && <MedsosCrud />}
                </Suspense>
            </main>
            <FileValidationModal />
        </div>
    );
}
