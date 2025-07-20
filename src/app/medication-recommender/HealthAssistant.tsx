'use client';

import { useState, useRef, useEffect } from 'react';
import { Send,Undo2, Bot, User, Loader2, AlertTriangle } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function HealthAssistant() {
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
            const response = await fetch('/api/health-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            if (reader) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') break;

                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices[0]?.delta?.content || '';
                                    if (content) {
                                        assistantMessage.content += content;
                                        setMessages(prev =>
                                            prev.map(msg =>
                                                msg.id === assistantMessage.id
                                                    ? { ...msg, content: assistantMessage.content }
                                                    : msg
                                            )
                                        );
                                    }
                                } catch { }
                            }
                        }
                    }
                } finally {
                    reader.releaseLock();
                }
            }
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

    const formatHealthResponse = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim());
        const formatted = [];

        for (const line of lines) {
            if (line.startsWith('Symptom(s):')) {
                formatted.push(
                    <div key="symptoms" className="mb-4">
                        <h3 className="font-semibold text-blue-400 mb-2">🩺 Symptoms</h3>
                        <p className="text-gray-300">{line.replace('Symptom(s):', '').trim()}</p>
                    </div>
                );
            } else if (line.startsWith('Medication:')) {
                formatted.push(
                    <div key="medication" className="mb-4">
                        <h3 className="font-semibold text-green-400 mb-2">💊 Medication</h3>
                        <p className="text-gray-300">{line.replace('Medication:', '').trim()}</p>
                    </div>
                );
            } else if (line.startsWith('If Situation Worsens:')) {
                formatted.push(
                    <div key="warning" className="mb-4">
                        <h3 className="font-semibold text-red-400 mb-2">⚠️ If Situation Worsens</h3>
                        <p className="text-gray-300">{line.replace('If Situation Worsens:', '').trim()}</p>
                    </div>
                );
            }
        }

        return formatted.length > 0 ? formatted : <p className="text-gray-300">{content}</p>;
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
                    background: linear-gradient(180deg, rgba(0, 31, 63, 0.7), rgba(0, 64, 128, 0.7));
                    border-radius: 10px;
                    border: 1px solid rgba(0, 64, 128, 0.4);
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(0, 31, 63, 1), rgba(0, 64, 128, 1));
                }
                * {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 31, 63, 0.7) rgba(31, 41, 55, 0.3);
                }
            `}</style>

            {/* Header with Indian Navy Theme */}
            <div className="md:my-4 my-1 p-4 rounded-t-xl bg-gradient-to-r from-[#001F3F] via-[#003366] to-[#004080] text-white md:p-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2/></a>
                    <Bot className="w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-bold tracking-wider">Medication Recommender</h1>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            Welcome to Aargya's Medication Recommender
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Describe your symptoms and I’ll suggest over-the-counter medications and guidance.
                        </p>
                        <div className="mt-6 text-left bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-gray-400 mb-2 font-medium">Example:</p>
                            <p className="text-sm text-gray-300 italic">"I have a cold and fever"</p>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                                {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`rounded-2xl px-6 py-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                {message.role === 'assistant' ? (
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        {formatHealthResponse(message.content)}
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                )}
                                <div className={`text-xs mt-3 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex gap-3 max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-800 text-gray-400">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="rounded-2xl px-6 py-4 bg-gray-800 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Analyzing symptoms...</span>
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
                <form onSubmit={handleSubmit} className="flex flex-row gap-2 items-center justify-center">
                    <div className="flex flex-row gap-4">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Symptoms..."
                            className="w-full px-2 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={1}
                            cols={500}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleVoiceInput}
                            disabled={isListening}
                            className={`px-4 py-2 rounded-lg bg-[#003366] text-white hover:bg-[#002244] transition-colors ${isListening ? 'animate-pulse' : ''}`}
                            title="Voice input"
                        >
                            🎤
                        </button>
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-2 bg-[#004080] text-white rounded-lg hover:bg-[#002f5c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                    This is AI-generated content. Please double-check the suggestions before use.
                </p>
            </div>
        </div>
    );
}
