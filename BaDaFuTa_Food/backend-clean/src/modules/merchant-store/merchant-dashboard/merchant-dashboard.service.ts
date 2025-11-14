import { merchantDashboardRepository } from "./merchant-dashboard.repository";
import { MerchantOverviewResponse } from "./merchant-dashboard.type";

export const merchantDashboardService = {
  /** 🔹 Tổng hợp thống kê dashboard theo user_id */
  async getOverviewByUser(user_id: string): Promise<MerchantOverviewResponse> {
    // 1️⃣ Lấy merchant_id
    const merchantId = await merchantDashboardRepository.findMerchantByUserId(
      user_id
    );
    if (!merchantId) {
      throw new Error("Không tìm thấy nhà hàng nào thuộc user này.");
    }

    // 2️⃣ Lấy thông tin cơ bản của nhà hàng
    const merchantInfo = await merchantDashboardRepository.getMerchantInfo(
      merchantId
    );

    // 3️⃣ Chuẩn bị mốc thời gian hôm nay (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 4️⃣ Lấy dữ liệu song song
    const [
      totalRevenue,
      todayRevenue,
      todayOrders,
      pendingOrders,
      totalCustomers,
      recentOrders,
    ] = await Promise.all([
      merchantDashboardRepository.getTotalRevenue(merchantId),
      merchantDashboardRepository.getTodayRevenue(merchantId, today),
      merchantDashboardRepository.countTodayOrders(merchantId, today),
      merchantDashboardRepository.countPendingOrders(merchantId),
      merchantDashboardRepository.countUniqueCustomers(merchantId),
      merchantDashboardRepository.getRecentOrders(merchantId),
    ]);

    // 5️⃣ Gộp dữ liệu trả về
    const response: MerchantOverviewResponse = {
      merchant_id: merchantInfo?.id ?? "",
      merchantName: merchantInfo?.merchant_name ?? "",
      merchantPhone: merchantInfo?.phone ?? "",
      merchantOpenHours: merchantInfo?.time_open ?? null,

      totalRevenue,
      todayRevenue,
      todayOrders,
      pendingOrders,
      totalCustomers,
      recentOrders,
    };

    return response;
  },
};
