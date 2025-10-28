import { Request, Response, NextFunction } from "express";

export function bigIntJsonMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const sendJson = res.json.bind(res);
  (res as any).json = (data: any) => {
    const body = JSON.stringify(data, (_k, v) =>
      typeof v === "bigint" ? v.toString() : v
    );
    res.setHeader("Content-Type", "application/json");
    return res.send(body);
  };
  next();
}
