// src/modules/users/user.service.ts
import bcrypt from "bcryptjs";
import * as userRepo from "./user.repository";
import { RegisterInput, LoginInput } from "./user.types";

function withCode(err: Error, code: string) {
  (err as any).code = code;
  return err;
}

export const register = async (data: RegisterInput) => {
  const email = (data.email || "").trim().toLowerCase();
  const phone = (data.phone || "").trim();
  const full_name = (data.full_name || "").trim();
  const plainPass = (data.password || "").trim();
  const role = (data.role as any) || "customer";

  // Tồn tại email/phone?
  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail)
    throw withCode(new Error("Email đã tồn tại"), "AUTH_EMAIL_EXISTS");

  const existingPhone = await userRepo.findByPhone(phone);
  if (existingPhone)
    throw withCode(new Error("Số điện thoại đã tồn tại"), "AUTH_PHONE_EXISTS");

  const hashedPassword = await bcrypt.hash(plainPass, 10);

  const user = await userRepo.create({
    full_name,
    email,
    phone,
    password: hashedPassword, // hiện đang dùng field 'password' để lưu hash
    role,
  } as any);

  return user;
};

export const login = async (data: LoginInput) => {
  const identifier = (data.identifier || "").trim();
  const plainPass = (data.password || "").trim();

  // Tìm theo email (lowercase) hoặc phone
  const user =
    (await userRepo.findByEmail(identifier.toLowerCase())) ||
    (await userRepo.findByPhone(identifier));

  if (!user)
    throw withCode(new Error("Tài khoản không tồn tại"), "AUTH_USER_NOT_FOUND");

  const hash = (user as any).password;
  if (!hash || typeof hash !== "string") {
    throw withCode(
      new Error("Tài khoản chưa có mật khẩu hợp lệ"),
      "AUTH_PASSWORD_MISSING"
    );
  }

  const valid = await bcrypt.compare(plainPass, hash);
  if (!valid)
    throw withCode(new Error("Mật khẩu không đúng"), "AUTH_WRONG_PASSWORD");

  return user;
};
