import { useEffect, useState } from 'react';

import CustomCursor from './components/CustomCursor';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResidentDashboard from './components/ResidentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getStoredUser, getStoredToken, clearSession, User } from './services/api';

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const token = getStoredToken();
        const user = getStoredUser();
        return token && user ? user : null;
    });

    const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'admin'>(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            const token = getStoredToken();
            const user = getStoredUser();
            const isAuthenticated = !!(token && user);

            if (hash === '#admin') {
                if (!isAuthenticated) return 'login';
                if (user?.role !== 'admin') return 'dashboard';
                return 'admin';
            }
            if (hash === '#dashboard') {
                if (!isAuthenticated) return 'login';
                return 'dashboard';
            }
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
            const token = getStoredToken();
            const user = getStoredUser();
            const isAuthenticated = !!(token && user);

            if (hash === '#admin') {
                if (!isAuthenticated) {
                    setView('login');
                    window.location.hash = '#login';
                    return;
                }
                if (user?.role !== 'admin') {
                    setView('dashboard');
                    window.location.hash = '#dashboard';
                    return;
                }
                setCurrentUser(user);
                setView('admin');
            } else if (hash === '#dashboard') {
                if (!isAuthenticated) {
                    setView('login');
                    window.location.hash = '#login';
                    return;
                }
                setCurrentUser(user);
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

    const handleLogout = () => {
        clearSession();
        setCurrentUser(null);
        goToLanding();
    };

    return (
        <main className="w-full min-h-screen bg-[#F0F2EB] text-[#192414] selection:bg-[#607C3C] selection:text-white relative">
            <CustomCursor />

            {/* View 1: Admin Dashboard (Pengurus RT) */}
            {view === 'admin' && currentUser && currentUser.role === 'admin' ? (
                <AdminDashboard
                    key={currentUser?.email || 'admin'}
                    user={currentUser}
                    onLogout={handleLogout}
                    onBackToHome={goToLanding}
                    onSwitchToResident={goToDashboard}
                />
            ) : view === 'dashboard' && currentUser ? (
                /* View 2: Resident Dashboard (Warga) */
                <ResidentDashboard
                    key={currentUser?.email || 'resident'}
                    user={currentUser}
                    onLogout={handleLogout}
                    onBackToHome={goToLanding}
                />
            ) : view === 'login' || ((view === 'admin' || view === 'dashboard') && !currentUser) ? (
                /* View 3: Dedicated Login Page */
                <LoginPage
                    onBackToHome={goToLanding}
                    onLoginSuccess={(role) => {
                        const user = getStoredUser();
                        setCurrentUser(user);
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
