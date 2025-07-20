import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

export async function POST(req: NextRequest) {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
        return NextResponse.json({ error: "Coordinates missing" }, { status: 400 });
    }

    const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
        latitude,
        longitude,
        hourly: "temperature_2m",
        current: ["temperature_2m", "is_day"],
    });

    const response = responses[0];
    const utcOffset = response.utcOffsetSeconds();
    const current = response.current()!;
    const weather = {
        temperature: current.variables(0)!.value(),
        isDay: current.variables(1)!.value(),
        time: new Date((Number(current.time()) + utcOffset) * 1000),
    };

    return NextResponse.json(weather);
}
