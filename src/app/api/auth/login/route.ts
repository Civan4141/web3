import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  // Admini bul
  const { data, error } = await supabase
    .from("admins")
    .select("id, username, password_hash, role")
    .eq("username", username)
    .single();
  if (error || !data) {
    return NextResponse.json({ success: false, error: "Kullanıcı bulunamadı." }, { status: 401 });
  }
  // Şifreyi kontrol et
  const match = await bcrypt.compare(password, data.password_hash);
  if (!match) {
    return NextResponse.json({ success: false, error: "Şifre hatalı." }, { status: 401 });
  }
  // Giriş başarılıysa cookie set et
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-auth", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 saat
  });
  return response;
}
