import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import AboutSection from './components/AboutSection';
import ProjectsHorizontal from './components/ProjectsHorizontal';
import ExperimentLab from './components/ExperimentLab';
import ContactSection from './components/ContactSection';
import LoginPage from './components/LoginPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
    const lenisRef = useRef<Lenis | null>(null);
    const [view, setView] = useState<'landing' | 'login'>('landing');

    useEffect(() => {
        // Sync URL hash with view state
        if (window.location.hash === '#login') {
            setView('login');
        }

        const handleHashChange = () => {
            if (window.location.hash === '#login') {
                setView('login');
            } else if (window.location.hash === '' || window.location.hash === '#overview') {
                setView('landing');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            syncTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Synchronize Lenis scroll events with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Bind Lenis animation frame loop to GSAP's internal ticker
        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
        };
    }, []);

    // Pause/resume Lenis smoothly when login overlay is opened/closed
    useEffect(() => {
        if (lenisRef.current) {
            if (view === 'login') {
                lenisRef.current.stop();
            } else {
                lenisRef.current.start();
            }
        }
    }, [view]);

    const handleNavigate = (id: string) => {
        const target = document.getElementById(id);
        if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target);
        } else if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const goToLogin = () => {
        setView('login');
        window.location.hash = '#login';
    };

    const goToLanding = () => {
        setView('landing');
        if (window.location.hash === '#login') {
            window.location.hash = '';
        }
    };

    return (
        <main className="w-full min-h-screen bg-[#F4F6F0] text-[#1A2518] overflow-hidden selection:bg-[#607C3C] selection:text-white relative">
            <CustomCursor />
            <Navbar onNavigate={handleNavigate} onLoginClick={goToLogin} />
            <Hero3D />
            <AboutSection />
            <ProjectsHorizontal />
            <ExperimentLab />
            <ContactSection />

            {/* Seamless 50/50 Split-Screen Login Page (Always in viewport) */}
            <AnimatePresence>
                {view === 'login' && (
                    <LoginPage onBackToHome={goToLanding} />
                )}
            </AnimatePresence>
        </main>
    );
}

export default App;
