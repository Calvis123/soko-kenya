import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
};

const SESSION_TOKEN_COOKIE = "session-token";
const SESSION_ROLE_COOKIE = "session-role";
const SESSION_NAME_COOKIE = "session-name";
const SESSION_EMAIL_COOKIE = "session-email";
const ADMIN_SESSION_COOKIE = "admin-session";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const prisma = await getPrisma();
  if (!prisma?.session?.findUnique) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role === "admin" ? "admin" : "customer",
  };
}

export async function requireAdminUser() {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export async function requireCustomerUser() {
  const user = await getCurrentUser();
  return user?.role === "customer" ? user : null;
}

export async function createUserSession(user: {
  id: string;
  name: string;
  email: string;
  role?: string;
}) {
  const prisma = await getPrisma();
  if (!prisma?.session?.create) {
    throw new Error("Database connection is required for user sessions.");
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_ROLE_COOKIE, user.role === "admin" ? "admin" : "customer", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_NAME_COOKIE, user.name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_EMAIL_COOKIE, user.email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;
  const prisma = await getPrisma();

  if (token && prisma?.session?.deleteMany) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  for (const name of [
    SESSION_TOKEN_COOKIE,
    SESSION_ROLE_COOKIE,
    SESSION_NAME_COOKIE,
    SESSION_EMAIL_COOKIE,
    ADMIN_SESSION_COOKIE,
  ]) {
    cookieStore.set(name, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
  }
}
