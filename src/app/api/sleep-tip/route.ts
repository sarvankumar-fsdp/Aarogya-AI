import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { user_id } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sleep_analyzer")
    .select("hours")
    .eq("user_id", user_id)
    .eq("date", today)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No sleep data found for today." }, { status: 404 });
  }

  const hours = data.hours;

  const systemPrompt = `
You are a helpful and concise sleep wellness advisor.

Based on how many hours the user slept last night, give 3 short, personalized sleep improvement tips.

Rules:
- Each tip must be no more than 25 words
- Tips should be practical, friendly, and avoid repeating the exact sleep hours
- Tips should be listed as bullet points (using hyphens)
- Adjust tone:
  • If sleep is under 6 hours – encourage improvement
  • If sleep is between 6–8 hours – support and suggest consistency
  • If over 9 hours – mention balance and rest quality

Avoid questions. Do not ask follow-ups. Just give the 3 tips.
`;

  const prompt = `I slept ${hours} hours last night. Give me 3 short sleep tips.`;

  const chatCompletion = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 1,
    max_completion_tokens: 512,
    top_p: 1,
    stream: true,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
