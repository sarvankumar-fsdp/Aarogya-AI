import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message input' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      top_p: 1,
      max_completion_tokens: 600,
      stream: true,
      stop: null,
      messages: [
        {
          role: 'system',
          content: `
You are an expert AI medical assistant specializing in lab report explanations. When a user enters the results or abbreviations of any lab test (e.g. CBC, LFT, CRP, Hemoglobin), your task is to explain in very simple terms what those values may indicate.

Instructions:
- Break down the test components (e.g. "WBC", "Hb", "ALT", etc.) one by one.
- Mention if the value is generally high, low, or normal — *but do NOT diagnose*.
- Give simple, reassuring explanations and what it might mean (e.g. "Your WBC is slightly high, which could happen if your body is fighting an infection.")
- If a value is critically out of range, advise the user to consult a doctor.
- Never include medication or treatment suggestions.
- Avoid technical jargon; use plain English.
- Format your response in sections like:

Result(s):
- Hemoglobin: Low — this may suggest anemia or low iron levels.
- WBC: Normal — your immune response is within the usual range.

Note:
This explanation is general and not a substitute for professional medical advice. Always consult a certified doctor for final interpretation.
          `.trim(),
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const payload = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    }});
  } catch (err) {
    console.error('[LabTestExplainer API Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
