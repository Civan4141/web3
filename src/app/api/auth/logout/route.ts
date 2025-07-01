import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-auth", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return response;
}
