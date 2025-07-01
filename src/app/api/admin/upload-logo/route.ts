import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = [
  "image/png",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/jpeg",
  "image/jpg",
];
const ALLOWED_EXTS = ["png", "ico", "jpg", "jpeg"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  if (
    !fileExt ||
    !ALLOWED_EXTS.includes(fileExt) ||
    !ALLOWED_TYPES.includes(file.type)
  ) {
    return NextResponse.json(
      { error: "Sadece PNG, ICO veya JPG/JPEG dosyası yükleyebilirsiniz." },
      { status: 400 }
    );
  }
  const fileName = `logo_${Date.now()}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(fileName, new Uint8Array(arrayBuffer), {
      contentType: file.type,
      upsert: true,
    });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(
    fileName
  );
  return NextResponse.json({ url: publicUrl.publicUrl });
}
