import { payment_method } from "@prisma/client";
import { z } from "zod";

export const CreateCODOrderSchema = z.object({
  user_id: z.string().uuid({ message: "user_id không hợp lệ" }),
  merchant_id: z.string().uuid({ message: "merchant_id không hợp lệ" }),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ"),
  delivery_address: z.string().trim().min(5, "Địa chỉ quá ngắn"),
  delivery_fee: z.coerce.number().int().nonnegative().default(0),
  note: z.string().nullable().optional(),
  payment_method: z.enum(["COD", "VNPAY", "MOMO"]).default("COD"),
  items: z
    .array(
      z.object({
        menu_item_id: z.string().uuid({ message: "menu_item_id không hợp lệ" }),
        quantity: z.coerce.number().int().positive({ message: "Số lượng > 0" }),
        price: z.coerce.number().nonnegative(),
        note: z.string().nullable().optional(),
        selected_option_items: z
          .array(z.string().uuid())
          .optional()
          .default([]),
      })
    )
    .min(1, "Phải có ít nhất 1 món trong đơn hàng"),
});

export const GetOrderSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  merchant_id: z.string().uuid().optional(),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ").optional(),
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "DELIVERING",
      "COMPLETED",
      "CANCELED",
    ])
    .optional(),
  status_payment: z
    .enum(["PENDING", "SUCCESS", "FAILED", "CANCELED", "REFUNDED"])
    .optional(),
  payment_method: z.enum(["COD", "VNPAY", "MOMO", "STRIPE"]).optional(),
});

export const UpdateOrderSchema = z
  .object({
    status: z
      .enum([
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "DELIVERING",
        "COMPLETED",
        "CANCELED",
      ])
      .optional(),
    status_payment: z
      .enum(["PENDING", "SUCCESS", "FAILED", "CANCELED", "REFUNDED"])
      .optional(),
  })
  .refine(
    (data) => data.status !== undefined || data.status_payment !== undefined,
    {
      message:
        "Yêu cầu phải có ít nhất 1 trong 2 trường: status hoặc status_payment",
      path: ["status"],
    }
  );
