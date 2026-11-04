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
            // Earth axial tilt and gentle rotation
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.16;
            groupRef.current.rotation.x = 0.23; // Realistic ~23.5 degree axial tilt
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
                    <ambientLight intensity={1.4} />
                    <directionalLight position={[8, 6, 6]} intensity={2.8} color="#FFFFFF" />
                    <pointLight position={[-8, -5, -4]} intensity={1.2} color="#cbd5e1" />
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

            {/* Overlay Content */}
            <div className="relative z-10 text-center px-4 pointer-events-none select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter text-[#1A2518] mb-6 drop-shadow-sm">
                        TRANSPARANSI RT. TANPA BATAS.
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <h2 className="text-3xl md:text-5xl font-medium text-[#607C3C] tracking-widest uppercase">
                        SMART WASTE & KEUANGAN WARGA.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-12"
                >
                    <p className="text-[#5A6B52] text-sm tracking-[0.3em] uppercase animate-pulse font-semibold">
                        SCROLL TO EXPLORE
                    </p>
                </motion.div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply" />
        </section>
    );
};

export default Hero3D;
