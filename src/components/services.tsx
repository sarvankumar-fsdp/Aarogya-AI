'use client';

import {
    Pill,
    Video,
    Bot,
    Locate,
    Phone,
    BookOpen,
    MessageCircle,
    Shield,
    FileText,
    Clipboard,
    Brain,
    MapPin,
    Activity,
    Camera,
    Apple,
    Calculator,
    Moon,
    Droplets
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

type Service = {
    title: string;
    description: string;
    icon: any;
    size: 'small' | 'medium' | 'large';
    featured?: boolean;
    isComplete?: boolean;
    bgColor?: string;
    iconColor?: string;
};

const services: Service[] = [
    {
        title: "RemediAI",
        description: "Get personalized medication suggestions based on your symptoms.",
        icon: Pill,
        size: 'medium',
        featured: false,
        isComplete: false,
        bgColor: 'from-blue-900/20 via-blue-800/10 to-blue-700/20',
        iconColor: 'from-blue-500 to-blue-400'
    },
    {
        title: "AshaCare",
        description: "24/7 supportive AI companion for mental wellness.",
        icon: Brain,
        size: 'medium',
        featured: false,
        isComplete: false,
        bgColor: 'from-teal-900/20 via-teal-800/10 to-teal-700/20',
        iconColor: 'from-teal-500 to-teal-400'
    },
    {
        title: "TeleCure",
        description: "Connect with doctors via secure video calls.",
        icon: Video,
        size: 'medium',
        isComplete: false,
        bgColor: 'from-purple-900/20 via-purple-800/10 to-purple-700/20',
        iconColor: 'from-purple-500 to-purple-400'
    },
    {
        title: "PharmaFind",
        description: "Know what medicine to use in emergency situations.",
        icon: Locate,
        size: 'small',
        bgColor: 'from-red-900/20 via-red-800/10 to-red-700/20',
        iconColor: 'from-red-500 to-red-400'
    },
    {
        title: "First Aid Guide",
        description: "Essential emergency instructions.",
        icon: BookOpen,
        size: 'small',
        isComplete: false,
        bgColor: 'from-orange-900/20 via-orange-800/10 to-orange-700/20',
        iconColor: 'from-orange-500 to-orange-400'
    },
    {
        title: "PxVault",
        description: "Store prescriptions securely.",
        icon: Shield,
        size: 'small',
        bgColor: 'from-slate-900/20 via-slate-800/10 to-slate-700/20',
        iconColor: 'from-slate-500 to-slate-400'
    },
    {
        title: "NutriGuide",
        description: "Personalized nutrition plans for health conditions.",
        icon: Apple,
        size: 'medium',
        isComplete: false,
        bgColor: 'from-emerald-900/20 via-emerald-800/10 to-emerald-700/20',
        iconColor: 'from-emerald-500 to-emerald-400'
    },
    {
        title: "NapWise",
        description: "Track and improve sleep patterns.",
        icon: Moon,
        size: 'small',
        isComplete: false,
        bgColor: 'from-indigo-900/20 via-indigo-800/10 to-indigo-700/20',
        iconColor: 'from-indigo-500 to-indigo-400'
    },
    {
        title: "FlexFlow",
        description: "Step-by-step yoga routines.",
        icon: Activity,
        size: 'small',
        isComplete: false,
        bgColor: 'from-orange-900/20 via-orange-800/10 to-orange-700/20',
        iconColor: 'from-orange-500 to-orange-400'
    },
    {
        title: "DermaScan",
        description: "AI-powered skin health insights.",
        icon: Camera,
        size: 'small',
        isComplete: false,
        bgColor: 'from-pink-900/20 via-pink-800/10 to-pink-700/20',
        iconColor: 'from-pink-500 to-pink-400'
    },
    {
        title: "EatIQ",
        description: "Track daily nutrition intake.",
        icon: Calculator,
        size: 'small',
        isComplete: false,
        bgColor: 'from-green-900/20 via-green-800/10 to-green-700/20',
        iconColor: 'from-green-500 to-green-400'
    },
    {
        title: "AquaTrack",
        description: "Log your daily water intake with Voice.",
        icon: Droplets,
        size: 'small',
        bgColor: 'from-cyan-900/20 via-cyan-800/10 to-cyan-700/20',
        iconColor: 'from-cyan-500 to-cyan-400'
    }
];

export default function Services() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMobile) {
                setMousePosition({ x: e.clientX, y: e.clientY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    const getGridClasses = (size: string) => {
        if (isMobile) {
            // On mobile, all cards are single column
            return 'col-span-1 row-span-1';
        }

        switch (size) {
            case 'large':
                return 'col-span-2 row-span-2';
            case 'medium':
                return 'col-span-2 row-span-1';
            case 'small':
            default:
                return 'col-span-1 row-span-1';
        }
    };

    const getCardHeight = (size: string) => {
        if (isMobile) {
            // Uniform height on mobile for better consistency
            return 'h-32';
        }
        return 'h-full';
    };

    return (
        <section className="w-full py-12 md:py-24 px-4 md:px-6 bg-black text-white overflow-hidden" id="Services">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 text-transparent bg-clip-text">
                        Health Services
                    </h2>
                    <p className="text-gray-400 mb-6 md:mb-12 max-w-2xl mx-auto text-base md:text-lg px-4">
                        Complete healthcare solutions powered by AI and trusted by healthcare professionals
                    </p>
                </motion.div>

                {/* Mobile-Optimized Grid */}
                <div className={`
                    grid gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-16
                    ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-4 auto-rows-fr min-h-[600px]'}
                `}>
                    {services.map((service, index) => {
                        const ref = useRef(null);
                        const isInView = useInView(ref, { once: true });
                        const IconComponent = service.icon;

                        return (
                            <motion.div
                                key={index}
                                ref={ref}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.03 }}
                                className={`${getGridClasses(service.size)} relative group cursor-pointer`}
                                onMouseEnter={() => !isMobile && setHoveredCard(index)}
                                onMouseLeave={() => !isMobile && setHoveredCard(null)}
                            >
                                {/* Cursor glow effect - disabled on mobile */}
                                {!isMobile && (
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{
                                            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.1), transparent 40%)`,
                                        }}
                                    />
                                )}

                                {/* Enhanced Card */}
                                <motion.div
                                    className={`
                                        w-full ${getCardHeight(service.size)} rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-6 relative overflow-hidden
                                        ${service.bgColor
                                            ? `bg-gradient-to-br ${service.bgColor}`
                                            : 'bg-white/5'
                                        }
                                        backdrop-blur-lg border border-white/10 
                                        hover:border-green-500/30 transition-all duration-300
                                        group-hover:shadow-2xl group-hover:shadow-green-500/10
                                        active:scale-95 md:active:scale-100
                                    `}
                                    whileHover={!isMobile ? { scale: 1.02 } : {}}
                                    whileTap={isMobile ? { scale: 0.98 } : {}}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-green-500 rounded-full blur-2xl transform translate-x-8 md:translate-x-12 -translate-y-8 md:-translate-y-12" />
                                        <div className="absolute bottom-0 left-0 w-12 md:w-16 h-12 md:h-16 bg-lime-400 rounded-full blur-xl transform -translate-x-6 md:-translate-x-8 translate-y-6 md:translate-y-8" />
                                    </div>

                                    {/* Status badges */}
                                    <div className="absolute top-2 md:top-3 right-2 md:right-3 flex flex-col gap-1 md:gap-2 z-20">
                                        {service.isComplete && (
                                            <div className="bg-green-500/20 text-green-400 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-green-500/30">
                                                ✓ Live
                                            </div>
                                        )}
                                        {service.featured && (
                                            <div className="bg-gradient-to-r from-yellow-500 to-orange-400 text-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-bold">
                                                Featured
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Container - Flex for mobile */}
                                    <div className={`
                                        relative z-10 h-full
                                        ${isMobile ? 'flex items-center gap-3' : 'flex flex-col'}
                                    `}>
                                        {/* Enhanced Icon */}
                                        <motion.div
                                            className={`
                                                flex items-center justify-center rounded-xl md:rounded-2xl text-black flex-shrink-0
                                                ${isMobile ? 'w-12 h-12' : (service.size === 'large' ? 'w-16 h-16 mb-3' : 'w-12 h-12 mb-3')}
                                                bg-gradient-to-tr ${service.iconColor || 'from-green-500 to-lime-400'}
                                                group-hover:from-green-400 group-hover:to-lime-300
                                                transition-all duration-300
                                            `}
                                            whileHover={!isMobile ? { rotate: 360 } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <IconComponent className={`
                                                ${isMobile ? 'w-6 h-6' : (service.size === 'large' ? 'w-8 h-8' : 'w-6 h-6')}
                                            `} />
                                        </motion.div>

                                        {/* Text Content */}
                                        <div className={`${isMobile ? 'flex-1 min-w-0' : ''}`}>
                                            <h3 className={`
                                                font-bold text-white mb-1 md:mb-2 group-hover:text-green-200 transition-colors duration-300
                                                ${isMobile ? 'text-sm' : (service.size === 'large' ? 'text-xl' : 'text-lg')}
                                                ${isMobile ? 'line-clamp-1' : ''}
                                            `}>
                                                {service.title}
                                            </h3>
                                            <p className={`
                                                text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300
                                                ${isMobile ? 'text-xs line-clamp-2' : (service.size === 'large' ? 'text-sm' : 'text-xs')}
                                            `}>
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-lime-400/0 group-hover:from-green-500/5 group-hover:to-lime-400/5 transition-all duration-300 rounded-2xl md:rounded-3xl" />
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Enhanced Stats section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16"
                >
                    {[
                        { number: "12+", label: "Health Services" },
                        { number: "8+", label: "AI-Powered Tools" },
                        { number: "100%", label: "Secure & Private" },
                        { number: "24/7", label: "Support Available" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400 mb-1 md:mb-2">{stat.number}</div>
                            <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Enhanced bottom text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center px-4"
                >
                    <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-500 via-gray-200 to-green-500 text-transparent bg-clip-text mb-3 md:mb-4">
                        Your Complete Health Companion
                    </p>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                        More innovative features are continuously being developed to enhance your healthcare experience
                    </p>
                </motion.div>
            </div>
        </section>
    );
}