"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, GlassWater, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function WaterForm() {
    const { user } = useUser();
    const userId = user?.id;

    const [intake, setIntake] = useState(0);
    const [goal, setGoal] = useState(3000);
    const [listening, setListening] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [loadingIntake, setLoadingIntake] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!userId) return;
        fetchIntake();
    }, [userId]);

    async function fetchIntake() {
        setLoadingIntake(true);
        try {
            const res = await fetch(`/api/water-logs?user_id=${userId}&date=${today}`);
            const json = await res.json();
            if (json.success && json.data?.intake !== undefined) {
                console.log("Fetched intake:", json.data.intake);
                setIntake(json.data.intake);
            }
        } catch {
            setFeedback("Failed to load today's intake.");
        } finally {
            setLoadingIntake(false);
        }
    }

    async function logWater(amount: number) {
        if (!userId) {
            setFeedback("User not authenticated.");
            return;
        }

        const res = await fetch("/api/water-logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, date: today, intake: intake + amount }),
        });

        const json = await res.json();
        if (json.success) {
            setFeedback(`Logged ${amount}ml of water!`);
            fetchIntake();  // Refresh intake after logging
        } else {
            setFeedback(json.error || "Error logging intake");
        }
    }

    function handleVoiceCommand() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            setFeedback("Listening for water amount...");
        };

        recognition.onerror = () => {
            setListening(false);
            setFeedback("Voice recognition error.");
        };

        recognition.onend = () => setListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            const amount = extractWaterAmount(transcript);
            if (amount > 0) {
                setInputAmount(amount.toString());
                setFeedback(`Recognized ${amount}ml. Click Submit to log.`);
            } else {
                setFeedback("Couldn't detect amount. Try again.");
            }
        };

        recognition.start();
    }

    function extractWaterAmount(transcript: string) {
        const regex = /(\d+)\s*(ml|milliliters|mls)?/i;
        const match = transcript.match(regex);
        return match ? parseInt(match[1]) : 0;
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputAmount(e.target.value);
    }

    function handleManualSubmit() {
        const amount = parseInt(inputAmount);
        if (!isNaN(amount) && amount > 0) {
            logWater(amount);
            setInputAmount("");
        } else {
            setFeedback("Please enter a valid number.");
        }
    }

    return (
        <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg w-[90vw] max-w-md mx-auto mt-4">
            <h2 className="text-lg sm:text-xl text-white font-bold mb-2 flex items-center">
                <GlassWater className="mr-2" /> AquaTrack
            </h2>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <input
                    type="number"
                    min="1"
                    placeholder="Enter ml"
                    value={inputAmount}
                    onChange={handleInputChange}
                    className="bg-gray-800 text-white p-2 rounded w-full sm:w-auto"
                />
                <Button onClick={handleManualSubmit} className="w-full sm:w-auto">Submit</Button>
                <Button
                    onClick={handleVoiceCommand}
                    variant={listening ? "secondary" : "default"}
                    className="w-full sm:w-auto"
                >
                    <Mic className="mr-1" /> {listening ? "Listening..." : "Voice Log"}
                </Button>
            </div>

            {feedback && (
                <Card className="bg-gray-800 mt-4">
                    <CardContent className="flex items-center gap-2">
                        {feedback.includes("Logged") ? (
                            <CheckCircle className="text-green-400" />
                        ) : (
                            <AlertCircle className="text-yellow-400" />
                        )}
                        <span>{feedback}</span>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-gray-800 mt-4">
                <CardContent>
                    <p className="text-sm sm:text-base text-white">Tip: Stay hydrated for better energy and focus!</p>
                </CardContent>
            </Card>
        </div>
    );
}
