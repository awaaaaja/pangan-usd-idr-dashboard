import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ??
  // @ts-ignore
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

