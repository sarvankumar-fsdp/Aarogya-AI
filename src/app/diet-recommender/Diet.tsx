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

interface MealPlan {
    [day: string]: {
        [meal: string]: string;
    };
}

export default function DietRecommender() {
    const [chronicCondition, setChronicCondition] = useState("");
    const [temperature, setTemperature] = useState("");
    const [mealsPerDay, setMealsPerDay] = useState("");
    const [foodPreference, setFoodPreference] = useState("");
    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [tip, setTip] = useState("");

    const handleSubmit = async () => {
        if (!chronicCondition || !temperature || !mealsPerDay || !foodPreference) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        setPlan(null);

        const res = await fetch("/api/diet-recommender", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chronicCondition,
                temperature,
                mealsPerDay,
                foodPreference,
            }),
        });

        const data = await res.json();
        if (data?.plan) {
            setPlan(data.plan);
            setTip(data.wellnessTip);
        } else {
            alert("Failed to generate diet plan.");
        }

        setLoading(false);
    };

    return (
        <div className="sm:max-w-[95vw] md:max-w-3xl mx-auto dark text-white mt-10 space-y-6 px-4">
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-2">
                        <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2 className="size-4" /></a>
                        <h2 className="text-xl font-bold">Diet Recommender</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">Chronic Condition</Label>
                            <Select onValueChange={setChronicCondition}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Diabetes Type 1">Diabetes Type 1</SelectItem>
                                    <SelectItem value="Diabetes Type 2">Diabetes Type 2</SelectItem>
                                    <SelectItem value="Hypertension">Hypertension</SelectItem>
                                    <SelectItem value="Hypotension">Hypotension</SelectItem>
                                    <SelectItem value="Thyroid">Thyroid</SelectItem>
                                    <SelectItem value="Neural Weakness">Neural Weakness</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                            <Label className="mb-2">Meals Per Day</Label>
                            <Select onValueChange={setMealsPerDay}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select meals/day" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2">Food Preference</Label>
                            <Select onValueChange={setFoodPreference}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Veg / Non-Veg" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                    <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full cursor-pointer" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </div>
                            ) : (
                                "Generate Diet Plan"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {plan && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center">Your 7-Day Meal Plan</h3>
                    {Object.entries(plan).map(([day, meals], index) => (
                        <Card key={index}>
                            <CardContent className="p-4 space-y-2">
                                <h4 className="text-lg font-bold mb-2">{day}</h4>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    {Object.entries(meals).map(([mealType, meal], idx) => (
                                        <li key={idx}>
                                            <strong>{mealType}</strong>: {meal}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                    {tip && (
                        <Card>
                            <CardContent className="p-4 text-center italic text-sm text-green-400">
                                {tip}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            <div className="text-xs text-center text-muted-foreground mt-6 px-4">
                <p>
                    ⚠️ <strong>Disclaimer:</strong> This diet is AI-generated and for informational purposes only.
                    Consult a healthcare professional before making medical or dietary decisions.
                </p>
            </div>
        </div>
    );
}
