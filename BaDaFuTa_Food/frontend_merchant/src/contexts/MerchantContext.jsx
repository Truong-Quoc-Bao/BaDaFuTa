import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MerchantContext = createContext(undefined);

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

  // Load merchantAuth
  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) setMerchantAuth(JSON.parse(stored));
  }, []);

  // ✅ Fetch dashboard và lưu vào state
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch('https://badafuta-production.up.railway.app/api/merchant/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'be32facc-e24e-4429-9059-a1298498584f' }),
      });
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
  }, []);

  // ================= WebSocket =================
  useEffect(() => {
    if (!merchantAuth) return;

    const ws = new WebSocket('ws://localhost:3000/ws/merchant'); // endpoint WebSocket backend

    ws.onopen = () => {
      console.log('WebSocket connected for merchant dashboard');
      // Có thể gửi thông tin nhận dạng nhà hàng
      ws.send(JSON.stringify({ type: 'subscribe', restaurantId: merchantAuth.restaurantId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WS message:', message);

      if (message.type === 'newOrder') {
        // Cập nhật recentOrders và các stats
        setDashboardData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            todayOrders: prev.data.todayOrders + 1,
            pendingOrders: prev.data.pendingOrders + 1,
            totalRevenue: prev.data.totalRevenue + message.data.total_amount,
            todayRevenue: prev.data.todayRevenue + message.data.total_amount,
            recentOrders: [message.data, ...prev.data.recentOrders],
          },
        }));
      }

      if (message.type === 'orderUpdated') {
        // Cập nhật trạng thái đơn
        setDashboardData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            recentOrders: prev.data.recentOrders.map((o) =>
              o.id === message.data.id ? { ...o, status: message.data.status } : o,
            ),
            pendingOrders:
              message.data.status.toLowerCase() === 'completed'
                ? prev.data.pendingOrders - 1
                : prev.data.pendingOrders,
          },
        }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);

    return () => ws.close();
  }, [merchantAuth]);
  // ===========================================

  const updateMerchantSettings = (newSettings) =>
    setMerchantSettings((prev) => ({ ...prev, ...newSettings }));

  const updateOrderStatus = (orderId, status) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

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
