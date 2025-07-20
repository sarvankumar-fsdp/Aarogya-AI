import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { location } = await req.json();

    if (!location) {
      return NextResponse.json({ error: "Missing location" }, { status: 400 });
    }

    const prompt = `You are a military healthcare assistant. A soldier is being deployed to ${location}.Analyze the current weather status of ${location} and Generate a personalized travel health checklist including:

    1. Required immunizations
    2. Hydration tips
    3. Jet lag recovery tips
    4. Local disease precautions
    5. Packing essentials

    Respond strictly in JSON format with sections: immunizations, hydration, jetLag, precautions, packing.`;

    const chatCompletion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: "You are a helpful military healthcare assistant in India.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 2048,
    });

    const content = chatCompletion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from the model" },
        { status: 500 }
      );
    }

    // attempt to extract JSON from the response
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json(
        { error: "No valid JSON found in response" },
        { status: 500 }
      );
    }

    const jsonText = content.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("[JAWAN-MODE-API]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
