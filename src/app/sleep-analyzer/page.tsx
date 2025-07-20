"use client";

import { useState } from "react";
import SleepForm from "./SleepForm";
import SleepChart from "./SleepChart";
import SleepTip from "./SleepTip";

export default function SleepAnalyzerPage() {
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="max-w-xl dark mx-auto p-6 text-white">
            <SleepForm />
            <SleepChart key={refresh.toString()} />
            <SleepTip/>
        </div>
    );
}