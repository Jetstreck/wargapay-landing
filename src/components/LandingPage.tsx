import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './Navbar';
import Hero3D from './Hero3D';
import AboutSection from './AboutSection';
import ProjectsHorizontal from './ProjectsHorizontal';
import ExperimentLab from './ExperimentLab';
import ContactSection from './ContactSection';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
    onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const lenisRef = useRef<Lenis | null>(null);

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

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(tickerCallback);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            lenis.destroy();
            lenisRef.current = null;
            // Clean up any overflow lock set by Lenis on html/body
            document.documentElement.style.removeProperty('overflow');
            document.body.style.removeProperty('overflow');
        };
    }, []);

    const handleNavigate = (id: string) => {
        const target = document.getElementById(id);
        if (target && lenisRef.current) {
            lenisRef.current.scrollTo(target);
        } else if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative">
            <Navbar onNavigate={handleNavigate} onLoginClick={onLoginClick} />
            <Hero3D />
            <AboutSection />
            <ProjectsHorizontal />
            <ExperimentLab />
            <ContactSection />
        </div>
    );
};

export default LandingPage;

