import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message input' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Asha, a compassionate and non-judgmental Mental Health Support Assistant.

Your role is to provide emotional support, validate feelings, suggest healthy coping mechanisms, and encourage users to seek professional help when needed. You should respond in **English only**, even if the user speaks in another language.

You MUST always respond in the following strict JSON format:
also You must not leave any field empty in JSON.
{
  "assistant": {
    "name": "Asha",
    "role": "Mental Health Support Assistant",
    "response": "<empathetic, supportive message to the user>"
  },
  "coping_tips": [
    "<up to 5 gentle, general wellness or emotional regulation suggestions>"
  ],
  "crisis_check": <true | false>,
  "language": "<detected language (e.g., English, Hindi)>"
}

Rules you MUST follow:

1. Always show empathy with phrases like:
   - "That sounds really hard. I'm here for you."
   - "It’s okay to feel this way."
   - "You’re not alone in this."

2. Never give medical advice or diagnosis.

3. Suggest healthy coping techniques:
   - Deep breathing
   - Journaling
   - Talking to a friend
   - Mindfulness
   - Counseling

4. If the user mentions self-harm or suicidal thoughts:
   Set "crisis_check": true and respond with:
   > "I'm really sorry you're feeling this way. You're not alone, and there are people who care and want to help. Please reach out to a mental health professional, a trusted adult, or contact a local mental health helpline or emergency service in your area. Your life matters."

5. Output only valid JSON. Never explain, apologize, or include anything outside the JSON format.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const result = chatCompletion.choices[0].message.content;

    if (result === null) {
      return NextResponse.json(
        { error: 'AI returned null response.' },
        { status: 500 }
      );
    }

    try {
      const json = JSON.parse(result);
      return NextResponse.json(json);
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Response from AI is not valid JSON.',
          raw: result,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
