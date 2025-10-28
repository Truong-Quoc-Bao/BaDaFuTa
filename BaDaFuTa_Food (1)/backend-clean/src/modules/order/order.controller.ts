import { Request, Response } from "express";
import { CreateCODOrderSchema } from "./order.validation";
import { orderService } from "./order.service";

export const createCODOrder = async (req: Request, res: Response) => {
  try {
    //Validate body
    const data = CreateCODOrderSchema.parse(req.body);

    // Gọi service
    const order = await orderService.createCODOrder(data);

    // kết quả
    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      order_id: order.id,
      payment_method: order.payment_method,
      status_payment: order.status_payment,
      total_amount: order.total_amount,
      status: order.status,
    });
  } catch (err: any) {
    console.error("Create COD Order Error:", err);

    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: err.errors,
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "User hoặc Merchant không tồn tại (vi phạm khóa ngoại)",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng COD",
    });
  }
};
