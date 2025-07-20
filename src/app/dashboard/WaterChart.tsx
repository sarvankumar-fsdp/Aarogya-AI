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

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

interface WaterData {
    date: string;
    intake: number;
}

export default function WaterChart() {
    const { user } = useUser();
    const userId = user?.id;

    const [data, setData] = useState<WaterData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/water-logs/history?user_id=${userId}`);
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const json = await res.json();
                if (json.error) throw new Error(json.error);

                const aggregated: Record<string, number> = {};

                json.data.forEach((entry: any) => {
                    if (aggregated[entry.date]) {
                        aggregated[entry.date] += entry.intake;
                    } else {
                        aggregated[entry.date] = entry.intake;
                    }
                });

                const aggregatedData: WaterData[] = Object.keys(aggregated).map((date) => ({
                    date,
                    intake: aggregated[date],
                }));

                setData(aggregatedData);
            } catch (err: any) {
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
                label: "Water Intake (ml)",
                data: data.map((d) => d.intake),
                borderColor: "rgba(96, 165, 250, 1)", // blue-400
                backgroundColor: "rgba(96, 165, 250, 0.3)",
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { labels: { color: "white" } },
        },
        scales: {
            x: { ticks: { color: "white" }, grid: { color: "#444" } },
            y: {
                ticks: { color: "white" },
                grid: { color: "#444" },
                suggestedMin: 0,
                suggestedMax: 4000,
            },
        },
    };

    return (
        <div className="w-full max-w-4xl h-[400px] mx-auto bg-zinc-900 p-4 rounded-xl shadow-lg">
            {loading ? (
                <div className="flex justify-center items-center h-full text-blue-400 gap-2">
                    <Loader2 className="animate-spin w-6 h-6" />
                    Loading water intake data...
                </div>
            ) : error ? (
                <div className="text-red-500 text-center font-semibold">{error}</div>
            ) : data.length === 0 ? (
                <div className="text-white text-center font-medium">
                    No water intake data logged yet.
                </div>
            ) : (
                <Line data={chartData} options={chartOptions} />
            )}
        </div>
    );
}
