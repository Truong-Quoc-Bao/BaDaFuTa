import { Request, Response } from "express";
import {
  CreateCODOrderSchema,
  GetOrderSchema,
  UpdateOrderSchema,
  UpdateRating,
} from "./order.validation";
import {
  orderService,
  getOrderService,
  updateOrderService,
  updateOrderStatus,
  cancelOrderStatus,
  orderRatingService,
} from "./order.service";

export const createCODOrder = async (req: Request, res: Response) => {
  try {
    const data = CreateCODOrderSchema.parse(req.body);

    // Service trả về JSON FULL như repo template
    const order = await orderService.createCODOrder(data);

    return res.status(201).json(order);
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

export async function getOrder(req: Request, res: Response) {
  try {
    // Validate body
    const filters = GetOrderSchema.parse(req.body);

    const orders = await getOrderService(filters);
    return res.status(200).json(orders);
  } catch (err: any) {
    console.error("❌ GetOrder Error:", err);
    return res.status(400).json({ error: err.errors ?? err.message });
  }
}
export const updateOrderBody = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params; // đổi từ id -> orderId cho khớp route
    const data = UpdateOrderSchema.parse(req.body);

    const result = await updateOrderService.updateOrderStatus(
      orderId,
      data,
      req.app.get("io")
    );

    return res.json(result);
  } catch (err: any) {
    console.error("❌ updateOrder error:", err);
    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ!",
        errors: err.errors,
      });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

export async function updateOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const result = await updateOrderStatus(orderId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}
export async function cancelOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const result = await cancelOrderStatus(orderId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export const updateRatingOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const data = UpdateRating.parse(req.body);

    const result = await orderRatingService.update(
      orderId,
      data,
      req.app.get("io")
    );

    return res.json(result);
  } catch (err: any) {
    console.error("ratingOrder error:", err);

    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ!",
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const createRatingOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const data = UpdateRating.parse(req.body);

    const result = await orderRatingService.create(
      orderId,
      data,
      req.app.get("io")
    );

    return res.json(result);
  } catch (err: any) {
    console.error("ratingOrder error:", err);

    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ!",
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getRatingOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await orderRatingService.get(orderId);
    return res.json(result);
  } catch (err: any) {
    console.error("lấy Rating lỗi:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Lỗi server!",
    });
  }
};

export const deleteRatingOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await orderRatingService.delete(orderId);
    return res.json(result);
  } catch (err: any) {
    console.error("lỗi xoá đánh giá:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Lỗi server!",
    });
  }
};
