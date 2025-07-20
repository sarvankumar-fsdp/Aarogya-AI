import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { user_id, date, intake } = await req.json();

    const { data, error } = await supabase
      .from("water_logs")
      .insert([{ user_id, date, intake }]);

    if (error) {
      console.error("❌ Insert Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("💥 POST Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const date = searchParams.get("date");

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    let query = supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user_id);

    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Fetch Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("💥 GET Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
