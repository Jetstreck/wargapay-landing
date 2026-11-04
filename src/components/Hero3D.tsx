import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import * as THREE from 'three';

const AnimatedSphere = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Sphere args={[1, 100, 200]} scale={2.2} ref={meshRef}>
            <MeshDistortMaterial
                color="#607C3C"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.35}
                metalness={0.25}
                emissive="#3d5225"
                emissiveIntensity={0.2}
            />
        </Sphere>
    );
};

const Hero3D = () => {
    return (
        <section id="overview" className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#F4F6F0]">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.9} />
                    <pointLight position={[10, 10, 10]} intensity={1.8} color="#85a359" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#cbd5e1" />
                    <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
                    <AnimatedSphere />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 text-center px-4 pointer-events-none">
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
            <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply"></div>
        </section>
    );
};

export default Hero3D;