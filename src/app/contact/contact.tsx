'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const headingRef = useRef(null);
    const isInView = useInView(headingRef, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start("visible");
    }, [isInView, controls]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const target = e.currentTarget;
        const name = (target.elements.namedItem("name") as HTMLInputElement).value;
        const email = (target.elements.namedItem("email") as HTMLInputElement).value;
        const message = (target.elements.namedItem("message") as HTMLTextAreaElement).value;

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: "7af1432a-847c-4679-8b8f-e55d934beb1a",
                name,
                email,
                message,
            }),
        });

        const result = await response.json();
        if (result.success) {
            setSubmitted(true);
            target.reset();
        } else {
            alert("Something went wrong. Please try again.");
        }

        setLoading(false);
    }

    return (
        <section id="contact" className="pt-8 pb-20 mx-auto px-4 container text-white">

            <motion.h2
                ref={headingRef}
                initial="hidden"
                animate={controls}
                variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl md:text-5xl text-center mt-8 "
            >
                Aarogya.me - Get in Touch
            </motion.h2>

            {submitted ? (
                <div className="mt-12 font-bold text-center text-green-400 text-xl">
                    Thank you! Your message has been received.
                </div>
            ) : (
                <div className="mt-12 sm:w-full md:w-1/2 mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Your name"
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="email@example.com"
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="message" className="text-sm font-medium text-zinc-300">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                required
                                placeholder="Enter your message..."
                                className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 cursor-pointer bg-sky-600 hover:bg-sky-800 text-white font-medium py-2 rounded-lg transition-all duration-500"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            )}
            <div className='flex justify-center items-center pt-18'>
                <a href='/' className='hover:underline'>← Back to Home</a>
            </div>
            
        </section>
    );
}
