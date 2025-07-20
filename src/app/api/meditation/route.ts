import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { time, temperature, duration, level } = body;

    if (!time || !temperature || !duration || !level) {
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    const prompt = `
You are a certified AI meditation instructor designing a personalized **${level}** meditation session.

User Context:
- Time of Day: ${time}
- Weather: ${temperature}°C
- Duration: ${duration} minutes
- Experience Level: ${level}

🧘 Create a structured meditation session with the following JSON format:

{
  "intro": "Short, calming introduction for the user.",
  "steps": [
    "Step 1: Settle into a comfortable seated position...",
    "Step 2: Begin slow breathing...",
    ...
  ],
  "ambiance": "Recommended background sounds or setting (e.g., forest rain, soft wind, instrumental music).",
  "quote": "One motivational or mindfulness quote to end the session."
}

Guidelines:
- Tailor the tone to the level:
    - Beginner → calming, guided step-by-step instructions
    - Intermediate → deeper focus, light silence periods
    - Advanced → more introspective, breath-hold or visualization techniques
- If the time is **morning**, make it energizing and intention-setting.
- If **evening**, focus on relaxing, letting go, and preparing for rest.
- Keep instructions clear, warm, and supportive.
- Adjust based on weather: e.g., for cold weather suggest warming body scan, for hot weather suggest cool breath focus.

Return ONLY the valid JSON object.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Extract JSON object from response
    const jsonMatch = response.match(/{[\s\S]*}/);
    const meditationPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!meditationPlan) {
      return NextResponse.json({ error: "Failed to parse meditation plan" }, { status: 500 });
    }

    return NextResponse.json({ meditationPlan });
  } catch (error) {
    console.error("Meditation API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
