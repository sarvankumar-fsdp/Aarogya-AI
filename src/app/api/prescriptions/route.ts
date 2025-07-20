import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ✅ POST: Upload a prescription file to Supabase Storage and store metadata
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const file = formData.get("file") as File;

    if (!title || !date || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("prescription-files")
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (uploadError || !uploadData) {
      console.error("Upload Error:", uploadError);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Store file_path only (not public URL)
    const filePath = uploadData.path;

    const { data: insertData, error: insertError } = await supabase
      .from("prescriptions")
      .insert([{ 
        title, 
        date, 
        file_path: filePath,
        user_id: userId 
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to store metadata" }, { status: 500 });
    }

    return NextResponse.json({ message: "Prescription uploaded", data: insertData });
  } catch (err: any) {
    console.error("POST Error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

// ✅ GET: Fetch user's prescriptions with signed URLs
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: prescriptions, error } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error);
      return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
    }

    // Generate signed URLs for each file_path
    const signedPrescriptions = await Promise.all(
      prescriptions.map(async (prescription) => {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("prescription-files")
          .createSignedUrl(prescription.file_path, 60 * 60); // 1 hour expiry

        return {
          ...prescription,
          signed_url: signedUrlData?.signedUrl ?? null,
        };
      })
    );

    return NextResponse.json(signedPrescriptions);
  } catch (err: any) {
    console.error("GET Error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

// ✅ DELETE: Remove both file and record
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing prescription ID" }, { status: 400 });
    }

    const { data: prescription, error: fetchError } = await supabase
      .from("prescriptions")
      .select("file_path")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    const filePath = prescription.file_path;

    const { error: storageError } = await supabase.storage
      .from("prescription-files")
      .remove([filePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }

    const { error: deleteError } = await supabase
      .from("prescriptions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("DB delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }

    return NextResponse.json({ message: "Prescription deleted successfully" });
  } catch (err: any) {
    console.error("DELETE Error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
