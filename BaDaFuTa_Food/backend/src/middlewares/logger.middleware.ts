// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { fail } from "@/utils/response"; // hoặc đường dẫn bạn đang dùng

export const validate =
  (schema: any, pick: "body" | "query" | "params" = "query") =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[pick]);
    if (!parsed.success) {
      return res.status(400).json(fail("Invalid input", "VALIDATION_ERROR"));
    }

    (req as any)[`validated_${pick}`] = parsed.data;
    next();
  };
