import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { name, logo_url } = await req.json();
  const { error } = await supabase
    .from("company_info")
    .upsert({ id: 1, name, logo_url }, { onConflict: "id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabase
    .from("company_info")
    .select("name, logo_url")
    .eq("id", 1)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
