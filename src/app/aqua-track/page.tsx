"use client";

import WaterForm from "./WaterForm";
import WaterChart from "./WaterChart";
import WaterTip from "./WaterTip";

export default function AquaTrackPage() {
    return (
        <main className="min-h-screen bg-black p-6 text-white">
            <WaterForm />
            <WaterChart />
            <WaterTip />
        </main>
    );
}
