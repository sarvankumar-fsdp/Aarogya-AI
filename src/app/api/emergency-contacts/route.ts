// /app/api/emergency-contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role required for server
);

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      console.log("📥 Incoming POST body:", body);
  
      const { user_id, name, phone, relation } = body;
  
      if (!user_id || !name || !phone || !relation) {
        console.error("❌ Missing required fields:", { user_id, name, phone, relation });
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
  
      console.log("✅ Attempting to insert:", { user_id, name, phone, relation });
  
      const { data, error } = await supabase.from("emergency_contacts").insert([
        { user_id, name, phone, relation },
      ]);
  
      if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ success: true, data });
    } catch (err: any) {
      console.error("💥 POST Crash:", err.message);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("💥 API Crash:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add this at the bottom of your route.ts file
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const { error } = await supabase
    .from("emergency_contacts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Delete Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
