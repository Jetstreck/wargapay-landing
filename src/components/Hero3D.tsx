import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import earthGlbUrl from '../assets/3d/earth.glb?url';

const EarthModel = () => {
    const { scene } = useGLTF(earthGlbUrl);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Earth axial tilt and gentle continuous rotation
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.16;
            groupRef.current.rotation.x = 0.23;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <group ref={groupRef} scale={0.0125} position={[0, 0, 0]}>
                <primitive object={scene} />
            </group>
        </Float>
    );
};

// Preload earth.glb asset
useGLTF.preload(earthGlbUrl);

const Hero3D = () => {
    return (
        <section id="overview" className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#F4F6F0]">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={1.6} />
                    <directionalLight position={[0, 4, 6]} intensity={2.2} color="#FFFFFF" />
                    <directionalLight position={[8, 7, 5]} intensity={2.0} color="#FFFFFF" />
                    <pointLight position={[-8, -4, -3]} intensity={1.2} color="#cbd5e1" />
                    <pointLight position={[2, -4, 3]} intensity={1.0} color="#8FAF64" />

                    <Suspense fallback={null}>
                        <EarthModel />
                    </Suspense>

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* Soft Radial Ambient Aura for Text Legibility Over the Planet */}
            <div
                className="absolute inset-0 z-[5] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(244, 246, 240, 0.4) 0%, rgba(244, 246, 240, 0.1) 50%, transparent 80%)'
                }}
            />

            {/* Overlay Content with Enhanced Contrast Halo */}
            <div className="relative z-10 text-center px-4 pointer-events-none select-none max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#111C0F] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.95)] drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)]"
                    >
                        TRANSPARANSI RT. TANPA BATAS.
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                >
                    <h2
                        className="text-2xl sm:text-3xl md:text-5xl font-black text-[#263D12] tracking-widest uppercase drop-shadow-[0_0_24px_rgba(255,255,255,0.95)] drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]"
                    >
                        SMART WASTE & KEUANGAN WARGA.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-12"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#D5E1CD] shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-[#3E5624] text-xs tracking-[0.25em] uppercase font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#607C3C] animate-pulse" />
                        <span>SCROLL TO EXPLORE</span>
                    </div>
                </motion.div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply" />
        </section>
    );
};

export default Hero3D;
