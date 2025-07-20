'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Faq() {
    const items = [
        {
            value: "item-1",
            question: "How does the AI Medication Recommender work?",
            answer: [
                "The AI Medication Recommender uses your health profile and symptom data to suggest appropriate medications. It's built on a fine-tuned language model trained with verified medical data.",
                "However, we strongly recommend consulting with a healthcare professional before starting any medication."
            ]
        },
        {
            value: "item-2",
            question: "Can I store and access my prescriptions securely?",
            answer: [
                "Yes! Aarogya offers encrypted prescription storage that keeps all your documents safe and accessible from any device.",
                "You can even interact with your stored prescriptions using our AI chatbot for quick understanding and clarification."
            ]
        },
        {
            value: "item-3",
            question: "Is there support for mental wellness?",
            answer: [
                "Absolutely. Aarogya includes a Mental Health Chatbot trained to provide supportive conversations and resources for managing stress, anxiety, and more.",
                "While not a substitute for professional help, it serves as a helpful companion for mental wellness."
            ]
        },
        {
            value: "item-4",
            question: "Can visually impaired users navigate the app?",
            answer: [
                "Yes. Aarogya offers Voice Mode for hands-free navigation and commands, making it highly accessible for visually impaired users.",
                "Simply activate the voice assistant and start interacting with key features using natural speech."
            ]
        },
        {
            value: "item-5",
            question: "How do video consultations work?",
            answer: [
                "Our On-Call Video Consultations feature connects you with certified doctors anytime, anywhere. Just book a slot and consult through a secure video channel.",
                "You’ll also be able to share your health reports and prescriptions during the session."
            ]
        },
        {
            value: "item-6",
            question: "How does Aarogya help me stay hydrated?",
            answer: [
                "Aarogya sends smart hydration reminders throughout the day, based on your lifestyle and local climate conditions.",
                "You can customize the frequency and timing of these reminders according to your preferences."
            ]
        },
        {
            value: "item-7",
            question: "Can I get personalized diet suggestions?",
            answer: [
                "Yes! Our AI-Powered Diet Recommender analyzes your health goals and preferences to provide custom meal suggestions.",
                "It considers factors like allergies, fitness goals, and dietary restrictions."
            ]
        },
        
    ];

    return (
        <section id="Faq" className="px-8 md:px-46 py-20">
            <h2 className="text-3xl text-white text-center md:text-4xl font-bold mb-10">
                Frequently Asked Questions
            </h2>

            <Accordion
                type="single"
                collapsible
                className="text-white"
            >
                {items.map((item, index) => {
                    const ref = useRef(null);
                    const isInView = useInView(ref, { once: true });

                    return (
                        <motion.div
                            key={item.value}
                            ref={ref}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <AccordionItem value={item.value}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-balance">
                                    {item.answer.map((text, i) => (
                                        <p key={i}>{text}</p>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    );
                })}
            </Accordion>
        </section>
    );
}
