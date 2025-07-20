"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Undo2, Search } from "lucide-react";
const firstAidData = [
    {
        title: "Heart Attack",
        steps: [
            "Call emergency services immediately — don't wait.",
            "Have the person sit down, rest, and stay calm.",
            "Loosen tight clothing to help with breathing.",
            "If not allergic, give them an aspirin (chewed) while waiting for help.",
            "Begin CPR if the person becomes unconscious and has no pulse."
        ]
    },
    {
        title: "CPR (Cardiopulmonary Resuscitation)",
        steps: [
            "Check for responsiveness and breathing.",
            "Call emergency services immediately.",
            "Begin chest compressions: 30 compressions at a rate of 100-120/min.",
            "Give 2 rescue breaths if trained, then continue compressions.",
            "Keep going until help arrives or the person recovers."
        ]
    },
    {
        title: "Burns",
        steps: [
            "Cool the burn with cool (not cold) water for 10-20 minutes.",
            "Remove tight items like rings or bracelets before swelling starts.",
            "Cover with a clean, non-stick bandage or cloth.",
            "Seek medical help for large or severe burns."
        ]
    },
    {
        title: "Fractures",
        steps: [
            "Keep the person still and calm.",
            "Immobilize the limb with a splint or sling if trained.",
            "Apply ice packs to reduce swelling.",
            "Seek emergency medical help."
        ]
    },
    {
        title: "Choking",
        steps: [
            "Ask the person to cough forcefully.",
            "If they can't speak or breathe, perform the Heimlich maneuver.",
            "Call emergency services if they lose consciousness.",
            "Begin CPR if trained and necessary."
        ]
    },
    {
        title: "Cuts & Wounds",
        steps: [
            "Apply pressure with a clean cloth to stop bleeding.",
            "Rinse with clean water and apply antiseptic.",
            "Cover with a sterile bandage.",
            "Seek help for deep or infected wounds."
        ]
    },
    
    {
        title: "Snake Bite",
        steps: [
            "Keep the person calm and still to slow the spread of venom.",
            "Keep the bitten area at or below heart level.",
            "Do not suck out venom or apply a tourniquet.",
            "Call emergency services immediately.",
            "Remove any tight clothing or jewelry near the bite."
        ]
    },
        
    {
        title: "Bee Sting",
        steps: [
            "Remove the stinger gently by scraping with a card or fingernail.",
            "Wash the area with soap and water.",
            "Apply a cold pack to reduce swelling.",
            "Take antihistamines if needed to reduce itching or swelling.",
            "Seek help if there are signs of a severe allergic reaction."
        ]
    }
];

export default function FirstAidGuide() {
    const [search, setSearch] = useState("");
    const pdfRef = useRef(null);

    const filteredGuides = firstAidData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownload = () => {
        const printWindow = window.open('', '_blank');
        const content = pdfRef.current;

        if (!content || !printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>First Aid Guide</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.4;
                    }
                    .card { 
                        border: 1px solid #ddd; 
                        border-radius: 8px; 
                        padding: 16px; 
                        margin-bottom: 16px; 
                        background: #fff9f5;
                        break-inside: avoid;
                    }
                    .title { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-bottom: 8px; 
                    }
                    ol { 
                        margin: 0; 
                        padding-left: 20px; 
                    }
                    li { 
                        margin-bottom: 4px; 
                        font-size: 14px;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 30px;
                    }
                    @media print {
                        body { margin: 0; }
                        .card { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>First Aid Guide</h1>
                ${filteredGuides.map(item => `
                    <div class="card">
                        <div class="title">${item.title}</div>
                        <ol>
                            ${item.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                `).join('')}
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-row items-center justify-center gap-4">
                <a href="/dashboard">
                    <Undo2 className="size-5 font-bold hover:text-cyan-400" />
                </a>
                <h1 className="text-xl font-bold">Aarogya's First Aid Guide</h1>
            </div>

            <Label className="mb-2">Search by condition</Label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g., CPR, Snake Bite, Bee Sting..."
                    className="pl-10"
                />
            </div>


            <div ref={pdfRef} className="grid gap-4 md:grid-cols-2">
                {filteredGuides.map((item, index) => (
                    <Card key={index} className=" p-4 bg-orange-50 dark:bg-gray-800/50">
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                                {item.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="text-center">
                <Button className="mt-4" onClick={handleDownload}>Print/Save as PDF</Button>
            </div>
        </div>
    );
}
