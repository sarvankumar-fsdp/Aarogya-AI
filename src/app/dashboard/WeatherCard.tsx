"use client";

import { useEffect, useState } from "react";
import { Thermometer, Sun, Moon, CloudSun, Clock, Loader2 } from "lucide-react";

export default function WeatherCard() {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWeather = async () => {
            if (!navigator.geolocation) {
                setError("Geolocation not supported.");
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async ({ coords }) => {
                    try {
                        const res = await fetch("/api/weather", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                            }),
                        });
                        const data = await res.json();
                        if (res.ok) setWeather(data);
                        else setError(data.error || "Failed to fetch weather");
                    } catch (err) {
                        setError("Weather fetch error");
                    }
                    setLoading(false);
                },
                () => {
                    setError("Location access denied");
                    setLoading(false);
                }
            );
        };
        fetchWeather();
    }, []);

    return (
        <div className="bg-zinc-900 p-4 rounded-xl h-full outline-1 outline-zinc-600">
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-yellow-400" />
                Weather
            </h2>
            <div className="w-full border-t border-zinc-600 mb-4" />

            {loading ? (
                <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span className="text-sm">Fetching weather data...</span>
                </div>
            ) : error ? (
                <p className="text-red-400 text-sm">{error}</p>
            ) : (
                <div className="text-white text-lg md:text-xl space-y-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-cyan-300" />
                        <p>{weather.temperature?.toFixed(2)}°C</p>
                    </div>
                    <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {new Date(weather.time).toLocaleTimeString()}
                    </p>

                    <div className="flex items-center gap-2">
                        {weather.isDay ? (
                            <>
                                <Sun className="w-5 h-5 text-yellow-300" />
                                <p>Day time</p>
                            </>
                        ) : (
                            <>
                                <Moon className="w-5 h-5 text-indigo-300" />
                                <p>Night time</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
