import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MerchantOrderCard } from '../components/MerchantOrderCard';
import { useMerchant } from '../contexts/MerchantContext';
import { Clock, Package, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function MerchantOrderManagementPage() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  // const { orders, updateOrderStatus, fetchOrders, autoConfirmEnabled, toggleAutoConfirm } =
  //   useMerchant();
  const {
    merchantAuth,
    dashboardData,
    orders,
    updateOrderStatus,
    autoConfirmEnabled,
    toggleAutoConfirm,
  } = useMerchant();

  console.log('Merchant Auth:', merchantAuth);
  console.log('Dashboard Data:', dashboardData);
  console.log('dashboardData hiện tại:', dashboardData);

  const allOrders = [
    ...(dashboardData?.data?.pendingOrderList || []),
    ...(dashboardData?.data?.confirmedOrdersList || []),
    ...(dashboardData?.data?.preparingOrdersList || []),
    ...(dashboardData?.data?.deliveringOrdersList || []),
    ...(dashboardData?.data?.completedOrdersList || []),
    ...(dashboardData?.data?.canceledOrdersList || []),
  ];

  const handleConfirmOrder = async () => {
    try {
      const response = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/update-status',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: order.userId, // hoặc order.user_id nếu đúng key trong order
            order_id: order.id,
            action: 'CONFIRMED',
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }

      const updatedOrder = await response.json();

      toast.success('Đã xác nhận đơn hàng');
      onStatusUpdate?.(order.id, 'CONFIRMED');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi xác nhận đơn hàng');
    }
  };

  // Filter orders based on tab and search
  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeTab) {
      case 'PENDING':
        return order.status === 'PENDING' && matchesSearch;
      case 'CONFIRMED':
        return order.status === 'CONFIRMED' && matchesSearch;
      case 'PREPARING':
        return order.status === 'PREPARING' && matchesSearch;
      case 'READY':
        return order.status === 'READY' && matchesSearch;
      case 'COMPLETED':
        return order.status === 'COMPLETED' && matchesSearch;
      case 'CANCELED':
        return order.status === 'CANCELED' && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const getTabCount = (status) => {
    switch (status) {
      case 'PENDING':
        return allOrders.filter((o) => o.status === 'PENDING').length;
      case 'CONFIRMED':
        return allOrders.filter((o) => o.status === 'CONFIRMED').length;
      case 'PREPARING':
        return allOrders.filter((o) => o.status === 'PREPARING').length;
      case 'READY':
        return allOrders.filter((o) => o.status === 'READY').length;
      case 'COMPLETED':
        return allOrders.filter((o) => o.status === 'COMPLETED').length;
      case 'CANCELED':
        return allOrders.filter((o) => o.status === 'CANCELED').length;
      default:
        return 0;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn hàng thành công`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  if (!dashboardData?.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2>Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">Quản lý và theo dõi tất cả đơn hàng của nhà hàng</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant={autoConfirmEnabled ? 'default' : 'outline'}
            onClick={toggleAutoConfirm}
            className="whitespace-nowrap w-max"
          >
            {autoConfirmEnabled ? 'Tắt tự động xác nhận' : 'Bật tự động xác nhận'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
                <p className="text-2xl font-bold">{getTabCount('PENDING')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đã xác nhận</p>
                <p className="text-2xl font-bold">{getTabCount('CONFIRMED')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đang chuẩn bị</p>
                <p className="text-2xl font-bold">{getTabCount('PREPARING')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sẵn sàng</p>
                <p className="text-2xl font-bold">{getTabCount('READY')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold">{getTabCount('COMPLETED')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đã hủy</p>
                <p className="text-2xl font-bold">{getTabCount('cancelled')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="PENDING" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">Chờ xác nhận</span>
            <span className="sm:hidden">Chờ</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('PENDING')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="CONFIRMED" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline">Đã xác nhận</span>
            <span className="sm:hidden">Xác nhận</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('CONFIRMED')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="PREPARING" className="flex items-center gap-2">
            <Package className="h-4 w-4 text-yellow-500" />
            <span className="hidden sm:inline">Đang chuẩn bị</span>
            <span className="sm:hidden">Chuẩn bị</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('PREPARING')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="READY" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline">Sẵn sàng</span>
            <span className="sm:hidden">Sẵn sàng</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('READY')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="COMPLETED" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="hidden sm:inline">Hoàn thành</span>
            <span className="sm:hidden">Xong</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('COMPLETED')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="CANCELED" className="flex items-center gap-2">
            <XCircle className="h-4 w-4  text-red-500" />
            <span className="hidden sm:inline">Đã hủy</span>
            <span className="sm:hidden">Hủy</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('CANCELED')}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELED'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="hover:scale-100">
                  <CardContent className="p-12 text-center">
                    <Package
                      className={`h-12 w-12 text-muted-foreground mx-auto mb-4 ${
                        status === 'PENDING'
                          ? 'text-red-500'
                          : status === 'CONFIRMED'
                          ? 'text-blue-500'
                          : status === 'PREPARING'
                          ? 'text-yellow-500'
                          : status === 'READY'
                          ? 'text-green-500'
                          : status === 'COMPLETED'
                          ? 'text-green-600'
                          : status === 'cancelled'
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <h3 className="text-lg font-semibold mb-2">Không có đơn hàng</h3>
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? 'Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm.'
                        : 'Chưa có đơn hàng nào trong trạng thái này.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredOrders.map((order) => (
                    <MerchantOrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
