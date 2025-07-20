import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Use service role key here
);

export async function POST(req: NextRequest) {
  try {
    const { user_id, intake } = await req.json();

    if (!user_id || intake === undefined) {
      return NextResponse.json(
        { error: "Missing user_id or intake" },
        { status: 400 }
      );
    }

    // Upsert the intake value for this user
    const { data, error } = await supabase
      .from("water_logs")
      .upsert({ user_id, intake })
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      console.error("❌ Upsert Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("💥 POST Error:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user_id)

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("💥 API Crash:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
