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

interface YogaAsana {
    name: string;
    duration: string;
    steps: string[];
    image: string;
    benefit: string;
}

export default function YogaPlanner() {
    const [temperature, setTemperature] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [plan, setPlan] = useState("beginner");
    const [duration, setDuration] = useState("");
    const [yogaPlan, setYogaPlan] = useState<YogaAsana[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!temperature || !timeOfDay || !plan || !duration) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        setYogaPlan(null);

        const res = await fetch(`/api/yoga`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                temperature,
                time: timeOfDay,
                duration,
                plan,
            }),
        });

        const data = await res.json();

        if (data?.yogaPlan) {
            setYogaPlan(data.yogaPlan);
        } else {
            alert("Failed to generate yoga plan.");
        }

        setLoading(false);
    };

    return (
        <div className="sm:max-w-[95vw] md:max-w-3xl mx-auto dark text-white mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-2">
                        <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2 className="size-4"/></a>
                        <h2 className="text-xl font-bold">Yoga Plan Generator</h2>
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
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2">Plan Level</Label>
                            <Select onValueChange={setPlan} defaultValue="beginner">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Plan" />
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
                                placeholder="30"
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
                    ⚠️ <strong>Disclaimer:</strong> This yoga plan is generated by AI for educational and wellness purposes.
                    Please consult a certified yoga instructor or healthcare professional before starting any new exercise routine,
                    especially if you have medical conditions or prior injuries.
                </p>
            </div>

            {loading && (
                <div className="flex justify-center items-center mt-6">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
            )}

            {yogaPlan && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center">
                        Your Personalized Yoga Plan
                    </h3>
                    {yogaPlan.map((pose, index) => (
                        <Card key={index}>
                            <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h4 className="text-lg font-bold">{pose.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Duration: {pose.duration}
                                        </p>
                                        <p className="text-sm mt-1 italic">Benefit: {pose.benefit}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2">Steps:</Label>
                                    <ol className="list-decimal ml-6 text-sm">
                                        {pose.steps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="mb-10" />
        </div>
    );
}
