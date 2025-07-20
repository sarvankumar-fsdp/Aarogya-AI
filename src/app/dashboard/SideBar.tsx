"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Stethoscope,
    Bot,
    Flame,
    Shield,
    LogOut,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Emergency', href: '/dashboard#emergency', icon: Shield },
    { label: 'Cure', href: '/dashboard#cure', icon: Stethoscope },
    { label: 'Mental Health', href: '/dashboard#mental-health-travel', icon: Bot },
    { label: 'Physical Health', href: '/dashboard#physical-health', icon: Flame },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-zinc-900 border-r border-gray-700 px-4 py-6 fixed left-0 top-0 z-50">
            <div className="mb-8">
                <p
                    className="text-xl font-bold text-white flex items-center gap-2"
                >
                    <span className="bg-gradient-to-r from-orange-600 via-slate-300 to-green-500 bg-clip-text text-transparent">
                        Aarogya AI
                    </span>
                </p>
            </div>

            <nav className="flex flex-col gap-4">
                {navItems.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === href
                                ? "bg-zinc-800 text-white font-semibold"
                                : "text-gray-400 hover:text-white hover:bg-zinc-800"
                            }`}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-700">
                <SignOutButton>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-white hover:bg-red-600/20 rounded-md transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </SignOutButton>
            </div>
        </aside>
    );
}
