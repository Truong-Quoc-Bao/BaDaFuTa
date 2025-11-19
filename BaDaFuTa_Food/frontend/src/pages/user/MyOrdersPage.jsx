import { useState, useEffect, useMemo } from 'react';
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
  const [ratingsLoaded, setRatingsLoaded] = useState(false);

  useEffect(() => {
    if (location.state?.updatedOrder) {
      const updatedOrder = location.state.updatedOrder;
      setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    }
  }, [location.state?.updatedOrder]);

  // 🧩 Gọi API lấy danh sách đơn hàng
  useEffect(() => {
    if (user === null) return; // Chờ user load từ context

    if (!user) {
      navigate('/login');
      return;
    }

    // Tạo body
    const orderBody = {
      user_id: user.id,
    };

    const fetchOrders = async () => {
      // const hosts = ['/apiLocal/order/getOrder'];
      const hosts = ['https://badafuta-production.up.railway.app/api/order/getOrder'];
      for (const host of hosts) {
        try {
          setLoading(true);
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
          console.log('📦 API trả về:', data);

          const formattedOrders = Array.isArray(data.items)
            ? data.items.map((o) => ({ ...o, id: o.order_id }))
            : [{ ...data, id: data.order_id }];

          setOrders(formattedOrders);
          // setOrders(data.orders);
          setOrders(Array.isArray(data) ? data : [data]);
          console.log('✅ Lấy dữ liệu đơn hàng từ:', host);
          return;
        } catch (err) {
          console.warn(err.message);
        } finally {
          setLoading(false);
        }
      }

      console.error('❌ Không thể lấy dữ liệu đơn hàng từ bất kỳ host nào');
      setError('Không thể tải dữ liệu đơn hàng.');
    };

    fetchOrders();
  }, [user]);

  // Khi nhấn nút Huỷ
  const handleOpenCancelDialog = (order) => {
    if (order.status === 'CONFIRMED') {
      alert('❌ Đơn hàng đã được xác nhận, không thể huỷ.');
      return;
    }
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  // Xác nhận hủy
  const handleConfirmCancel = () => {
    if (orderToCancel) handleCancelOrder(orderToCancel.order_id);
  };
  // Khi xác nhận huỷ
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

  // API Get Rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const res = await fetch(`/apiLocal/order/${order.order_id}/getRating`, {
              headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            if (!res.ok) return order; // không có đánh giá thì giữ nguyên
            const data = await res.json();

            const updatedOrder = {
              ...order,
              rating: data.data?.rating || null,
              review: data.data?.review || '',
              canRate: !data.data?.rating,
            };

            // ✅ Log review của từng order
            console.log(`Order ${order.order_id} review:`, updatedOrder.review);

            return updatedOrder;
          }),
        );

        setOrders(updatedOrders);
        setRatingsLoaded(true); // KHÓA lại, không cho effect chạy nữa
      } catch (err) {
        console.error('❌ Lỗi lấy đánh giá:', err);
      }
    };

    if (!ratingsLoaded && orders.length > 0) {
    fetchRatings();
  }
  }, [orders, ratingsLoaded]);

  //API Create Rating
  const handleCreateRating = async (orderId, ratingValue, reviewText) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/apiLocal/order/${orderId}/createRating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating: ratingValue, review: reviewText }),
      });
      if (!res.ok) throw new Error('❌ Tạo đánh giá thất bại');

      const data = await res.json();
      console.log('✔ Tạo đánh giá thành công:', data);

      // Cập nhật local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? { ...order, rating: ratingValue, review: reviewText, canRate: false }
            : order,
        ),
      );
    } catch (err) {
      console.error(err);
      alert('❌ Tạo đánh giá thất bại!');
    }
  };

  //Nút Rating
  const handleRatingSubmit = (newRating) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === newRating.orderId
          ? { ...order, rating: newRating.rating, review: newRating.review, canRate: false }
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

  // ⏳ Hiển thị khi đang tải hoặc lỗi
  if (loading) return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  //Giao diện chính
  return (
    // <ProtectedRoute>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {/* <Tabs defaultValue="DELIVERING" className="space-y-6"> */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full flex gap-2 overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-4 scrollbar-none ">
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
            <EmptyState type="PENDING" icon={ShoppingBag} message="Chưa có đơn hàng chờ xác nhận" />
          )}
        </TabsContent>

        <TabsContent value="DELIVERING" className="space-y-4">
          {shippingOrders.length > 0 ? (
            shippingOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
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
                onRatingSubmit={(newRating) =>
                  handleCreateRating(newRating.orderId, newRating.rating, newRating.review)
                }
                onCreateRating={handleCreateRating}
                onCancel={handleOpenCancelDialog}
              />
            ))
          ) : (
            <EmptyState type="COMPLETED" icon={Package2} message="Chưa có đơn hàng mua" />
          )}
        </TabsContent>

        <TabsContent value="CANCELED" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            cancelledOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
            ))
          ) : (
            <EmptyState type="CANCELED" icon={X} message="Chưa có đơn hàng hủy" />
          )}
        </TabsContent>
      </Tabs>
      {showCancelDialog && orderToCancel && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogPortal>
            {/* Overlay full màn hình, mờ */}
            <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />

            {/* Modal responsive */}
            <DialogContent className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold mb-4">Xác nhận huỷ đơn</h3>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                Bạn có chắc muốn huỷ đơn gồm:{' '}
                {orderToCancel.items.map((item, index) => (
                  <span key={index} className="whitespace-nowrap">
                    <strong>{item.name_item}</strong>
                    {index < orderToCancel.items.length - 1 ? ', ' : ''}
                  </span>
                ))}{' '}
                không?
              </p>

              {/* Nút hành động */}
              <div className="flex flex-row justify-center gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Huỷ
                </Button>
                <Button variant="default" className="flex-1" onClick={handleCancelOrder}>
                  Xác nhận
                </Button>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
    // </ProtectedRoute>
  );
};
