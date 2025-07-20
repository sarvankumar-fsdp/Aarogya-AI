"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Loader2, Undo2 } from "lucide-react";

interface MeditationPlan {
    intro: string;
    steps: string[];
    ambiance: string;
    quote: string;
}

export default function MeditationPlanner() {
    const [temperature, setTemperature] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [level, setLevel] = useState("beginner");
    const [duration, setDuration] = useState("");
    const [meditationPlan, setMeditationPlan] = useState<MeditationPlan | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!temperature || !timeOfDay || !level || !duration) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        setMeditationPlan(null);

        const res = await fetch(`/api/meditation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                temperature,
                time: timeOfDay,
                duration,
                level,
            }),
        });

        const data = await res.json();

        if (data?.meditationPlan) {
            setMeditationPlan(data.meditationPlan);
        } else {
            alert("Failed to generate meditation plan.");
        }

        setLoading(false);
    };

    return (
        <div className="sm:max-w-[95vw] md:max-w-3xl mx-auto mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-2">
                        <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'>
                            <Undo2 className="size-4" />
                        </a>
                        <h2 className="text-xl font-bold">Meditation Plan Generator</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">Temperature (°C)</Label>
                            <Input
                                type="number"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                placeholder="Enter temperature"
                            />
                        </div>

                        <div>
                            <Label className="mb-2">Time of Day</Label>
                            <Select onValueChange={setTimeOfDay}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Morning</SelectItem>
                                    <SelectItem value="afternoon">Afternoon</SelectItem>
                                    <SelectItem value="evening">Evening</SelectItem>
                                    <SelectItem value="night">Night</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2">Meditation Level</Label>
                            <Select onValueChange={setLevel} defaultValue="beginner">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2">Session Duration (min)</Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="10"
                            />
                        </div>

                        <Button className="w-full cursor-pointer" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </div>
                            ) : (
                                "Generate Plan"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="text-xs text-center text-muted-foreground mt-6 px-4">
                <p>
                    🧘 <strong>Note:</strong> This meditation session is AI-generated for self-care.
                    For specific health or mental well-being concerns, always consult a certified meditation guide or professional.
                </p>
            </div>

            {loading && (
                <div className="flex justify-center items-center mt-6">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            )}

            {meditationPlan && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center">
                        Your Personalized Meditation Plan
                    </h3>
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <p className="text-md text-muted-foreground italic">✨ {meditationPlan.intro}</p>

                            <div>
                                <Label className="mb-2">Steps:</Label>
                                <ul className="list-disc ml-6 text-sm">
                                    {meditationPlan.steps.map((step, i) => (
                                        <li className="mb-2" key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>

                            <p className="text-sm mt-4"><strong>🌿 Recommended Ambiance:</strong> {meditationPlan.ambiance}</p>
                            <p className="text-sm italic text-center mt-4">💬 "{meditationPlan.quote}"</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="mb-10" />
        </div>
    );
}
