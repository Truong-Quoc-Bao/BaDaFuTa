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

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  // const [orders, setOrders] = useState(initialOrderHistory);
  // const [orders, setOrders] = useState([]);
  const [orders, setOrders] = useState([]); // ✅ KHỞI TẠO MẢNG RỖNG

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'DELIVERING');
  const { state: authState } = useAuth();
  const user = authState?.user;

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
      const hosts = ['/apiLocal/order/getOrder'];
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
        <TabsList className="grid w-full grid-cols-3">
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
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
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
    </div>
    // </ProtectedRoute>
  );
};
