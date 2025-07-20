// app/api/quote/route.ts
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// 🧠 Memory cache (persists during server runtime)
let cachedQuote: { quote: string; author: string } | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS = 12 * 60 * 50 * 1000; // 12 hours

export async function GET() {
  const now = Date.now();

  // ✅ Return cached quote if within 12-hour window
  if (cachedQuote && lastFetchTime && now - lastFetchTime < CACHE_DURATION_MS) {
    return NextResponse.json(cachedQuote);
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert quote curator for a health and wellness AI platform named Aarogya.AI. Each day, you generate one motivational or insightful quote that relates to physical health, mental wellness, emotional balance, preventive care, or traditional Ayurvedic wisdom. Your tone should be calm, wise, and uplifting. Occasionally include quotes from philosophers, Ayurveda, yoga texts, or notable wellness thinkers globally. Ensure the quote is appropriate, short (1–2 lines), and emotionally resonant and given by globally recognized people.

Respond with only the quote and the author in strict JSON format like:
{
  "quote": "Your health is your real wealth.",
  "author": "Mahatma Gandhi"
}

Do not add any extra text or formatting. Output must be valid JSON.`
        },
        {
          role: "user",
          content: ""
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 512,
      top_p: 1,
      stream: false,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    // ✅ Save to cache
    cachedQuote = parsed;
    lastFetchTime = now;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("❌ Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch health quote. Try again later." },
      { status: 500 }
    );
  }
}
