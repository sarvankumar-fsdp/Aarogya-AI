'use client';

import Image from "next/image";
import Logo from "./Logo.png";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HeartPulse, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const paragraphVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.3, duration: 0.6 }
    })
};

const taglineVariants = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
        opacity: 1,
        transition: { delay, duration: 0.8 }
    })
};

export default function AboutAarogya() {
    const sectionRef = useRef(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true });

    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 5; // max tilt: 5deg
        const rotateY = ((x - centerX) / centerX) * -5;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    const paragraphs = [
        "Aarogya.me is a health-tech platform built to serve every Indian — from city folks juggling work-life balance to rural heroes who need quick access to reliable healthcare tools.",
        "Born out of a student’s vision to make digital healthcare more accessible, Aarogya combines AI, voice assistants, and real-time utilities like hospital locators and medication reminders — all in one powerful platform.",
        "Whether you need a diet suggestion, mental health support, prescription insights, or emergency help — Aarogya is designed to support you, 24x7. No hospital visits needed. No jargon. Just care.",
        "From urban professionals to rural families, Aarogya.me is built to bridge the healthcare gap with the power of technology — accessible, affordable, and always available."
    ];

    return (
        <section
            ref={sectionRef}
            id="About"
            className="w-full bg-gradient-to-b from-black via-neutral-900 to-black text-white py-20 px-6 md:px-12"
        >
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        <span className="inline-flex items-center gap-2">
                            <HeartPulse className="w-8 h-8 text-red-500" /> What is Aarogya ?
                        </span>
                    </h2>
                </motion.div>

                {/* Interactive Card */}
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        rotateX: rotate.x,
                        rotateY: rotate.y,
                        transformStyle: 'preserve-3d',
                    }}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-md transition-all duration-300 p-8 md:p-12"
                >
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image src={Logo} alt="Aarogya Logo" width={80} height={80} />
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-6 text-center md:text-left">
                        {paragraphs.map((text, i) => (
                            <motion.p
                                key={i}
                                variants={paragraphVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                custom={i}
                                className={`${i === 0
                                    ? "text-lg text-gray-300 font-medium"
                                    : "text-md text-gray-400"
                                    } leading-relaxed`}
                            >
                                • {text}
                            </motion.p>
                        ))}
                    </div>

                    {/* Taglines */}
                    <div className="mt-10 text-center space-y-2">
                        <motion.p
                            variants={taglineVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            custom={1.5}
                            className="text-sm italic text-gray-500"
                        >
                            #DigitalHealth #BuiltForBharat #SwasthBharat #CareThroughCode #AIForHealthcare #StudentBuilt
                        </motion.p>

                        <motion.p
                            variants={taglineVariants}
                            initial="hidden"
                            animate={isInView ? "visible" : "hidden"}
                            custom={1.7}
                            className="text-sm italic text-gray-500"
                        >
                            Built with code. Powered by purpose. Designed for Bharat.
                        </motion.p>
                    </div>
                    <div className="mt-4 flex flex-col items-center justify-center">
                        <Link href="/sign-in">
                            <Button className="hover:bg-gray-400 font-semibold transition-all duration-500 cursor-pointer text-xl px-3 py-4">
                                Dive in
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
