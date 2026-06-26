import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export const db =
  globalThis.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
