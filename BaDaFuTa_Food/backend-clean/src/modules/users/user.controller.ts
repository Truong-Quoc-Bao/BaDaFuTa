// src/modules/users/user.controller.ts
import { Request, Response } from "express";
import * as userService from "./user.service";
import { RegisterSchema, LoginSchema } from "./user.validation";

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await userService.register(data);
    res.status(201).json({ success: true, data: user });
  } catch (e: any) {
    const code = e.code || (e.errors ? "VALIDATION_ERROR" : "AUTH_UNKNOWN");
    const status =
      code === "AUTH_EMAIL_EXISTS" || code === "AUTH_PHONE_EXISTS"
        ? 409
        : code === "VALIDATION_ERROR"
        ? 400
        : 500;
    res.status(status).json({
      success: false,
      error_code: code,
      error: e.message || "Đăng ký thất bại",
      issues: e.errors,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = await userService.login(data);
    // TODO: phát JWT nếu cần
    res.json({ success: true, user, token: "token_here" });
  } catch (e: any) {
    const code = e.code || (e.errors ? "VALIDATION_ERROR" : "AUTH_UNKNOWN");
    const status =
      code === "AUTH_USER_NOT_FOUND"
        ? 404
        : code === "AUTH_WRONG_PASSWORD"
        ? 401
        : code === "VALIDATION_ERROR"
        ? 400
        : 500;
    res.status(status).json({
      success: false,
      error_code: code,
      error: e.message || "Đăng nhập thất bại",
      issues: e.errors,
    });
  }
};
