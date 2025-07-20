'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-gray-950 to-black text-gray-300 py-12 px-6 md:px-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            {/* Top Border with Glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Left Section - Brand */}
                    <div className="flex flex-col items-center lg:items-start gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-white font-bold text-lg">Aarogya.me</span>
                        </div>
                        <p className="text-sm text-gray-400 text-center lg:text-left max-w-xs">
                            Empowering healthier communities through technology
                        </p>
                    </div>

                    {/* Right Section - Links */}
                    <div className="flex flex-col items-center lg:items-end gap-6">
                        {/* Navigation Links */}
                        <nav className="flex flex-wrap items-center justify-center gap-1">
                            <Link
                                href="/privacy-policy"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-conditions"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                Terms & Conditions
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 backdrop-blur-sm"
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Special Badge */}
                        <Link
                            href="https://www.linkedin.com/in/nagarampalli-sarvan-kumar/"
                            className="group relative px-6 py-3 bg-gradient-to-r from-orange-600/20 via-gray-800/20 to-green-600/20 backdrop-blur-sm border border-orange-500/20 rounded-xl hover:border-orange-500/40 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative font-semibold text-sm bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                                About Me!
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-900/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Aarogya.me — All rights reserved.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Made with</span>
                            <div className="animate-pulse">❤️</div>
                            <span className="text-xs text-gray-500">in India</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}