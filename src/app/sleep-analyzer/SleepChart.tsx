"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface SleepData {
    date: string;
    hours: number;
}

export default function SleepChart() {
    const { user } = useUser();
    const userId = user?.id;

    const [data, setData] = useState<SleepData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/sleep-details?user_id=${userId}`);
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const json = await res.json();
                if (json.error) throw new Error(json.error);
                setData(json.data || []);
            } catch (err: any) {
                console.error("Sleep Chart Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: "Sleep Hours",
                data: data.map((d) => d.hours),
                borderColor: "rgba(255, 255, 255, 0.9)",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white",
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "white" },
                grid: { color: "#444" },
            },
            y: {
                ticks: { color: "white" },
                grid: { color: "#444" },
                suggestedMin: 0,
                suggestedMax: 10,
            },
        },
    };

    return (
        <div className="w-full max-w-4xl h-[400px] mx-auto bg-zinc-900 p-4 rounded-xl mt-4 shadow-lg">
            {loading ? (
                <div className="flex justify-center items-center h-full text-blue-300 gap-2">
                    <Loader2 className="animate-spin w-6 h-6" />
                    Loading sleep data...
                </div>
            ) : error ? (
                <div className="text-red-500 text-center font-semibold">{error}</div>
            ) : data.length === 0 ? (
                <div className="text-white text-center font-medium">No sleep data logged yet. 💤</div>
            ) : (
                <Line data={chartData} options={chartOptions} />
            )}
        </div>
    );
}
