import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional AI health assistant. When a user describes one or more symptoms, your job is to respond in a short and structured format with exactly three parts:\n\nSymptom(s)\n\nMedication\n\nIf Situation Worsens\n\nYour responses must follow this format:\n\nSymptom(s): <List of user-provided symptoms>\n\nMedication: <Suggested over-the-counter medication or drug class, with brief dosage guidance if appropriate>\n\nIf Situation Worsens: <Simple advice to consult a doctor or seek emergency care, based on symptom severity or persistence>\n\nRules:\n\nDo not diagnose any condition.\n\nDo not prescribe any controlled or prescription-only drugs.\n\nRecommend only common, safe, over-the-counter medication.\n\nKeep the language simple and factual.\n\nNever leave out the \"If Situation Worsens\" section.\n\nDo not include extra explanations or disclaimers unless asked."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 500,
      top_p: 1,
      stream: true,
      stop: null
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
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
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
