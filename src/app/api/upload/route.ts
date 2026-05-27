import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BEEMATE_STORAGE_BUCKET, createSupabaseAdmin } from "@/lib/supabase/admin";

const MAX_BYTES = {
  avatars: 4 * 1024 * 1024,
  banners: 8 * 1024 * 1024,
} as const;

type UploadFolder = keyof typeof MAX_BYTES;

/**
 * Magic byte signatures for allowed image types.
 * Validates actual file content, not just the Content-Type header.
 */
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "image/gif": [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP starts with RIFF)
};

function validateMagicBytes(buffer: Buffer, declaredType: string): boolean {
  const signatures = MAGIC_BYTES[declaredType];
  if (!signatures) return false;

  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

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

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    const maxSize = MAX_BYTES[folder as UploadFolder];
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${folder === "avatars" ? "4MB" : "8MB"})` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Magic byte validation — ensure file content matches declared type
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match declared type" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const path = `${folder}/${session.user.id}-${Date.now()}.${safeExt}`;

    const supabase = createSupabaseAdmin();

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
