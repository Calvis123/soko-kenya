import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createUserSession } from "@/lib/auth-server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const prisma = await getPrisma();
  if (!prisma?.user?.findUnique) {
    return NextResponse.json(
      { error: "Database connection is required for login." },
      { status: 500 },
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "No account found with that email." },
      { status: 404 },
    );
  }

  const matches = await compare(body.password, user.passwordHash);
  if (!matches) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  await createUserSession(user);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "admin" : "customer",
    },
  });
}
