import { useEffect, useState } from 'react';

import CustomCursor from './components/CustomCursor';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResidentDashboard from './components/ResidentDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
    const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'admin'>(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash === '#admin') return 'admin';
            if (hash === '#dashboard') return 'dashboard';
            if (hash === '#login') return 'login';
        }
        return 'landing';
    });

    const resetViewport = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            document.documentElement.style.removeProperty('overflow');
            document.body.style.removeProperty('overflow');
        }
    };

    useEffect(() => {
        const handleHashChange = () => {
            resetViewport();
            const hash = window.location.hash;
            if (hash === '#admin') {
                setView('admin');
            } else if (hash === '#dashboard') {
                setView('dashboard');
            } else if (hash === '#login') {
                setView('login');
            } else if (
                hash === '' ||
                hash === '#overview' ||
                hash === '#features' ||
                hash === '#ecosystem' ||
                hash === '#contact'
            ) {
                setView('landing');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const goToLanding = () => {
        resetViewport();
        setView('landing');
        if (
            window.location.hash === '#login' ||
            window.location.hash === '#dashboard' ||
            window.location.hash === '#admin'
        ) {
            window.location.hash = '';
        }
    };

    const goToLogin = () => {
        resetViewport();
        setView('login');
        window.location.hash = '#login';
    };

    const goToDashboard = () => {
        resetViewport();
        setView('dashboard');
        window.location.hash = '#dashboard';
    };

    const goToAdmin = () => {
        resetViewport();
        setView('admin');
        window.location.hash = '#admin';
    };

    return (
        <main className="w-full min-h-screen bg-[#F0F2EB] text-[#192414] selection:bg-[#607C3C] selection:text-white relative">
            <CustomCursor />

            {/* View 1: Admin Dashboard (Pengurus RT) */}
            {view === 'admin' ? (
                <AdminDashboard
                    onLogout={goToLanding}
                    onBackToHome={goToLanding}
                    onSwitchToResident={goToDashboard}
                />
            ) : view === 'dashboard' ? (
                /* View 2: Resident Dashboard (Warga) */
                <ResidentDashboard
                    onLogout={goToLanding}
                    onBackToHome={goToLanding}
                />
            ) : view === 'login' ? (
                /* View 3: Dedicated Login Page */
                <LoginPage
                    onBackToHome={goToLanding}
                    onLoginSuccess={(role) => {
                        if (role === 'admin') {
                            goToAdmin();
                        } else {
                            goToDashboard();
                        }
                    }}
                />
            ) : (
                /* View 4: Landing Page */
                <LandingPage onLoginClick={goToLogin} />
            )}
        </main>
    );
}

export default App;
