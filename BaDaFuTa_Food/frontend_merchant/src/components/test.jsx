import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { OrderHistoryCard } from '../../components/OrderHistoryCard';
// import { ProtectedRoute } from "../components/ProtectedRoute";
import { ShoppingBag, Package2, X, Clock } from 'lucide-react';
import { orderHistory as initialOrderHistory } from '../../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@radix-ui/react-dialog';

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  // const [orders, setOrders] = useState(initialOrderHistory);
  // const [orders, setOrders] = useState([]);
  const [orders, setOrders] = useState([]); // ✅ KHỞI TẠO MẢNG RỖNG

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'PENDING');
  const { state: authState } = useAuth();
  const user = authState?.user;
  //state huỷ đơn
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // ✅ Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const hosts = ['/apiLocal/order/getOrder'];

    for (const host of hosts) {
      try {
        const token = localStorage.getItem('accessToken');

        const res = await fetch(host, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ user_id: user.id }),
        });

        if (!res.ok) throw new Error(`❌ Lỗi khi gọi ${host}`);
        const data = await res.json();

        const formattedOrders = Array.isArray(data.items)
          ? data.items.map((o) => ({ ...o, id: o.order_id }))
          : [{ ...data, id: data.order_id }];

        setOrders(formattedOrders);
        setLoading(false);
        return;
      } catch (err) {
        console.warn(err.message);
      }
    }

    setLoading(false);
    setError('Không thể tải dữ liệu đơn hàng.');
  }, [user]);

  // 🧩 Load orders khi component mount
  useEffect(() => {
    if (user === null) return; // chờ user load
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, fetchOrders]);

  useEffect(() => {
    if (location.state?.updatedOrder) {
      const updatedOrder = location.state.updatedOrder;
      setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    }
  }, [location.state?.updatedOrder]);

  // Khi nhấn nút Huỷ
  const handleOpenCancelDialog = (order) => {
    if (order.status === 'CONFIRMED') {
      alert('❌ Đơn hàng đã được xác nhận, không thể huỷ.');
      return;
    }
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    const order_id = orderToCancel.order_id;
    const oldStatus = orderToCancel.status;

    // ✅ Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.order_id === order_id ? { ...o, status: 'CANCELED' } : o)),
    );
    setShowCancelDialog(false);
    setOrderToCancel(null);
    setActiveTab('CANCELED'); // đổi tab ngay

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/apiLocal/order/${order_id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error('❌ Hủy đơn thất bại');

      console.log('✔ Đã hủy đơn:', order_id);
    } catch (err) {
      console.error('❌ Lỗi hủy đơn:', err);

      // rollback nếu lỗi
      setOrders((prev) =>
        prev.map((o) => (o.order_id === order_id ? { ...o, status: oldStatus } : o)),
      );
      alert('❌ Hủy đơn thất bại, vui lòng thử lại.');
    }
  };

  //Rating
  const handleRatingSubmit = (rating) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === rating.orderId
          ? {
              ...order,
              rating: rating.rating,
              review: rating.review,
              canRate: false,
            }
          : order,
      ),
    );
  };

  // 🧠 Lọc đơn hàng theo trạng thái
  const pendingOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'PENDING') : []),
    [orders],
  );

  const deliveredOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'COMPLETED') : []),
    [orders],
  );

  const shippingOrders = useMemo(
    () =>
      orders
        ? orders.filter((order) => order.status === 'DELIVERING' || order.status === 'CONFIRMED')
        : [],
    [orders],
  );

  const cancelledOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'CANCELED') : []),
    [orders],
  );

  //    const ratingOrders = useMemo(
  //     () => orders.fillter((order) => order.status === "rating"),
  //     [orders]
  //   );

  // console.log('📦 Orders:', data); // xem key của ID là gì

  const EmptyState = ({ type, icon: Icon, message }) => (
    <Card className="hover:scale-100">
      <CardContent className="text-center py-12">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">{message}</h3>
        <p className="text-gray-500 mb-6">
          {type === 'shipping' && 'Bạn chưa có đơn hàng nào đang được giao. Hãy đặt hàng ngay!'}
          {type === 'delivered' &&
            'Bạn chưa có đơn hàng nào đã mua. Khám phá các nhà hàng ngon ngay!'}
          {type === 'cancelled' && 'Bạn chưa có đơn hàng nào bị hủy. Thật tuyệt vời!'}
        </p>
        <Button variant="default" onClick={() => navigate('/')} className="w-max">
          Khám phá nhà hàng
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <p className="text-center py-10">Đang tải đơn hàng...</p>
      ) : error ? (
        <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center space-y-4 ">
          <svg
            className="animate-spin h-12 w-12 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <h3 className="text-red-600 font-semibold text-lg text-center">
            Không thể tải dữ liệu đơn hàng
          </h3>
          <p className="text-gray-500 text-sm text-center">
            Vui lòng kiểm tra kết nối mạng hoặc thử lại sau
          </p>
          <Button variant="default" onClick={fetchOrders}>
            Thử lại
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
            <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
          </div>
          {/* <Tabs defaultValue="DELIVERING" className="space-y-6"> */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="PENDING" className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Chờ xác nhận ({pendingOrders.length})</span>
              </TabsTrigger>

              <TabsTrigger value="DELIVERING" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Đang giao ({shippingOrders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" className="flex items-center space-x-2">
                <Package2 className="w-4 h-4" />
                <span>Đã giao ({deliveredOrders.length})</span>
              </TabsTrigger>
              <TabsTrigger value="CANCELED" className="flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Đã hủy ({cancelledOrders.length})</span>
              </TabsTrigger>
              {/* <TabsTrigger
            value="delivered"
            className="flex items-center space-x-2"
          >
            <Package2 className="w-4 h-4" />
            <span>Đánh giá ({ratingOrders.length})</span>
          </TabsTrigger> */}
            </TabsList>
            <TabsContent value="PENDING" className="space-y-4">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => (
                  <OrderHistoryCard
                    key={order.id}
                    order={order}
                    onRatingSubmit={handleRatingSubmit}
                    onCancel={handleOpenCancelDialog} // ✅ truyền hàm mở dialog
                  />
                ))
              ) : (
                <EmptyState
                  type="PENDING"
                  icon={ShoppingBag}
                  message="Chưa có đơn hàng chờ xác nhận"
                />
              )}
            </TabsContent>

            <TabsContent value="DELIVERING" className="space-y-4">
              {shippingOrders.length > 0 ? (
                shippingOrders.map((order) => (
                  <OrderHistoryCard
                    key={order.id}
                    order={order}
                    onRatingSubmit={handleRatingSubmit}
                  />
                ))
              ) : (
                <EmptyState type="DELIVERING" icon={Clock} message="Chưa có đơn hàng đang giao" />
              )}
            </TabsContent>

            <TabsContent value="COMPLETED" className="space-y-4">
              {deliveredOrders.length > 0 ? (
                deliveredOrders.map((order) => (
                  <OrderHistoryCard
                    key={order.id}
                    order={order}
                    onRatingSubmit={handleRatingSubmit}
                  />
                ))
              ) : (
                <EmptyState type="COMPLETED" icon={Package2} message="Chưa có đơn hàng mua" />
              )}
            </TabsContent>

            <TabsContent value="CANCELED" className="space-y-4">
              {cancelledOrders.length > 0 ? (
                cancelledOrders.map((order) => (
                  <OrderHistoryCard
                    key={order.id}
                    order={order}
                    onRatingSubmit={handleRatingSubmit}
                  />
                ))
              ) : (
                <EmptyState type="CANCELED" icon={X} message="Chưa có đơn hàng hủy" />
              )}
            </TabsContent>
          </Tabs>
          {showCancelDialog && orderToCancel && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/30" />
                <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                  <h3 className="text-lg mb-4">
                    Bạn có chắc muốn huỷ đơn gồm:{' '}
                    {orderToCancel.items.map((item, index) => (
                      <span key={index}>
                        <strong>{item.name_item}</strong>
                        {index < orderToCancel.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}{' '}
                    không?
                  </h3>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                      Huỷ
                    </Button>
                    <Button variant="default" className="w-max" onClick={handleCancelOrder}>
                      Xác nhận
                    </Button>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};
