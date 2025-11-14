import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingBag, DollarSign, Clock, TrendingUp, Users, Star } from 'lucide-react';
import { useMerchant } from '../contexts/MerchantContext';

export function MerchantOverviewPage() {
  // const { merchantAuth, orders = [] } = useMerchant();
  const { merchantAuth, dashboardData } = useMerchant();

  console.log('Merchant Auth:', merchantAuth);
  console.log('Dashboard Data:', dashboardData);
  console.log('dashboardData hiện tại:', dashboardData);

  const todayRevenue = dashboardData?.data?.todayRevenue || 0;
  const todayOrders = dashboardData?.data?.todayOrders || 0;
  const pendingOrders = dashboardData?.data?.pendingOrders || 0;
  const totalRevenue = dashboardData?.data?.totalRevenue || 0;
  const totalCustomers = dashboardData?.data?.totalCustomers || 0;
  const recentOrders = dashboardData?.data?.recentOrders || [];

  const completedOrders = recentOrders.filter(
    (order) => order.status?.toLowerCase() === 'COMPLETED',
  ).length;

  const averageRating = 4.5; // Mock rating
  // const totalCustomers = 234; // Mock customer count

  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: `${todayRevenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Đơn hàng hôm nay',
      // value: todayOrders.length.toString(),
      value: todayOrders.toString(), // ✅

      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Đơn chờ xử lý',
      value: pendingOrders.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Tổng doanh thu',
      value: `${totalRevenue.toLocaleString('vi-VN')}đ`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Khách hàng',
      value: totalCustomers.toString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Đánh giá trung bình',
      value: `${averageRating}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  // const recentOrders = orders.slice(0, 5);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'preparing':
        return 'secondary';
      case 'delivering':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'preparing':
        return 'Đang chuẩn bị';
      case 'delivering':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  if (!dashboardData?.data) {
    return <p>Đang tải dữ liệu dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h2>Chào mừng trở lại!</h2>
        <p className="text-gray-600 mt-1">
          Tổng quan hoạt động kinh doanh của {merchantAuth?.restaurantName || 'nhà hàng'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="hover:scale-100">
        <CardHeader>
          <CardTitle>Đơn hàng gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium">#{order.id}</p>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.user_name || 'Khách hàng'} • {order.item_count} món
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total_amount.toLocaleString('vi-VN')}đ</p>
                    <p className="text-sm text-gray-600">Tiền mặt</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:scale-100">
          <CardHeader>
            <CardTitle>Hoạt động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium">Thêm món ăn mới</p>
              <p className="text-sm text-gray-600">Cập nhật thực đơn của bạn</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium">Tạo nhóm topping</p>
              <p className="text-sm text-gray-600">Quản lý tùy chọn món ăn</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium">Xem báo cáo</p>
              <p className="text-sm text-gray-600">Phân tích doanh thu</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="font-medium text-orange-800">Đơn hàng mới</p>
              <p className="text-sm text-orange-600">Bạn có {pendingOrders} đơn hàng chờ xử lý</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-800">Doanh thu tăng</p>
              <p className="text-sm text-blue-600">Doanh thu hôm nay tăng 15% so với hôm qua</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
