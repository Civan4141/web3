import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css/animate.min.css";
import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@supabase/supabase-js";
import Navbar from "./components/Navbar";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  let title = "Yükleniyor...";
  let logoUrl: string | undefined = undefined;
  try {
    const { data } = await supabase
      .from("company_info")
      .select("name, logo_url")
      .eq("id", 1)
      .single();
    if (data && data.name) title = data.name;
    if (data && data.logo_url) logoUrl = data.logo_url;
  } catch {}
  return {
    title,
    description: "QR kod tabanlı randevu sistemi.",
    icons: logoUrl ? [{ rel: "icon", url: logoUrl }] : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head />
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
