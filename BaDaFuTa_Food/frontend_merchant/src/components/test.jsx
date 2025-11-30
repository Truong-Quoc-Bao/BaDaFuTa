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
// MerchantContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

const MerchantContext = createContext(undefined);

// **Tạo socket 1 lần duy nhất**
const socket = io('https://badafuta-production.up.railway.app', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  secure: true,
});

export function MerchantProvider({ children }) {
  const [merchantAuth, setMerchantAuth] = useState(null);
  const [orders, setOrders] = useState([]);
  const [merchantSettings, setMerchantSettings] = useState({
    autoConfirmOrders: false,
    maxOrdersPerHour: 20,
    operatingHours: { open: '08:00', close: '22:00' },
  });
  const [dashboardData, setDashboardData] = useState(null);

  // Load merchantAuth từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('merchantAuth');
    if (stored) setMerchantAuth(JSON.parse(stored));
  }, []);

  // Join merchant room và lắng nghe đơn mới
  useEffect(() => {
    if (!merchantAuth) return;

    // Join đúng room
    socket.emit('joinMerchant', merchantAuth.user_id);

    // Lắng nghe đơn mới
    const handleNewOrder = (order) => {
      if (order.merchant_id !== merchantAuth.user_id) return;
      console.log('🔥 Đơn mới:', order);
      setOrders((prev) => [order, ...prev]);
      toast.success('🔥 Có đơn hàng mới!');
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
      socket.off('newOrder', handleNewOrder);
    };
  }, [merchantAuth]);

  // Fetch dashboard
  const fetchDashboard = useCallback(async () => {
    if (!merchantAuth) return;
    try {
      const res = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/overview',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: merchantAuth.user_id }),
        }
      );
      const data = await res.json();
      setDashboardData(data);
      console.log('Dashboard:', data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  }, [merchantAuth]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Cập nhật trạng thái đơn
  const updateOrderStatus = async (orderId, status, reason) => {
    if (!merchantAuth) return;
    try {
      const res = await fetch(
        'https://badafuta-production.up.railway.app/api/merchant/update-status',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: merchantAuth.user_id,
            order_id: orderId,
            action: status,
            reason: reason || '',
          }),
        }
      );
      if (!res.ok) throw new Error('Cập nhật thất bại');
      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status, notes: reason || o.notes } : o
        )
      );
      return updatedOrder;
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Có lỗi khi cập nhật đơn hàng');
    }
  };

  const toggleAutoConfirm = () =>
    setMerchantSettings((prev) => ({
      ...prev,
      autoConfirmOrders: !prev.autoConfirmOrders,
    }));

  const logout = () => {
    setMerchantAuth(null);
    localStorage.removeItem('merchantAuth');
  };

  return (
    <MerchantContext.Provider
      value={{
        merchantAuth,
        orders,
        merchantSettings,
        updateOrderStatus,
        toggleAutoConfirm,
        dashboardData,
        fetchDashboard,
        logout,
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
