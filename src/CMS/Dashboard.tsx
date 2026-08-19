import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserSession, CmsTab } from './types';
import CmsLogin from './components/CmsLogin';
import CmsSidebar from './components/CmsSidebar';
import { CmsOverviewDashboard } from './CmsOverviewDashboard';
import GuruCrud from './GuruCrud';
import GaleriCrud from './GaleriCrud';
import BeritaCrud from './BeritaCrud';
import UserCrud from './UserCrud';
import Verifikasi from './Verifikasi';
import FasilitasCrud from './FasilitasCrud';
import SambutanKepsekCrud from './SambutanKepsekCrud';
import PengumumanCrud from './PengumumanCrud';
import StatistikCrud from './Statistikcrud';
import PengaturanSekolah from './pengaturan';

import VisiMisiCrud from './VisiMisiCrud';
import SejarahCrud from './SejarahCrud';
import StrukturHalamanUtamaCrud from './StrukturHalamanUtamaCrud';
import HeroCrud from './HeroCrud';
import KontenUtamaCrud from './KontenUtamaCrud';
import PPDBCrud from './PPDBCrud';
import KontakCrud from './KontakCrud';
import MedsosCrud from './MedsosCrud';

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
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <CmsSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onBackToHome={onBackToHome}
                onLogout={handleLogout}
            />

            <main className="flex-grow p-4 sm:p-6 md:p-10 w-full overflow-x-hidden">
                {activeTab === 'dashboard' && (
                    <CmsOverviewDashboard currentUser={user} setActiveTab={setActiveTab} />
                )}
                {activeTab === 'guru' && user.role === 'ADMIN' && <GuruCrud />}
                {activeTab === 'sambutan' && user.role === 'ADMIN' && <SambutanKepsekCrud />}
                {activeTab === 'pengumuman' && user.role === 'ADMIN' && <PengumumanCrud />}
                {activeTab === 'statistik' && user.role === 'ADMIN' && <StatistikCrud currentUser={user} />}
                {activeTab === 'fasilitas' && user.role === 'ADMIN' && <FasilitasCrud currentUser={user} />}
                {activeTab === 'galeri' && <GaleriCrud currentUser={user} />}
                {activeTab === 'berita' && <BeritaCrud currentUser={user} />}
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
            </main>
            <FileValidationModal />
        </div>
    );
}
