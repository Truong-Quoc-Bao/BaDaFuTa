// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["warn", "error"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/libs/prisma.ts
import { PrismaClient } from "@prisma/client";
declare global {
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
