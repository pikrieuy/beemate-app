import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BEEMATE_STORAGE_BUCKET, createSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_BYTES = {
  avatars: 4 * 1024 * 1024,
  banners: 8 * 1024 * 1024,
} as const;

type UploadFolder = keyof typeof MAX_BYTES;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File) || typeof folder !== "string") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
    }

    if (folder !== "avatars" && folder !== "banners") {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const maxSize = MAX_BYTES[folder as UploadFolder];
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${folder === "avatars" ? "4MB" : "8MB"})` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const path = `${folder}/${session.user.id}-${Date.now()}.${safeExt}`;

    const supabase = createSupabaseAdmin();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BEEMATE_STORAGE_BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Upload failed" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BEEMATE_STORAGE_BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
