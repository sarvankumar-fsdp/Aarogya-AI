'use client';

import { motion } from 'framer-motion';
import Flag from './flag.webp';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { link } from 'fs';
import { Link, ArrowRightCircle } from 'lucide-react';

// Define types
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
}

const DynamicBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Particle[]>([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Only run on client
        if (typeof window !== 'undefined') {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            const handleMouseMove = (e: MouseEvent) => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            };

            window.addEventListener('resize', handleResize);
            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, []);

    // Generate particles once
    useEffect(() => {
        if (windowSize.width && windowSize.height) {
            const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
            }));
            setParticles(newParticles);
        }
    }, [windowSize]);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Base black background */}
            <div className="absolute inset-0 bg-black" />

            {/* Dynamic cursor glow */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, 
                        rgba(6, 182, 212, 0.15) 0%, 
                        rgba(147, 51, 234, 0.1) 25%, 
                        rgba(239, 68, 68, 0.05) 50%, 
                        transparent 100%)`,
                    width: '100%',
                    height: '100%',
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating particles */}
            <div className="absolute inset-0">
                {particles.map((particle) => {
                    const distance = Math.sqrt(
                        Math.pow(mousePosition.x - particle.x, 2) +
                        Math.pow(mousePosition.y - particle.y, 2)
                    );
                    const attraction = Math.max(0, 1 - distance / 300);

                    return (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full bg-cyan-400"
                            style={{
                                width: particle.size,
                                height: particle.size,
                                opacity: particle.opacity + attraction * 0.5,
                                boxShadow: `0 0 ${10 + attraction * 20}px rgba(6, 182, 212, ${0.3 + attraction * 0.7})`,
                            }}
                            animate={{
                                x: particle.x + (mousePosition.x - particle.x) * attraction * 0.1,
                                y: particle.y + (mousePosition.y - particle.y) * attraction * 0.1,
                                scale: 1 + attraction * 0.5,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                damping: 20,
                            }}
                        />
                    );
                })}
            </div>

            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Cursor trail */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    left: mousePosition.x - 10,
                    top: mousePosition.y - 10,
                    width: 20,
                    height: 20,
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%)',
                    borderRadius: '50%',
                }}
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0.4, 0.8],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Ripple effect */}
            <motion.div
                className="absolute pointer-events-none border-2 border-cyan-400/50 rounded-full"
                style={{
                    left: mousePosition.x - 50,
                    top: mousePosition.y - 50,
                    width: 100,
                    height: 100,
                }}
                animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
            />
        </div>
    );
};



export default function Hero() {
    return (
        <section className="relative w-full md:px-34 h-[100vh] flex items-center justify-center overflow-hidden" id="Home">
            {/* Dynamic Background */}
            <DynamicBackground />

            {/* Content */}
            <div className="flex items-center justify-center md:justify-between w-full px-4">
                <div className="z-10 md:m-8  text-center md:text-left text-white w-full md:w-auto md:max-w-[50%] md:mr-8">
                    {/* Heading with fade + slide from top */}
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-3xl md:text-6xl  mt-20 md:max-w-[95%] font-semibold mb-4 bg-gradient-to-r from-orange-500 via-gray-300 to-green-500 text-transparent bg-clip-text drop-shadow-md"
                    >The AI for Health.</motion.h1>

                    {/* Paragraph with delay */}
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 1 }}
                        className="text-sm md:text-lg  max-w-[60%] mx-auto md:mx-0 mb-6 drop-shadow-md"
                    >
                        Aarogya is your purpose-built health companion to guide you toward holistic well-being.
                    </motion.p>

                    {/* Buttons with animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 1 }}
                        className="flex flex-row md:flex-row items-center justify-center md:justify-start  gap-4"
                    >
                        <motion.a
                            href="/sign-up"
                        >
                            <button className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-gray-200 text-black text-sm px-4 py-3 rounded-md transition-all duration-300">
                                Get Started <ArrowRightCircle size={18} />
                            </button>
                        </motion.a>

                            <motion.a
                                href='/case-studies'
                                target="_blank"
                        >
                            <button className="cursor-pointer inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-3 rounded-md transition-all duration-300"
                            >
                            View Case Study 

                            </button>
                            </motion.a>
                        
                    </motion.div>
                </div>
                <div className='text-white z-10 pt-20 px-20 hidden md:block'>
                    <Image src={Flag} alt='India' width={900} height={1000} className='rounded-full mx-20'/>
                </div>
            </div>
        </section>
    );
}
