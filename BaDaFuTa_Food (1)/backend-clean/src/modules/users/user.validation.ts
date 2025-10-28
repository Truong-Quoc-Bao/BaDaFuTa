// src/modules/users/user.validation.ts
import { z } from "zod";

/**
 * Regex họ tên: chỉ chữ (kể cả có dấu), số và khoảng trắng. Không ký tự đặc biệt.
 * ^[\p{L}\p{M}\d ]+$  (u flag để hỗ trợ Unicode)
 */
export const NameSchema = z
  .string()
  .trim()
  .min(2, "Họ tên tối thiểu 2 ký tự")
  .regex(
    /^[\p{L}\p{M}\d ]+$/u,
    "Họ tên chỉ gồm chữ, số và khoảng trắng (không dùng ký tự đặc biệt)"
  );

/**
 * Số điện thoại Việt Nam theo yêu cầu:
 * - đúng 10 chữ số
 * - bắt đầu bằng 0
 * - không cho phép 2 số 0 đầu tiên (tức là chữ số thứ 2 != 0)
 * - không cho phép '0000000000'
 */
const PHONE_REGEX = /^(?!0{10}$)0(?!0)\d{9}$/;
export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Số điện thoại chỉ gồm chữ số")
  .length(10, "Số điện thoại phải gồm 10 chữ số")
  .regex(PHONE_REGEX, "Số điện thoại không hợp lệ");

export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email không hợp lệ");

/**
 * Mật khẩu: tối thiểu 6 ký tự, phải có ít nhất 1 chữ và 1 số, chỉ chữ và số.
 */
export const PasswordSchema = z
  .string()
  .trim()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
    "Mật khẩu phải có chữ và số (chỉ chữ và số)"
  );

export const RoleSchema = z.enum(["customer", "merchant"]).default("customer");

// Đăng ký
export const RegisterSchema = z
  .object({
    full_name: NameSchema,
    email: EmailSchema,
    phone: PhoneSchema,
    password: PasswordSchema,
    confirm_password: z.string().optional(),
    role: RoleSchema,
  })
  .refine((d) => !d.confirm_password || d.password === d.confirm_password, {
    path: ["confirm_password"],
    message: "Mật khẩu xác nhận không khớp",
  })
  .strict();

// Đăng nhập: identifier có thể là email hoặc số điện thoại
export const LoginSchema = z
  .object({
    identifier: z.string().trim().min(3, "Thiếu email/số điện thoại"),
    password: z.string().trim().min(1, "Thiếu mật khẩu"),
  })
  .superRefine((d, ctx) => {
    const id = d.identifier;
    const isEmail = id.includes("@");
    if (isEmail) {
      const r = EmailSchema.safeParse(id);
      if (!r.success) {
        ctx.addIssue({
          path: ["identifier"],
          code: z.ZodIssueCode.custom,
          message: "Email không hợp lệ",
        });
      }
    } else {
      const r = PhoneSchema.safeParse(id);
      if (!r.success) {
        ctx.addIssue({
          path: ["identifier"],
          code: z.ZodIssueCode.custom,
          message: "Số điện thoại không hợp lệ",
        });
      }
    }
  });
