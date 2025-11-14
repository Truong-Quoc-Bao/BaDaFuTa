// merchant-dashboard.type.ts

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
  total_amount: number; // ✅ đổi từ total_price -> total_amount
  status: string | null; // hoặc enum: order_status | null
  payment_method: string | null; // hoặc enum: payment_method | null
  created_at: Date | null; // ✅ đổi từ createdAt -> created_at
}

export interface MerchantOverviewResponse extends MerchantOverviewStats {
  recentOrders: RecentOrder[];
}
