import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { createAdminSession, createCustomerSession } from "@/lib/auth-server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    role?: "customer" | "admin";
    email?: string;
    password?: string;
  };

  const role = body.role ?? "customer";

  if (role === "admin") {
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "admin123";

    if (!body.password || body.password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({
      user: {
        id: "admin",
        name: "Store Admin",
        email: "admin@sokokenya.co.ke",
        role: "admin",
      },
    });
  }

  const prisma = await getPrisma();
  if (!prisma?.user?.findUnique) {
    return NextResponse.json(
      { error: "Database connection is required for customer login." },
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
