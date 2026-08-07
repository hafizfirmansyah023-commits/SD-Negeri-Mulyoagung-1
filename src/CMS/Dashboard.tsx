import React, { useState, useEffect } from 'react';
import { UserSession, CmsTab } from './types';
import CmsLogin from './components/CmsLogin';
import CmsSidebar from './components/CmsSidebar';
import GuruCrud from './GuruCrud';
import GaleriCrud from './GaleriCrud';
import BeritaCrud from './BeritaCrud';
import UserCrud from './UserCrud';
import Verifikasi from './Verifikasi';
import FasilitasCrud from './FasilitasCrud';
import SambutanKepsekCrud from './SambutanKepsekCrud';
import PengumumanCrud from './PengumumanCrud';

interface DashboardProps {
    onBackToHome: () => void;
}

export default function Dashboard({ onBackToHome }: DashboardProps) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [activeTab, setActiveTab] = useState<CmsTab>('guru');

    useEffect(() => {
        const savedUser = localStorage.getItem('cms_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('cms_user');
            }
        }
    }, []);

    const handleLoginSuccess = (loggedInUser: UserSession) => {
        setUser(loggedInUser);
        localStorage.setItem('cms_user', JSON.stringify(loggedInUser));
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

    if (!user) {
        return <CmsLogin onLoginSuccess={handleLoginSuccess} onBackToHome={onBackToHome} />;
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

            <main className="flex-grow p-6 md:p-10 max-w-7xl">
                {activeTab === 'guru' && <GuruCrud />}
                {activeTab === 'sambutan' && <SambutanKepsekCrud />}
                {activeTab === 'pengumuman' && <PengumumanCrud />}
                {activeTab === 'fasilitas' && <FasilitasCrud currentUser={user} />}
                {activeTab === 'galeri' && <GaleriCrud currentUser={user} />}
                {activeTab === 'berita' && <BeritaCrud currentUser={user} />}
                {activeTab === 'verifikasi' && user.role === 'ADMIN' && <Verifikasi />}
                {activeTab === 'user' && (
                    <UserCrud currentUser={user} onUpdateCurrentUser={handleUpdateUser} />
                )}
            </main>
        </div>
    );
}
