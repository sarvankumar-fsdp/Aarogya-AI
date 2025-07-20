'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle, Mic, Undo2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function MedicineUsageBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/medicine-usage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            const formatted = JSON.stringify(result, null, 2);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: formatted,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const formatMedicineResponse = (content: string) => {
        try {
            const parsed = JSON.parse(content);
            if (parsed.error) {
                return (
                    <div className="mb-4">
                        <h3 className="font-semibold text-red-400 mb-2">❌ Error</h3>
                        <p className="text-gray-300">{parsed.error}</p>
                    </div>
                );
            }

            const formatted = [];

            if (parsed.medicine) {
                formatted.push(
                    <div key="medicine" className="mb-4">
                        <h3 className="font-semibold text-orange-400 mb-2">💊 Medicine</h3>
                        <p className="text-gray-300">{parsed.medicine}</p>
                    </div>
                );
            }

            if (parsed.use_for) {
                formatted.push(
                    <div key="use_for" className="mb-4">
                        <h3 className="font-semibold text-green-400 mb-2">✅ Use For</h3>
                        <p className="text-gray-300">{parsed.use_for}</p>
                    </div>
                );
            }

            if (parsed.dosage_and_usage) {
                formatted.push(
                    <div key="dosage" className="mb-4">
                        <h3 className="font-semibold text-yellow-300 mb-2">🕒 Dosage & Usage</h3>
                        <p className="text-gray-300">{parsed.dosage_and_usage}</p>
                    </div>
                );
            }

            if (parsed.long_term_side_effects) {
                formatted.push(
                    <div key="side_effects" className="mb-4">
                        <h3 className="font-semibold text-red-400 mb-2">⚠️ Long-Term Side Effects</h3>
                        <p className="text-gray-300">{parsed.long_term_side_effects}</p>
                    </div>
                );
            }

            if (parsed.precautions) {
                formatted.push(
                    <div key="precautions" className="mb-4">
                        <h3 className="font-semibold text-orange-300 mb-2">🔍 Precautions</h3>
                        <p className="text-gray-300">{parsed.precautions}</p>
                    </div>
                );
            }

            if (parsed.note) {
                formatted.push(
                    <div key="note" className="mb-4">
                        <h3 className="font-semibold text-blue-400 mb-2">📘 Note</h3>
                        <p className="text-gray-300">{parsed.note}</p>
                    </div>
                );
            }

            return formatted.length > 0 ? formatted : <p className="text-gray-300">{content}</p>;
        } catch {
            return <p className="text-gray-300 whitespace-pre-wrap">{content}</p>;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="max-w-4xl p-2 md:p-0 mx-auto h-screen flex flex-col bg-black text-white">
            <div className="md:my-4 my-1 p-4 rounded-t-xl bg-gradient-to-r from-orange-500 via-white to-green-600 text-black md:p-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2 /></a>
                <Bot className="w-8 h-8 text-blue-700" />
                    <h1 className="text-xl font-bold tracking-tight">
                        Medicine Usage Finder
                    </h1>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            Welcome to Aarogya's Medicine Usage Finder
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Ask me about any medicine and I'll provide detailed information about its usage, dosage, and precautions.
                        </p>
                        <div className="mt-6 text-left bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-gray-400 mb-2 font-medium">Example:</p>
                            <p className="text-sm text-gray-300 italic">
                                "Paracetamol"
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'}`}>
                                {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`rounded-2xl px-6 py-4 ${message.role === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                {message.role === 'assistant' ? (
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        {formatMedicineResponse(message.content)}
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                )}
                                <div className={`text-xs mt-3 ${message.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex gap-3 max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600 text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="rounded-2xl px-6 py-4 bg-gray-800 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Fetching medicine information...</span>
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

            {/* Input Form */}
            <div className="border-t bg-gray-900 p-6 md:mb-4 rounded-b-xl mb-0">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="flex flex-row gap-4">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Medicine name..."
                            className="w-full px-2 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows={1}
                            cols={500}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleVoiceInput}
                            disabled={isListening}
                            className={`px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors ${isListening ? 'animate-pulse' : ''
                                }`}
                            title="Voice input"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    This is AI-Generated Content. Kindly double-check with a professional. 🇮🇳
                </p>
            </div>
        </div>
    );
}
