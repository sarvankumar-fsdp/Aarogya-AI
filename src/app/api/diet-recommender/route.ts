import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chronicCondition, temperature, mealsPerDay, foodPreference } = body;

    if (!chronicCondition || !temperature || !mealsPerDay || !foodPreference) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const userMessage = `
Chronic Condition: ${chronicCondition}
Temperature: ${temperature}°C
Meals Per Day: ${mealsPerDay}
Food Preference: ${foodPreference}
`;

    const systemPrompt = `
You are a certified dietician and chronic illness expert.

Generate a **7-day Indian meal plan** customized for:

1. Chronic health condition: {{chronicCondition}}
2. Local temperature: {{temperature}}°C
3. Meals per day: {{mealsPerDay}} (structure meals accordingly)
4. Food preference: {{foodPreference}} (strictly follow this)

📝 Guidelines:
- Show each day from **Day 1 to Day 7**
- For each day, include:
  - 🌞 Morning (detox drinks / light start)
  - 🍳 Breakfast
  - 🥗 Mid-Morning Snack (optional if mealsPerDay < 4)
  - 🍱 Lunch
  - ☕ Evening Snack (optional if mealsPerDay < 4)
  - 🥣 Dinner

- Use **Indian meals**, suited for the selected condition.
- Use **cooling foods** if temperature > 30°C (e.g., cucumber, buttermilk)  
  Use **warming foods** if temp < 20°C (e.g., soups, millet, ghee)

- Respect the food preference:
  - If \`Vegetarian\`, do **not** include eggs, meat, or fish.
  - If \`Non-Vegetarian\`, limit red meat and prefer lean proteins like egg, chicken, fish.

- Avoid: processed sugar, excess sodium, red meat (especially for chronic cases).

🧘 End with a wellness tip:  
“AI Tip: Regular yoga, hydration, and sleep boost your recovery.”

✨ Respond in **pure JSON format ONLY** like:
{
  "plan": {
    "Day 1": {
      "🌞 Morning": "...",
      "🍳 Breakfast": "...",
      "🍱 Lunch": "...",
      "🥣 Dinner": "..."
    },
    ...
  },
  "wellnessTip": "..."
}
`;

    const chatCompletion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      top_p: 1,
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const responseText = chatCompletion.choices[0].message.content;

    // Extract JSON block if wrapped in code block
    const jsonMatch = responseText?.match(/```json([\s\S]*?)```/);
    const pureJson = jsonMatch ? jsonMatch[1].trim() : responseText;

    const parsed = JSON.parse(pureJson);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Diet Recommender Error:", error.message);
    return NextResponse.json(
      { error: "Failed to generate diet plan." },
      { status: 500 }
    );
  }
}
