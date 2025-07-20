import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const instruction = `
You are a professional AI skin health assistant. When a user uploads a photo of their skin, your job is to analyze the image and respond in a short, structured format with exactly three parts:

Condition  
Severity  
Care Advice

Your responses must follow this format:

Condition: <Most likely visible skin condition based on the image (e.g., acne, rash, eczema, fungal infection, pigmentation)>
Severity: <Assessment of severity level as one of the following — Mild, Moderate, or Severe>
Care Advice: <Basic and safe skincare tips relevant to the condition and severity — recommend hydration, gentle cleansers, avoiding triggers, or over-the-counter creams as appropriate>

important: Give all the Outputs Do not leave behind.

Rules:
- Do not diagnose with certainty — only suggest likely conditions.
- Do not prescribe any controlled or prescription-only medication.
- Do not mention brand names unless it’s an over-the-counter product.
- Use only simple and factual language.
- If severity is "Severe", suggest visiting a dermatologist.
- Must give a OTC Medine as a care advice
- Always give care advice as OTC Medicines.
- include extra explanations, warnings, or disclaimers even though not asked.
- Respond strictly in JSON Format only.
- Output must not include markdown formatting like triple backticks.
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

    if (text.startsWith("```")) {
      text = text.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
    }

    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
