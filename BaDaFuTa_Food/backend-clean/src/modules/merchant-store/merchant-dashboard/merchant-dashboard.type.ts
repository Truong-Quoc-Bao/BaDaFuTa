import { order_status, payment_method } from "@prisma/client";

export interface MerchantOverviewStats {
  totalRevenue: number;
  todayRevenue: number;
  todayOrders: number;
  pendingOrders: number;
  totalCustomers: number;
}

export interface RecentOrder {
  id: string;
  user_name: string;
  item_count: number;
  total_amount: number;
  status: order_status | null;
  payment_method: payment_method | null;
  created_at: Date | null;
}

export interface MerchantOverviewResponse extends MerchantOverviewStats {
  /** 🏪 Thông tin nhà hàng */
  merchant_id: string;
  merchantName: string;
  merchantPhone: string;

  /** 🧾 Danh sách 5 đơn gần nhất */
  recentOrders: RecentOrder[];
}
