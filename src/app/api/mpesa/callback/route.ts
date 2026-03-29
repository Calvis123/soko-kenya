import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json({
    received: true,
    payload,
    message: "Persist this callback to your orders table when Prisma is wired.",
  });
}
