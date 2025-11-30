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

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const MerchantContext = createContext(undefined);

export function MerchantProvider({ children }) {
  const [merchantSettings, setMerchantSettings] = useState({
    restaurantId: 'rest-1',
    autoConfirmOrders: false,
    maxOrdersPerHour: 20,
    operatingHours: { open: '08:00', close: '22:00' },
  });

  const [merchantAuth, setMerchantAuth] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) setMerchantAuth(JSON.parse(stored));
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/overview',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 'be32facc-e24e-4429-9059-a1298498584f' }),
        }
      );
      const data = await response.json();
      setDashboardData(data);
      setOrders(data?.data?.recentOrders || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // WebSocket để tự động cập nhật
  useEffect(() => {
    if (!merchantAuth) return;
    const ws = new WebSocket('ws://localhost:3000/ws/merchant');

    ws.onopen = () => {
      console.log('WebSocket connected for merchant dashboard');
      ws.send(JSON.stringify({ type: 'subscribe', restaurantId: merchantAuth.restaurantId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'newOrder') {
        setOrders(prev => [message.data, ...prev]);
        setDashboardData(prev => ({
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
        setOrders(prev =>
          prev.map(o => (o.id === message.data.id ? { ...o, status: message.data.status } : o))
        );
      }
    };

    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = err => console.error('WebSocket error:', err);

    return () => ws.close();
  }, [merchantAuth]);

  // ================= API update order =================
  const updateOrderStatus = async (orderId, status, reason) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) throw new Error('Order not found');

      const response = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/update-status',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: order.userId || order.user_id,
            order_id: orderId,
            action: status,
            reason: reason || '',
          }),
        }
      );

      if (!response.ok) throw new Error('Cập nhật thất bại');

      const updatedOrder = await response.json();

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: status, notes: reason || o.notes } : o))
      );

      toast.success(`Đơn hàng ${status} thành công`);
      return updatedOrder;
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  const cancelOrder = (orderId, reason) => updateOrderStatus(orderId, 'CANCELED', reason);

  const toggleAutoConfirm = useCallback(() => {
    setMerchantSettings(prev => ({ ...prev, autoConfirmOrders: !prev.autoConfirmOrders }));
  }, []);

  const logout = useCallback(() => {
    setMerchantAuth(null);
    localStorage.removeItem('merchantAuth');
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        merchantSettings,
        updateMerchantSettings: newSettings => setMerchantSettings(prev => ({ ...prev, ...newSettings })),
        orders,
        updateOrderStatus,
        cancelOrder,
        autoConfirmEnabled: merchantSettings.autoConfirmOrders,
        toggleAutoConfirm,
        merchantAuth,
        logout,
        dashboardData,
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




//
//
<MerchantOrderCard
  key={order.id}
  order={order}
  onStatusUpdate={handleStatusUpdate}
  onOrderConfirmed={() => {
    if (window.voiceInterval) {
      clearInterval(window.voiceInterval);
      window.voiceInterval = null;
      window.speechSynthesis.cancel();
    }
  }}
/>