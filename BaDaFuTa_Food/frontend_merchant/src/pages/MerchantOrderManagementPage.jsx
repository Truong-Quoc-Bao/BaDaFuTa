import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MerchantOrderCard } from '../components/MerchantOrderCard';
import { useMerchant } from '../contexts/MerchantContext';
import { Clock, Package, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

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
    setOrders,
  } = useMerchant();

  const socketRef = useRef(null);
  // Init orders từ dashboardData
  // useEffect(() => {
  //   if (dashboardData?.data && orders.length === 0) {
  //     const initialOrders = [
  //       ...(dashboardData.data.pendingOrderList || []),
  //       ...(dashboardData.data.confirmedOrdersList || []),
  //       ...(dashboardData.data.preparingOrdersList || []),
  //       ...(dashboardData.data.deliveringOrdersList || []),
  //       ...(dashboardData.data.completedOrdersList || []),
  //       ...(dashboardData.data.canceledOrdersList || []),
  //     ];
  //     setOrders(initialOrders);
  //   }
  // }, [dashboardData, orders.length, setOrders]);

  useEffect(() => {
    const merchantId = '00ea6129-7f16-4376-925f-d1eab34037fa'; // hardcode tạm

    const socket = io('https://badafuta-production.up.railway.app', {
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
    });

    socket.emit('joinMerchant', merchantId);

    socket.on('connect', () => {
      console.log('✅ Connected merchant socket:', socket.id);
    });

    socket.on('newOrder', (rawOrder) => {
      console.log('Nhận order realtime:', rawOrder);

      // Chuẩn hóa dữ liệu để giống hệt với dashboardData
      const newOrder = {
        ...rawOrder,
        id: rawOrder.order_id,
        order_id: rawOrder.order_id,
        status: 'PENDING', // BẮT BUỘC
        customerName: rawOrder.customerName || 'Khách vãng lai',
        created_at: new Date().toISOString(),
        total_amount:
          rawOrder.delivery_fee +
          (rawOrder.items || []).reduce((sum, item) => {
            const optionPrice = (item.selected_option_items || []).reduce(
              (s, opt) => s + (opt.price || 0),
              0,
            );
            return sum + (item.price + optionPrice) * item.quantity;
          }, 0),
      };

      // Thêm vào đầu danh sách, tránh duplicate
      setOrders((prev) => {
        if (prev.some((o) => o.order_id === newOrder.order_id)) return prev;
        return [newOrder, ...prev];
      });

      // Thông báo + chuyển tab
      toast.success('Đơn hàng mới đến!', {
        description: `#${newOrder.order_id.slice(-6).toUpperCase()} • ${newOrder.customerName}`,
        duration: 8000,
      });
      toast.success(`Đơn mới #${newOrder.order_id.slice(-6).toUpperCase()}`, {
        description: `${newOrder.customerName} • ${newOrder.items.length} món • ${newOrder.payment_method}`,
        duration: 8000,
        action: {
          label: 'Xem ngay',
          onClick: () => setActiveTab('PENDING'),
        },
      });

      // ======== ÂM THANH + GIỌNG NÓI LẶP LẠI CHO ĐẾN KHI XÁC NHẬN ========
      // Biến toàn cục để kiểm soát việc lặp
      window.voiceInterval = null; // ← thêm window.

      const speakNewOrder = () => {
        // Dừng nếu đang lặp
        if (voiceInterval) clearInterval(voiceInterval);

        // Phát giọng nói lần đầu
        const msg = new SpeechSynthesisUtterance('Bạn có đơn hàng mới từ Ba Đa Phu Ta Phút!');
        msg.lang = 'vi-VN'; // giọng tiếng Việt
        msg.volume = 2; // to nhất
        msg.rate = 1; // tốc độ nói tự nhiên
        msg.pitch = 1.2; // cao một chút cho dễ nghe

        window.speechSynthesis.speak(msg);

        // Lặp lại mỗi 6 giây cho đến khi bấm xác nhận
        window.voiceInterval = setInterval(() => {
          window.speechSynthesis.speak(msg);
        }, 6000);
      };

      // GỌI HÀM KHI CÓ ĐƠN MỚI
      speakNewOrder();

      // Tự động chuyển về tab chờ xác nhận + focus vào đơn mới nhất
      setActiveTab('PENDING');
      // Tự động chuyển về tab Chờ xác nhận
      setActiveTab('PENDING');
    });

    return () => socket.disconnect();
  }, [setOrders]);

  console.log('Merchant Auth:', merchantAuth);
  console.log('Dashboard Data:', dashboardData);
  console.log('dashboardData hiện tại:', dashboardData);

  // Dùng orders làm nguồn dữ liệu duy nhất
  const allOrders = orders;

  // Filter orders based on tab and search
  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      `${order.order_id ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customerName ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase());

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
