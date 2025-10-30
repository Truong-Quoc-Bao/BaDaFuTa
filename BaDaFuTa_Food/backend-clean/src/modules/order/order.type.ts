import { z } from "zod";
import { CreateCODOrderSchema } from "./order.validation";

/**
 * Kiểu dữ liệu đầu vào cho API tạo đơn hàng COD
 * Dựa theo schema đã validate bằng Zod
 */
export type CreateCODOrderInput = z.infer<typeof CreateCODOrderSchema>;

/**
 * Kiểu dữ liệu cho từng món trong đơn hàng
 * Giúp controller / repository dễ hiểu rõ cấu trúc item
 */
export type OrderItemInput = {
  menu_item_id: string;
  quantity: number;
  price: number;
  note?: string | null;
};

/**
 * Kiểu dữ liệu trả về (Response) khi tạo đơn hàng COD
 * Giúp frontend biết order_id và trạng thái thanh toán
 */
export type CreateCODOrderResponse = {
  success: boolean;
  message: string;
  order_id: string;
  payment_method: string;
  payment_status: string;
  total: number;
};

/**
 * Enum hỗ trợ trong logic xử lý trạng thái
 * Có thể dùng chung cho cả COD / VNPAY / MOMO
 */
export enum PaymentMethod {
  COD = "COD",
  VNPAY = "VNPAY",
  MOMO = "MOMO",
}

export enum PaymentStatus {
  PENDING = "pending",
  UNPAID = "unpaid",
  PAID = "paid",
  FAILED = "failed",
}

/**
 * ✅ Kiểu dữ liệu tổng hợp (nếu bạn muốn truyền giữa service ↔ repository)
 */
export interface OrderCreateData {
  user_id: string;
  merchant_id: string;
  delivery_address: string; // hoặc { text, lat, lng } nếu bạn dùng dạng object JSON
  delivery_fee: number;
  payment_method: PaymentMethod;
  payment_status?: PaymentStatus;
  items: OrderItemInput[];
}
