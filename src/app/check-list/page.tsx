"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster as Sonner, toast } from "sonner";
import { Loader2, Undo2 } from "lucide-react";

const Toaster = () => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as any}
            className="toaster group"
            style={{
                "--normal-bg": "var(--popover)",
                "--normal-text": "var(--popover-foreground)",
                "--normal-border": "var(--border)",
            } as React.CSSProperties}
        />
    );
};

const fetchChecklist = async (location: string) => {
    const res = await fetch("/api/check-list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "API Error");
    }

    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch (err) {
        return { response: text };
    }
};

export default function TransitHealthMode() {
    const [transitMode, setTransitMode] = useState(false);
    const [location, setLocation] = useState("");
    const [checklist, setChecklist] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFetchChecklist = async () => {
        if (!location) return toast("Please enter Departure location");
        setLoading(true);
        try {
            const data = await fetchChecklist(location);
            setChecklist(data);
        } catch (error: any) {
            toast(error.message || "Error fetching checklist");
        } finally {
            setLoading(false);
        }
    };

    const renderItems = (items: any) => {
        if (Array.isArray(items)) {
            return items.map((item, idx) => (
                <div key={idx} className="mb-2">
                    {typeof item === "object" && item !== null ? (
                        <div className="ml-4 space-y-1">
                            {Object.entries(item).map(([key, val], i) => (
                                <div key={i} className="text-sm">
                                    <span className="font-medium capitalize">{key}:</span> {String(val)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ml-4 text-sm">• {String(item)}</div>
                    )}
                </div>
            ));
        } else if (typeof items === "object" && items !== null) {
            return (
                <div className="ml-4 space-y-1">
                    {Object.entries(items).map(([key, val], idx) => (
                        <div key={idx} className="text-sm">
                            <span className="font-medium capitalize">{key}:</span> {String(val)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return <div className="ml-4 text-sm">{String(items)}</div>;
        }
    };
    

    const sectionIcons: Record<string, string> = {
        immunizations: "•",
        hydration: "•",
        jetLag: "•",
        precautions: "•",
        packing: "•",
    };

    return (
        <div className="mx-4 md:mx-12 dark text-white p-4 space-y-4">
            <Toaster />
            <Card className="bg-slate-900 text-white shadow-xl">
                <CardContent className="flex gap-4 p-4 items-center justify-center">
                    <a href='/dashboard' className='hover:underline font-extrabold text-xl hover:text-cyan-400'><Undo2 className="size-4" /></a>

                    <h2 className="text-lg font-semibold"><span className="font-bold bg-gradient-to-b from-orange-700 via-slate-200 to-green-600 text-transparent bg-clip-text">Travel Care Mode</span></h2>
                    <Switch
                        checked={transitMode}
                        onCheckedChange={setTransitMode}
                        className="ml-4"
                    />
                </CardContent>
            </Card>

            {transitMode && (
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Enter Departure location (e.g., Leh, Assam)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="text-black dark:text-white dark:bg-slate-700"
                        />
                        <Button onClick={handleFetchChecklist} className="cursor-pointer" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-1">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Loading...
                                </span>
                            ) : (
                                "Get Checklist"
                            )}
                        </Button>

                    </div>

                    {checklist && (
                        <div className="space-y-4 pb-2">
                            {Object.entries(checklist).map(([section, items]: any) => (
                                <Card key={section} className="bg-slate-800 text-white">
                                    <CardContent className="p-4">
                                        <h3 className="text-md font-bold mb-2 capitalize flex items-center gap-2">
                                            <span>{sectionIcons[section] || "📝"}</span>
                                            {section.replace(/([A-Z])/g, " $1").trim()}
                                        </h3>
                                        {renderItems(items)}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
