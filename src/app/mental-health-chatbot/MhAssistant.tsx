"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Loader2, AlertTriangle, Mic, Send, Undo2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function AshaMentalHealthBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/asha-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();

            const formatted = `🧠 ${result.assistant.response}\n\n🌱 Coping Tips:\n${result.coping_tips.map((tip: string, i: number) => `${i + 1}. ${tip}`).join("\n")}\n\n${result.crisis_check ? "\n⚠️ Crisis Alert: Please reach out to a professional or helpline immediately." : ""}`;

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: formatted,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? " " : "") + transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <div className="max-w-4xl p-2 md:p-0 mx-auto h-screen flex flex-col bg-black text-white">
            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(31, 41, 55, 0.3);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, rgba(1, 24, 38, 0.7), rgba(3, 65, 120, 0.7));
                    border-radius: 10px;
                    border: 1px solid rgba(3, 65, 120, 0.4);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(1, 24, 38, 1), rgba(3, 65, 120, 1));
                }
                * {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(3, 65, 120, 0.7) rgba(31, 41, 55, 0.3);
                }
            `}</style>
            <div className="my-1 p-4 rounded-t-xl bg-gradient-to-r from-[#011826] via-[#0e4d78] to-[#0a5c8e] text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2 /></a>
                <Bot className="w-8 h-8 text-cyan-300" />
                    <h1 className="text-xl font-bold tracking-tight">Asha - Support Bot</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400 mb-2">Welcome to Asha</h3>
                        <p className="text-slate-500 max-w-md mx-auto">I'm here to support your emotional wellbeing. Type or speak what’s on your mind.</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-700' : 'bg-blue-900'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`rounded-2xl px-6 py-4 ${msg.role === 'user' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                <div className="text-xs mt-3 text-gray-500">{msg.timestamp.toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex gap-3 max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-900 text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="rounded-2xl px-6 py-4 bg-gray-800 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Thinking of the kindest words...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 text-red-400">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">Error:</span>
                        </div>
                        <p className="mt-1">{error}</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-gray-900 p-6 rounded-b-xl">
                <div className="flex flex-row gap-4">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                        placeholder="I'm feeling..."
                        className="w-full px-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                        rows={1}
                    />
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        disabled={isListening}
                        className={`px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 transition-colors ${isListening ? 'animate-pulse' : ''}`}
                        title="Voice input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any)}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    This is AI-generated response. Always reach out to a pro for mental health concerns.
                </p>
            </div>
        </div>
    );
}