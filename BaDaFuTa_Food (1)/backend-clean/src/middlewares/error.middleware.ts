import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: err.flatten() });
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 unique, P2025 not found, v.v.
    const code = err.code;
    const status = code === "P2002" ? 409 : code === "P2025" ? 404 : 400;
    return res
      .status(status)
      .json({ error: "PrismaError", code, meta: err.meta });
  }

  // Prisma validation at client side
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json({ error: "PrismaValidationError", message: err.message });
  }

  // Log chi tiết cho dev
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
