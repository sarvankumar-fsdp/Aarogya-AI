"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

export default function SleepTip() {
    const { user } = useUser();
    const [tip, setTip] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchTip = async () => {
        if (!user) return;

        setLoading(true);
        setError("");
        setTip("");

        try {
            const res = await fetch("/api/sleep-tip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user.id }),
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.error || "Failed to fetch sleep tip.");
                setLoading(false);
                return;
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullText = "";

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                fullText += decoder.decode(value);
                setTip(fullText); // live stream tip
            }

            setLoading(false);
        } catch (err) {
            setError("Something went wrong while fetching tips.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTip();
    }, [user]);

    return (
        <div className="sm:max-w-[95vw] md:max-w-3xl mx-auto dark text-white mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-cyan-400 w-5 h-5" />
                        <h2 className="text-xl font-bold text-cyan-400">
                            AI Sleep Tips of the Day
                        </h2>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 text-cyan-300">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Generating personalized tip...
                        </div>
                    )}

                    {error && (
                        <p className="text-red-400 text-sm">⚠️ {error}</p>
                    )}

                    {!loading && tip && (
                        <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                            {tip}
                        </p>
                    )}

                    {!loading && !tip && !error && (
                        <p className="text-zinc-400 text-sm">
                            💤 Log your sleep to receive personalized tips.
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground mt-6 px-4">
                <p>
                    💡 <strong>Note:</strong> AI tips are for general awareness. For medical concerns, consult a professional.
                </p>
            </div>

            <div className="mb-10" />
        </div>
    );
}
