'use client';

import { useState, useRef } from 'react';
import { Bot, Loader2, Undo2, X } from 'lucide-react';

export default function AnaemiaVisionAssistant() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            previewAndUpload(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            previewAndUpload(file);
        } else {
            setError("Please drop a valid image file.");
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const previewAndUpload = (file: File) => {
        setImage(file);
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
        handleImageUpload(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch('/api/anemia-vision', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Upload failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen flex flex-col bg-[#000000] text-white px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-md font-bold flex items-center gap-2 text-[#f87171]">
                    <a href="/dashboard" className="hover:underline font-extrabold text-xl hover:text-[#fbbf24]">
                        <Undo2 className="size-4" />
                    </a>
                    <Bot className="w-6 h-6" />
                    Anaemia Vision
                </h1>
            </div>

            <div className="flex flex-col items-center w-full max-w-2xl gap-8 mx-auto">
                {/* Heading */}
                <div className="text-center space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#f87171] to-[#fbbf24] bg-clip-text text-transparent">
                        Upload Your Nail Image
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base">
                        AI will analyze your nails for visible signs of anemia.
                    </p>
                </div>

                {/* Upload Box */}
                <div
                    className={`relative w-full border-2 border-dashed rounded-xl px-6 py-8 md:p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${isDragOver ? 'border-[#f87171] bg-[#1a1a1a]' : 'border-[#783c00] bg-white/5'
                        }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={triggerFileSelect}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                    />

                    {!previewUrl ? (
                        <div className="text-center">
                            <p className="text-lg md:text-xl text-gray-300 font-medium">
                                Drag & Drop or Click to Upload Nail Image
                            </p>
                            <p className="text-sm text-gray-500">Supported: JPG, PNG, WebP</p>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-md">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full max-h-96 object-contain rounded-lg shadow"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage();
                                }}
                                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-sm text-gray-400 mt-2 text-center break-all">{image?.name}</p>
                        </div>
                    )}
                </div>

                {/* Result Output */}
                <div className="w-full bg-[#141414] border border-[#783c00] rounded-xl p-6">
                    {isLoading && (
                        <div className="text-center text-[#fbbf24]">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Analyzing nail image...
                        </div>
                    )}

                    {error && (
                        <div className="text-red-400 text-center mt-4">{error}</div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#f87171]"># Condition Detected</h2>
                                <p className="text-gray-200">{result.condition}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-[#fbbf24]"># Severity</h2>
                                <p className="text-gray-100 font-medium text-lg">{result.severity}</p>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-[#a0e8af]"># AI Advice</h2>
                                <p className="text-gray-200">{result.advice}</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !result && !error && (
                        <p className="text-gray-400 text-center">Awaiting nail image analysis…</p>
                    )}
                </div>
            </div>

            <p className="bg-gray-900 rounded-xl text-xs p-2 m-6 text-[#fbbf24] mt-8 text-center">
                This is an AI estimation. Please consult a certified doctor for professional diagnosis.
            </p>
        </div>
    );
}
