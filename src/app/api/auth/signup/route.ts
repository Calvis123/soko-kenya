import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { createCustomerSession } from "@/lib/auth-server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const prisma = await getPrisma();
  if (!prisma?.user?.findUnique || !prisma.user.create) {
    return NextResponse.json(
      { error: "Database connection is required for signup." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Name, email, and a password of at least 6 characters are required." },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "customer",
    },
  });

  await createCustomerSession(user);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "customer",
    },
  });
}
