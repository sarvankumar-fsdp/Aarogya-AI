// app/api/my-hospitals/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "0");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") || "0");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  // 0.02 degree approx = 2-3km radius
  const delta = 0.02;
  const south = lat - delta;
  const north = lat + delta;
  const west = lng - delta;
  const east = lng + delta;

  const query = `
    [out:json];
    node["amenity"="hospital"](${south},${west},${north},${east});
    out;
  `.trim();

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const res = await fetch(url, {
      method: "POST",
      body: query,
    });
    const data = await res.json();

    return NextResponse.json(data.elements || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hospital data" }, { status: 500 });
  }
}
