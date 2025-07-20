import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid medicine name provided' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a medical AI assistant designed to provide safe, accurate, and user-friendly information about medicines.

The user will enter a **medicine name**. Based on that, respond ONLY in **valid JSON format** using the following schema:

{
  "medicine": "name of the medicine (as entered by the user)",
  "use_for": "brief explanation of what conditions this medicine treats",
  "dosage_and_usage": "typical dosage, frequency, and how to take it",
  "long_term_side_effects": "potential side effects from prolonged or chronic use",
  "precautions": "who should avoid it, allergy warnings, interactions, etc.",
  "note": "any special warnings or advice, such as when to consult a doctor"
}

Important:
- DO NOT recommend off-label uses unless medically recognized.
- Be concise but informative.
- If the medicine is not found, return this:
{
  "error": "Medicine not found. Please check the spelling or try a different name."
}

Output only the JSON. Do not add any explanation or markdown.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from Groq' }, { status: 500 });
    }

    try {
      const parsedJSON = JSON.parse(content);
      return NextResponse.json(parsedJSON);
    } catch (err) {
      return NextResponse.json({ error: 'Failed to parse Groq response as JSON', raw: content }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong', details: err }, { status: 500 });
  }
}