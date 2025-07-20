'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import SearchBar from './SearchBar';
import Logo from './Logo.png';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import SleepChart from './SleepChart';
import WeatherCard from './WeatherCard';
import VoiceAssistant from './VoiceAssistant';
import Sidebar from './SideBar';
import MobileHeader from './MobileHeader';
import EmergencyList from './EmergencyList';
import { CircleCheck } from 'lucide-react';
import WaterChart from './WaterChart';

export default function HealthDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingButton, setLoadingButton] = useState<string | null>(null);
    const [dailyQuote, setDailyQuote] = useState('');
    const { isSignedIn, user, isLoaded } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 👉 Scroll to section if #hash present in URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                const el = document.querySelector(hash);
                if (el) {
                    setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 400); // delay for hydration
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch('/api/quote');
                const data = await res.json();
                if (data.quote && data.author) {
                    setDailyQuote(`"${data.quote}" — ${data.author}`);
                }
            } catch (error) {
                console.error('Failed to load quote of the day:', error);
            }
        };
        fetchQuote();
    }, []);

    if (!isLoaded) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-screen" suppressHydrationWarning>
                <div className="h-16 w-16 border-4 border-t-4 border-t-orange-500 border-gray-200 rounded-full animate-spin" />
            </main>
        );
    }

    if (!isSignedIn) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-screen text-lg" suppressHydrationWarning>
                Sign in to view this page
            </main>
        );
    }

    const featureSections = [
        {
            title: 'Emergency',
            items: [
                {
                    name: 'PharmaUse Find',
                    description: 'Learn how to use medicines properly during emergency times.',
                    route: '/medicine-usage',
                    buttonText: 'Check Usage',
                    buttonColor: 'bg-[#B8860B] hover:bg-[#d1a51d]',
                    bgColor: 'bg-[#3a2f17]',
                    borderColor: 'border-[#B8860B]',
                },
                {
                    name: 'Emergency Contacts',
                    description: 'Contact your relatives during emergencies through personalized Whatsapp messages.',
                    route: '/emergency-contact',
                    buttonText: 'Add/View Contact',
                    buttonColor: 'bg-[#A83260] hover:bg-[#cc3a6c]',
                    bgColor: 'bg-[#301c24]',
                    borderColor: 'border-[#A83260]',
                },
                {
                    name: 'First Aid Guide',
                    description: 'Instantly access essential first aid instructions, and save them in PDF for future use.',
                    route: '/first-aid-guide',
                    buttonText: 'Open Guide',
                    buttonColor: 'bg-[#C56A1D] hover:bg-[#e17e2a]',
                    bgColor: 'bg-[#3a250e]',
                    borderColor: 'border-[#C56A1D]',
                },
            ],
        },
        {
            title: 'Cure',
            items: [
                {
                    name: 'RemediAI',
                    description: 'Get AI based OTC medications for the symptoms you provide.',
                    route: '/medication-recommender',
                    buttonText: 'Try AI Recommender',
                    buttonColor: 'bg-[#1E4F91] hover:bg-[#2a63ad]',
                    bgColor: 'bg-[#102a43]',
                    borderColor: 'border-[#1E4F91]',
                },
                {
                    name: 'TeleCure',
                    description: 'Connect with doctors via secure video call by just sharing a link.',
                    route: '/video-consultation',
                    buttonText: 'Start Call',
                    buttonColor: 'bg-[#5B3B8B] hover:bg-[#6f4eaa]',
                    bgColor: 'bg-[#2e1f47]',
                    borderColor: 'border-[#5B3B8B]',
                },
                {
                    name: 'PxVault',
                    description: 'Upload and access prescriptions securely, access anytime you need them.',
                    route: '/prescription-vault',
                    buttonText: 'Store Prescription',
                    buttonColor: 'bg-[#475569] hover:bg-[#64748b]',
                    bgColor: 'bg-[#1b1f24]',
                    borderColor: 'border-[#475569]',
                },
                {
                    name: 'LabLens',
                    description: 'Learn about Lab test measures and get Advices using our AI chatbot.',
                    route: '/lab-test-chat',
                    buttonText: 'Start Chat',
                    buttonColor: 'bg-[#AD7B3D] hover:bg-[#c48c4e]',
                    bgColor: 'bg-[#3d2e1e]',
                    borderColor: 'border-[#AD7B3D]',
                },
                {
                    name: 'AnaVison',
                    description: 'Predict the Chances of Anaemia using Nail Images.',
                    route: '/anaemia-vision',
                    buttonText: 'Check Now',
                    buttonColor: 'bg-[#B8860B] hover:bg-[#d1a52f]',
                    bgColor: 'bg-[#3a2f30]',
                    borderColor: 'border-[#B8860B]',
                },
                
            ],
        },
        {
            title: 'Mental Health & Travel',
            items: [
                {
                    name: 'AshaCare',
                    description: 'Talk to a caring chatbot trained in wellness, and feel relaxed.',
                    route: '/mental-health-chatbot',
                    buttonText: 'Talk Now',
                    buttonColor: 'bg-[#2C665D] hover:bg-[#3d897f]',
                    bgColor: 'bg-[#1d2c24]',
                    borderColor: 'border-[#2C665D]',
                },
                {
                    name: 'Meditation Planner',
                    description: 'Guided meditations for calmness, stress and sleep.',
                    route: '/meditation',
                    buttonText: 'Start Meditation',
                    buttonColor: 'bg-[#4338CA] hover:bg-[#5850ec]',
                    bgColor: 'bg-[#2a1f4d]',
                    borderColor: 'border-[#4338CA]',
                },
                {
                    name: 'Travel Essentials',
                    description: 'Get a personalized travel checklist based on your destination.',
                    route: '/check-list',
                    buttonText: 'View Checklist',
                    buttonColor: 'bg-[#4A772F] hover:bg-[#5d9441]',
                    bgColor: 'bg-[#223b1d]',
                    borderColor: 'border-[#4A772F]',
                },
            ],
        },
        {
            title: 'Physical Health',
            items: [
                {
                    name: 'AquaTrack',
                    description: 'Log your water intake by just saying it.',
                    route: '/aqua-track',
                    buttonText: 'Hydrate Now',
                    buttonColor: 'bg-[#0E7490] hover:bg-[#11a1c0]',
                    bgColor: 'bg-[#113848]',
                    borderColor: 'border-[#0E7490]',
                },
                {
                    name: 'FlexFlow',
                    description: 'Follow step-by-step yoga routines.',
                    route: '/yoga',
                    buttonText: 'Start Yoga',
                    buttonColor: 'bg-[#A55D2A] hover:bg-[#c8763d]',
                    bgColor: 'bg-[#3d2a18]',
                    borderColor: 'border-[#A55D2A]',
                },
                {
                    name: 'DermaScan',
                    description: 'Upload photo and get skin health insights.',
                    route: '/skin-analyzer',
                    buttonText: 'Analyze Skin',
                    buttonColor: 'bg-[#a8326e] hover:bg-[#cc4085]',
                    bgColor: 'bg-[#412434]',
                    borderColor: 'border-[#a8326e]',
                },
                {
                    name: 'NutriGuide',
                    description: 'Get diet recommendations for health.',
                    route: '/diet-recommender',
                    buttonText: 'Diet Recommender',
                    buttonColor: 'bg-[#2E8B8B] hover:bg-[#3ea8a8]',
                    bgColor: 'bg-[#0f2e2e]',
                    borderColor: 'border-[#2E8B8B]',
                },
                {
                    name: 'EatIQ',
                    description: 'Track daily food calories and nutrition.',
                    route: '/calorie-counter',
                    buttonText: 'Count Calories',
                    buttonColor: 'bg-[#2E8B57] hover:bg-[#3fa972]',
                    bgColor: 'bg-[#1e3b2c]',
                    borderColor: 'border-[#2E8B57]',
                },
                {
                    name: 'NapWise',
                    description: 'Analyze sleep trends and get insights.',
                    route: '/sleep-analyzer',
                    buttonText: 'Analyze Sleep',
                    buttonColor: 'bg-[#1E3A8A] hover:bg-[#2f4ec3]',
                    bgColor: 'bg-[#1f2f43]',
                    borderColor: 'border-[#1E3A8A]',
                },
            ],
        },
    ];
      

    const filteredSections = featureSections
        .map((section) => {
            const filteredItems = section.items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return { ...section, items: filteredItems };
        })
        .filter((section) => section.items.length > 0);

    return (
        <div className="min-h-screen bg-black text-white relative">
            <VoiceAssistant />
            <MobileHeader
                user={user}
                setSearchTerm={setSearchTerm}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="hidden md:block fixed top-0 left-0 h-full w-64 z-30">
                <Sidebar />
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <section className="p-0 md:ml-64 md:mt-4 md:p-2 transition-all duration-300 ease-in-out" suppressHydrationWarning>
                <div className="px-6 hidden md:flex items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-lg font-bold">
                            Welcome{' '}
                            <span className="bg-gradient-to-r from-orange-600 via-slate-200 to-green-600 bg-clip-text text-transparent">
                                {user.firstName} {user.lastName}&nbsp;
                            </span>
                            !
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SearchBar onSearch={setSearchTerm} />
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: 'w-[44px] h-[44px] rounded-[10px] border border-[#4CAF50] shadow-md',
                                    avatarImage: 'rounded-[10px] object-cover',
                                },
                            }}
                        />
                    </div>
                </div>

                <motion.div
                    className="m-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <Card className="flex flex-col border-1 border-gray-600 items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-gray-100 shadow-lg rounded-xl">
                        <motion.div
                            className="text-center italic text-md sm:text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.5 }}
                        >
                            <Typewriter
                                key={dailyQuote}
                                onInit={(typewriter) => {
                                    typewriter.typeString(dailyQuote).start();
                                }}
                                options={{ loop: false, delay: 35, cursor: '|' }}
                            />
                        </motion.div>
                    </Card>
                </motion.div>

                {searchTerm.trim() === '' && (
                    <div className="m-4  flex flex-col md:grid md:grid-cols-2 gap-4">
                        {/* Sleep Chart full width on mobile */}
                        <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-4 h-auto md:h-[400px]">
                            <div className='bg-zinc-900 border overflow-y-scroll border-zinc-600 rounded-lg row-span-1'>
                                <EmergencyList refresh={false} />
                            </div>
                            <div className='bg-zinc-900 border overflow-y-clip border-zinc-600 rounded-lg row-span-2'>
                                <WaterChart />
                            </div>
                            <WeatherCard />
                        </div>
                        <div className="w-full">
                            <SleepChart />
                        </div>
                    </div>
                )}


                {filteredSections.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8 text-sm">No features match your search.</p>
                ) : (
                    filteredSections.map((section, i) => (
                        <div key={i}>
                            <p
                                id={section.title
                                    .toLowerCase()
                                    .replace(/ & | and /g, '-')
                                    .replace(/[^a-z0-9-]+/g, '-')
                                    .replace(/-+/g, '-')
                                    .replace(/^-|-$/g, '')}
                                className="text-xl text-white pt-8 mx-4 font-bold"
                            >
                                {section.title}
                            </p>
                            <div className="m-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {section.items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                    >
                                        <Card className={`px-6 py-4 flex flex-col justify-between space-y-2 ${item.bgColor} ${item.borderColor} border`}>
                                            <div>
                                                <h3 className="text-md font-semibold text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    setLoadingButton(item.name);
                                                    window.location.href = item.route;
                                                }}
                                                disabled={loadingButton === item.name}
                                                className={`w-full cursor-pointer text-white flex items-center justify-center gap-2 ${item.buttonColor}`}
                                            >
                                                {loadingButton === item.name ? (
                                                    <div className="h-4 w-4 border-2 border-t-2 border-white rounded-full animate-spin" />
                                                ) : (
                                                    item.buttonText
                                                )}
                                            </Button>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                <div className="mt-16 w-full border-t border-gray-700 py-6 text-center text-gray-400 text-xs">
                    <p>© {new Date().getFullYear()} Aarogya AI — Serving Health, the Indian Way.</p>
                </div>
            </section>
        </div>
    );
}
