import { merchantDashboardRepository } from "./merchant-dashboard.repository";
import { MerchantOverviewResponse } from "./merchant-dashboard.type";

export const merchantDashboardService = {
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

    // 3️⃣ Mốc thời gian hôm nay
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

    // 5️⃣ Trả response
    const response: MerchantOverviewResponse = {
      merchant_id: merchantInfo?.id ?? "",
      merchantName: merchantInfo?.merchant_name ?? "",
      merchantPhone: merchantInfo?.phone ?? "",

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
