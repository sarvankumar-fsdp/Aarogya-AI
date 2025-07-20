import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const instruction = `
You are a certified AI dermatological assistant trained to visually detect signs of anemia based on nail appearance.

When a user uploads a nail image, analyze it and respond in **strict JSON format** with exactly three keys:

1. condition: <Describe any visible signs related to anemia: e.g., "Pale Nails", "Koilonychia", or "Healthy">
2. severity: <One of: "Mild", "Moderate", or "Severe">
3. advice: <Give one short medical suggestion (e.g., "Possible iron-deficiency anemia. Please consult a physician.")>

Rules:
- Respond only in clean JSON. No markdown or extra text.
- If the nail is unclear, say "Unclear" for condition.
- Focus only on nail symptoms commonly linked with anemia.
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
