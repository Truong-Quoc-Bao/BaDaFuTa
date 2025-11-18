import {
  merchantDashboardRepository,
  merchantOrderRepository,
} from "./merchant-dashboard.repository";
import { MerchantOverviewResponse } from "./merchant-dashboard.type";

export const merchantDashboardService = {
  async getOverviewByUser(user_id: string): Promise<MerchantOverviewResponse> {
    //Lấy merchant_id
    const merchantId = await merchantDashboardRepository.findMerchantByUserId(
      user_id
    );
    if (!merchantId) {
      throw new Error("Không tìm thấy nhà hàng nào thuộc user này.");
    }

    //Lấy thông tin cơ bản của nhà hàng
    const merchantInfo = await merchantDashboardRepository.getMerchantInfo(
      merchantId
    );

    //Chuẩn bị mốc thời gian hôm nay (00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Lấy dữ liệu song song
    const [
      totalRevenue,
      todayRevenue,
      todayOrders,
      pendingOrders,
      totalCustomers,
      recentOrders,
      pendingOrderList,
      confirmedOrdersList,
      preparingOrdersList,
      deliveringOrdersList,
      completedOrdersList,
      canceledOrdersList,
    ] = await Promise.all([
      merchantDashboardRepository.getTotalRevenue(merchantId),
      merchantDashboardRepository.getTodayRevenue(merchantId, today),
      merchantDashboardRepository.countTodayOrders(merchantId, today),
      merchantDashboardRepository.countPendingOrders(merchantId),
      merchantDashboardRepository.countUniqueCustomers(merchantId),
      merchantDashboardRepository.getRecentOrders(merchantId),
      merchantOrderRepository.getPendingOrders(merchantId),
      merchantOrderRepository.getConfirmedOrders(merchantId),
      merchantOrderRepository.getPreparingOrders(merchantId),
      merchantOrderRepository.getDeliveringOrders(merchantId),
      merchantOrderRepository.getCompletedOrders(merchantId),
      merchantOrderRepository.getCanceledOrders(merchantId),
    ]);

    //Gộp dữ liệu trả về
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
      pendingOrderList,
      confirmedOrdersList,
      preparingOrdersList,
      deliveringOrdersList,
      completedOrdersList,
      canceledOrdersList,
    };

    return response;
  },
};
