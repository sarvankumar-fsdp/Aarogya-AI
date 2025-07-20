'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Activity, HelpCircle, Shield, User } from "lucide-react";

const navItems = [
    { id: 'Home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'Services', label: 'Services', icon: <Activity className="w-4 h-4" /> },
    { id: 'Faq', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'About', label: 'About', icon: <Shield className="w-4 h-4" /> },
];

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('Home');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;
        window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        setActiveSection(id);
        setIsOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-4 py-2 rounded-2xl transition-all duration-500 
          ${scrolled ? 'bg-black/70 backdrop-blur-md border border-white/10 shadow-xl' : 'bg-black/50 backdrop-blur-sm border border-white/5'}`}
            >
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        className="text-white font-extrabold text-lg sm:text-xl tracking-wide"
                        whileHover={{ scale: 1.05 }}
                    >
                        Aarogya <span className="text-green-300">AI</span>
                    </motion.div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex gap-4">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={handleScroll(item.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 
                ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                                whileHover={{ scale: 1.03 }}
                            >
                                {item.icon}
                                {item.label}
                            </motion.a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <a
                            href="/sign-in"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:shadow-lg text-sm"
                        >
                            <User className="w-4 h-4" />
                            Login
                        </a>

                        {/* Mobile Menu Icon */}
                        <button
                            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-40 bg-black/90 border border-white/10 rounded-2xl p-4 backdrop-blur-lg"
                        >
                            <div className="space-y-3">
                                {navItems.map((item) => (
                                    <motion.a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={handleScroll(item.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </motion.a>
                                ))}

                                <a
                                    href="/sign-in"
                                    className="block w-full text-center px-4 py-3 mt-2 bg-white text-black rounded-xl text-sm font-semibold"
                                >
                                    <User className="inline w-4 h-4 mr-1" />
                                    Login
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
