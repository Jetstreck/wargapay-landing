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
        <section id="overview" className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#F0F2EB]">
            {/* Background Decorative Embedded Text Behind Earth (Layer 0) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="flex whitespace-nowrap"
                >
                    <span className="text-[13vw] sm:text-[15vw] font-black tracking-tighter text-white uppercase whitespace-nowrap leading-none select-none drop-shadow-[0_8px_30px_rgba(96,124,60,0.06)]">
                        WARGAPAY WARGAPAY
                    </span>
                </motion.div>
            </div>

            {/* 3D Scene (Layer 2 - Earth renders directly on top of the white decorative text) */}
            <div className="absolute inset-0 z-[2]">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
                    <ambientLight intensity={0.9} />
                    <directionalLight position={[6, 5, 5]} intensity={1.7} color="#FFFFFF" />
                    <directionalLight position={[-4, 2, 4]} intensity={0.6} color="#E8F0E3" />

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

            {/* Front Overlay Content (Layer 10) */}
            <div className="relative z-10 text-center px-4 pointer-events-none select-none max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#192414] mb-6 drop-shadow-sm"
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
                        className="text-2xl sm:text-3xl md:text-5xl font-black text-[#607C3C] tracking-widest uppercase drop-shadow-sm"
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
