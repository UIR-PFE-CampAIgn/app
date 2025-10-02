import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

if (process.env.NODE_ENV !== "production") (global as any).prisma = prisma;
