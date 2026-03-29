import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type AppPrismaClient = PrismaClient;

declare global {
  var prisma: AppPrismaClient | undefined;
}

export async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!global.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    global.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return global.prisma;
}
