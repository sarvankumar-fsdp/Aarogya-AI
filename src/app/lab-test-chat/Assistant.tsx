"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Undo2, Bot, User, Loader2, AlertTriangle } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Simple markdown renderer component
const MarkdownRenderer = ({ content }: { content: string }) => {
    const renderMarkdown = (text: string) => {
        // Replace **bold** with <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Replace *italic* with <em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Replace line breaks with <br>
        text = text.replace(/\n/g, '<br>');

        // Replace bullet points (- item) with proper list items
        text = text.replace(/^- (.+)$/gm, '<li>$1</li>');

        // Wrap consecutive list items in <ul>
        text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        return text;
    };

    return (
        <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
    );
};

export default function LabTestExplainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            const response = await fetch("/api/lab-test-explainer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input.trim() }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") break;

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices[0]?.delta?.content || "";
                                if (content) {
                                    assistantMessage.content += content;
                                    setMessages((prev) =>
                                        prev.map((msg) =>
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
                reader.releaseLock();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition is not supported.");
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    return (
        <div className="max-w-4xl p-2 md:p-0 mx-auto h-screen flex flex-col bg-black text-white">
            {/* Header */}
            <div className="md:my-4 my-1 p-4 rounded-t-xl bg-gradient-to-r from-indigo-900 to-blue-900 text-white md:p-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <a href="/dashboard" className="hover:underline font-extrabold text-xl hover:text-cyan-400"><Undo2 /></a>
                    <Bot className="w-8 h-8" />
                    <h1 className="text-xl font-bold tracking-wider">Lab Test Explainer</h1>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Understand Your Lab Reports</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Enter your lab test result names and values. I'll explain what they mean.
                        </p>
                        <div className="mt-6 text-left bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-gray-400 mb-2 font-medium">Example:</p>
                            <p className="text-sm text-gray-300 italic">"My CBC shows WBC is 11,000 and Hemoglobin is 9.5."</p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-3 max-w-3xl ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600" : "bg-gray-800"}`}>
                                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>
                            <div className={`rounded-2xl px-6 py-4 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"}`}>
                                {msg.role === "assistant" ? (
                                    <MarkdownRenderer content={msg.content} />
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                                <div className="text-xs mt-2 text-gray-400">{msg.timestamp.toLocaleTimeString()}</div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="flex gap-3 max-w-3xl">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-400">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="rounded-2xl px-6 py-4 bg-gray-800 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Analyzing...</span>
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

            {/* Input */}
            <div className="border-t bg-gray-900 p-6 md:mb-4 rounded-b-xl mb-0">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your lab test values..."
                        className="w-full px-2 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-900 ${isListening ? "animate-pulse" : ""}`}
                    >
                        🎤
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">This is AI-generated medical information. Consult a doctor if unsure.</p>
            </div>
        </div>
    );
}