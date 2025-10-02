import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type so we can attach `prisma` safely
declare global {
   
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
