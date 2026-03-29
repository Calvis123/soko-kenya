import { NextResponse } from "next/server";
import { clearSessionCookies } from "@/lib/auth-server";

export async function POST() {
  await clearSessionCookies();
  return NextResponse.json({ success: true });
}
