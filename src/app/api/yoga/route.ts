import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { time, temperature, duration, plan } = body;

    if (!time || !temperature || !duration || !plan) {
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    const prompt = `
You are a certified AI yoga instructor creating personalized **${plan}** yoga routines.

User inputs:
- Plan Level: ${plan}
- Time of Day: ${time}
- Temperature: ${temperature}°C
- Session Duration: ${duration} minutes

Based on these, design a safe, ${plan}-level yoga session that fits exactly within the requested duration. If the temperature is high (>35°C), avoid strenuous postures and suggest cooling, slow poses. If it's morning, focus on energizing poses; in the evening, suggest calming/stretching routines.

Return the yoga plan as a JSON array like this:

[
  {
    "name": "Sukhasana (Easy Pose)",
    "duration": "2 minutes",
    "steps": [
      "Sit cross-legged on the mat with a straight spine.",
      "Rest your hands on knees, palms facing up.",
      "Close your eyes and take deep breaths.",
      "Hold the position for 2 minutes."
    ],
    "benefit": "Calms the mind and opens the hips."
  },
  ...
]

⚠️ Important Guidelines:
- Total duration of all asanas combined must be add to ${duration} minutes.
- Each asana must have a "duration" field.
- Use only ${plan}-level poses: 
    - beginner → very gentle and foundational
    - intermediate → more flow-based but still accessible
    - advanced → challenging postures like arm balances or deep stretches
- Provide clear, 3–5 step instructions for each asana.
- Include a direct image URL for visual reference.
- End with gentle breathing or savasana if time allows.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const jsonMatch = response.match(/\[\s*{[\s\S]*?}\s*]/);
    const yogaPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!yogaPlan) {
      return NextResponse.json({ error: "Failed to parse yoga plan" }, { status: 500 });
    }

    return NextResponse.json({ yogaPlan });
  } catch (error) {
    console.error("Yoga API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
