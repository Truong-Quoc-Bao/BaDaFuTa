import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner'; // <-- thêm import này
import { io } from 'socket.io-client';
const MerchantContext = createContext(undefined);

// =======================
// 🟢 Tạo socket 1 lần duy nhất
// =======================
// const socket = io('https://badafuta-production.up.railway.app', {
const socket = io('  https://badafuta.onrender.com', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  secure: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export function MerchantProvider({ children }) {
  const [merchantSettings, setMerchantSettings] = useState({
    restaurantId: 'rest-1',
    autoConfirmOrders: false,
    maxOrdersPerHour: 20,
    operatingHours: {
      open: '08:00',
      close: '22:00',
    },
  });

  const [merchantAuth, setMerchantAuth] = useState(null);
  const [orders, setOrders] = useState([]);
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);

  // =======================
  // 🔹 Load merchantAuth từ localStorage ngay khi mount
  // =======================
  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMerchantAuth(parsed);
    }
  }, []);

  // =======================
  // 🔹 Join socket room ngay khi có merchantAuth
  // =======================
  useEffect(() => {
    if (!merchantAuth?.user_id) return;

    // Join đúng room
    socket.emit('joinMerchant', merchantAuth.user_id);
    console.log('✅ Joined merchant room:', merchantAuth.user_id);

    // Lắng nghe đơn mới
    const handleNewOrder = (order) => {
      if (order.merchant_id !== merchantAuth.user_id) return;
      console.log('🔥 Đơn mới:', order);
      setOrders((prev) => [order, ...prev]);
      toast.success('🔥 Có đơn hàng mới!');
    };

    socket.on('newOrder', handleNewOrder);

    return () => socket.off('newOrder', handleNewOrder);
  }, [merchantAuth?.user_id]);

  // ✅ Fetch dashboard và lưu vào state
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(
        // 'https://badafuta-production.up.railway.app/api/merchant/overview',
        ' https://badafuta.onrender.com/api/merchant/overview',

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'a3364e3a-baa0-41d0-b8cf-783981650b25' }),
        },
      );
      const data = await response.json();
      setDashboardData(data); // lưu vào state
      console.log('Dashboard data:', data);

      // CHỈ SET ORDERS 1 LẦN DUY NHẤT TỪ API Ở ĐÂY
      if (data?.data) {
        const allOrders = [
          ...(data.data.pendingOrderList || []),
          ...(data.data.confirmedOrdersList || []),
          ...(data.data.preparingOrdersList || []),
          ...(data.data.deliveringOrdersList || []),
          ...(data.data.completedOrdersList || []),
          ...(data.data.canceledOrdersList || []),
        ];
        setOrders(allOrders); // ← Chỉ set 1 lần ở đây thôi!
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  }, []);

  // Gọi fetchDashboard khi Provider mount
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ===========================================
  // MerchantContext.jsx

  const updateOrderStatus = async (orderId, status, reason) => {
    try {
      const response = await fetch(
        // 'https://badafuta-production.up.railway.app/api/merchant/update-status',
        ' https://badafuta.onrender.com/api/merchant/update-status',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'be32facc-e24e-4429-9059-a1298498584f', // <- thử trực tiếp
            order_id: orderId,
            action: status,
            reason: reason || '',
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Cập nhật thất bại');
      }

      const updatedOrder = await response.json();

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status, notes: reason || o.notes } : o)),
      );

      return updatedOrder;
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Có lỗi khi cập nhật đơn hàng');
    }
  };

  const updateMerchantSettings = (newSettings) =>
    setMerchantSettings((prev) => ({ ...prev, ...newSettings }));

  const cancelOrder = (orderId, reason) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', notes: reason } : o)),
    );

  const toggleAutoConfirm = useCallback(() => {
    setMerchantSettings((prev) => ({
      ...prev,
      autoConfirmOrders: !prev.autoConfirmOrders,
    }));
  }, []);

  const logout = useCallback(() => {
    setMerchantAuth(null);
    localStorage.removeItem('merchantAuth');
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        merchantSettings,
        updateMerchantSettings,
        orders,
        setOrders, // thêm dòng này
        updateOrderStatus,
        cancelOrder,
        autoConfirmEnabled: merchantSettings.autoConfirmOrders,
        toggleAutoConfirm,
        merchantAuth,
        logout,
        dashboardData, // <- thêm dashboardData vào context
        fetchDashboard,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  const context = useContext(MerchantContext);
  if (!context) throw new Error('useMerchant must be used within a MerchantProvider');
  return context;
}
