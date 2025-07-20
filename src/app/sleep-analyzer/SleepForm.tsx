"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Undo2 } from "lucide-react";

export default function SleepForm() {
    const [hours, setHours] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useUser();
    const userId = user?.id;
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (user === undefined) return;

        if (!userId) {
            setLoading(false);
            setError("User not authenticated");
            return;
        }

        const fetchSleepDetails = async () => {
            try {
                console.log("Fetching sleep details for:", userId, today);

                const res = await fetch(`/api/sleep-details?user_id=${userId}&date=${today}`);
                if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

                const contentType = res.headers.get("content-type");
                if (!contentType?.includes("application/json")) {
                    throw new Error("Response is not JSON");
                }

                const json = await res.json();
                if (json.error) throw new Error(json.error);

                if (json.data && json.data.length > 0) {
                    setSubmitted(true);
                }
            } catch (err: any) {
                console.error("Fetch error:", err.message);
                setError(err.message || "Failed to fetch sleep data");
            } finally {
                setLoading(false);
            }
        };

        fetchSleepDetails();
    }, [user, userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!userId) {
            setError("User not authenticated");
            return;
        }

        try {
            const res = await fetch("/api/sleep-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    date: today,
                    hours: parseFloat(hours),
                }),
            });

            if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

            const json = await res.json();
            if (json.error) throw new Error(json.error);

            setSubmitted(true);
        } catch (err: any) {
            console.error("Submit error:", err.message);
            setError(err.message || "Submission failed");
        }
    };

    return (
        <div className="sm:max-w-[95vw] md:max-w-2xl mx-auto dark text-white mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex gap-4 items-center">
                        <a href="/dashboard" className="hover:underline font-extrabold text-xl hover:text-cyan-400">
                            <Undo2 />
                        </a>
                        <h2 className="text-xl font-bold">Daily Sleep Tracker</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center gap-2 text-blue-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Loading...
                        </div>
                    ) : error ? (
                        <div className="bg-red-800 text-sm md:text-lg text-white p-4 rounded-lg">
                            ❌ Error: {error}
                        </div>
                    ) : submitted ? (
                        <div className="bg-green-800 text-sm md:text-lg text-white p-4 rounded-lg">
                            ✅ You've already logged your sleep today!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Hours slept last night:</label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="24"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    placeholder="e.g. 7.5"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition">
                                Submit
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground mt-6 px-4">
                <p>
                    ⚠️ <strong>Note:</strong> Sleep tracking helps improve your wellness,
                    but it's not a replacement for professional advice or diagnosis.
                </p>
            </div>

            <div className="mb-10" />
        </div>
    );
}
