import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const instruction = `
You are a certified AI nutritionist. When a user uploads a photo of food, analyze the image and respond in a **strict JSON format** with exactly three keys:

1. items: <A list of 2–5 detected food items from the image. Keep names simple and common, e.g., "Paneer Butter Masala", "Chapati", "Green Salad".>
2. calories: <Estimated total calorie count of the food shown. Round to the nearest 10 kcal.>
3. advice: <One short nutritional suggestion based on the type of food (e.g., high carbs, low protein, oily, fiber-rich).>

Rules:
- DO NOT add any headers like "JSON Output".
- Do not use brand names or specific products.
- If unsure about food type, say "Unclear" or skip.
- Format must be clean, strict JSON.
- Do not use markdown or triple backticks.
- Keep 'items' to real-world foods only.
`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      instruction,
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image,
        },
      },
    ]);

    let text = result.response.text().trim();

    // Remove markdown if it sneaks in
    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
    }

    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (error: any) {
    console.error("Calorie Analyzer error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
