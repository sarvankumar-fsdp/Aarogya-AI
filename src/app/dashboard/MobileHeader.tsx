'use client';

import { useState} from 'react';
import {
    Menu, X, Home, Stethoscope, Bot, Flame, Shield, LogOut
} from 'lucide-react';
import { UserButton, SignOutButton } from '@clerk/nextjs';
import SearchBar from './SearchBar';
import Image from 'next/image';
import Logo from './Logo.png';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileHeader({ user, setSearchTerm }: any) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Emergency', href: '/dashboard#emergency', icon: Shield },
        { label: 'Cure', href: '/dashboard#cure', icon: Stethoscope },
        { label: 'Mental Health', href: '/dashboard#mental-health-travel', icon: Bot },
        { label: 'Physical Health', href: '/dashboard#physical-health', icon: Flame },
    ];

    const handleNavClick = (href: string) => {
        setSidebarOpen(false);

        if (href.includes('#')) {
            const [basePath, hash] = href.split('#');

            // Already on the same page
            if (pathname === basePath || pathname === `${basePath}/`) {
                const el = document.getElementById(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Retry scroll after short delay (in case not mounted yet)
                    setTimeout(() => {
                        const retryEl = document.getElementById(hash);
                        if (retryEl) {
                            retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 500);
                }
            } else {
                // Navigate to route; scroll handled by dashboard useEffect
                router.push(href);
            }
        } else {
            router.push(href);
        }
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="block md:hidden px-4 py-3 bg-black z-30 relative">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-white focus:outline-none"
                        >
                            <Menu size={28} />
                        </button>
                        <Image src={Logo} alt="Logo" width={30} height={30} />
                        <p className="text-lg font-semibold">
                            Aarogya AI -{" "}
                            <span className="bg-gradient-to-b from-orange-700 via-slate-200 to-green-600 text-transparent bg-clip-text">
                                भारत
                            </span>
                        </p>
                    </div>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'w-[44px] h-[44px] rounded-[10px] border border-[#4CAF50] shadow-md',
                                avatarImage: 'rounded-[10px] object-cover',
                            },
                        }}
                    />
                </div>

                <div className="mt-4 mx-2">
                    <SearchBar onSearch={setSearchTerm} />
                </div>

                <p className="text-lg font-bold mt-3 mx-2">
                    Welcome{" "}<br></br>
                    <span className="bg-gradient-to-r from-orange-600 via-slate-200 to-green-600 bg-clip-text text-transparent">
                        {user?.firstName} {user?.lastName}&nbsp;
                    </span>
                    !
                </p>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 z-50 bg-zinc-900 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <p className="text-lg font-bold text-white">Menu</p>
                    <button onClick={() => setSidebarOpen(false)} className="text-white">
                        <X size={28} />
                    </button>
                </div>

                <nav className="flex flex-col gap-3 p-4">
                    {navItems.map(({ label, href, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => handleNavClick(href)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left ${pathname === href.split('#')[0]
                                ? 'bg-zinc-800 text-white font-semibold'
                                : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t border-gray-700">
                    <SignOutButton>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-white hover:bg-red-600/20 rounded-md transition-colors">
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </SignOutButton>
                </div>
            </div>

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
