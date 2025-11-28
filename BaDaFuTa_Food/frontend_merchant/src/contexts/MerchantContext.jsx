import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner'; // <-- thêm import này
import { io } from 'socket.io-client';
const MerchantContext = createContext(undefined);
const socket = io('https://badafuta-production.up.railway.app', {
  transports: ['websocket'],
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

  useEffect(() => {
    // Nếu đã có merchantAuth, join room
    if (merchantAuth) {
      socket.emit('joinMerchant', merchantAuth.user_id);
    }

    // Hàm nhận đơn mới
    const handleNewOrder = (order) => {
      console.log('🔥 Đơn mới:', order);
      setOrders((prev) => [order, ...prev]);
      toast.success('🔥 Có đơn hàng mới!');
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
      socket.off('newOrder', handleNewOrder);
    };
  }, [merchantAuth]); // <-- thêm dependency để join room khi merchantAuth thay đổi

  // Load merchantAuth từ localStorage khi Provider mount
  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) setMerchantAuth(JSON.parse(stored));
  }, []);
  const socket = io('https://badafuta-production.up.railway.app', {
    transports: ['polling', 'websocket'], // thêm polling fallback
    secure: true,
  });

  // Load merchantAuth
  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) setMerchantAuth(JSON.parse(stored));
  }, []);

  // ✅ Fetch dashboard và lưu vào state
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/overview',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'be32facc-e24e-4429-9059-a1298498584f' }),
        },
      );
      const data = await response.json();
      setDashboardData(data); // lưu vào state
      console.log('Dashboard data:', data);
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
        'https://badafuta-production.up.railway.app/api/merchant/update-status',
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
