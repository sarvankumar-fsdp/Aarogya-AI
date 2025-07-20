"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Droplet } from "lucide-react";

const tips = [
    "Drink a glass of water right after waking up to kickstart your hydration.",
    "Keep a water bottle handy to remind yourself to sip throughout the day.",
    "Add a slice of lemon or cucumber to your water for a refreshing twist.",
    "Set a timer to drink water every hour if you tend to forget.",
    "Remember: thirst is often mistaken for hunger. Stay hydrated!",
];

export default function WaterTip() {
    const [tip, setTip] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For demo, pick a random tip every page load
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setTip(randomTip);
        setLoading(false);
    }, []);

    return (
        <div className="w-[90vw] mx-auto dark text-white mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                        <Droplet className="text-cyan-400 w-5 h-5" />
                        <h2 className="text-lg sm:text-xl font-bold text-cyan-400">
                            Hydration Tip of the Day
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-2 text-cyan-300">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Loading tip...
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{tip}</p>
                    )}

                    {!loading && !tip && (
                        <p className="text-zinc-400 text-sm">
                            💧 Log your water intake to receive personalized hydration tips.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>

    );
}
