import { order_status, payment_method } from "@prisma/client";

export interface Order {
  id: string;
  user_name: string;
  item_count: number;
  total_amount: number;
  status: order_status | null;
  payment_method: payment_method | null;
  created_at: Date | null;
}
