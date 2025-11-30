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
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  Edit,
  Plus,
  Edit3,
  Ticket,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useCart } from '../../contexts/CartContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { getDistanceKm, calculateDeliveryFee } from '../../utils/distanceUtils';
import { CashIcon, VnPayIcon, MomoIcon } from '../../components/PaymentIcons';
import PopupVoucher from '@/components/VoucherDialog';
import { io } from 'socket.io-client';

export default function CheckOutPage() {
  const socketRef = useRef(null);
  const { state: authState } = useAuth();
  const user = authState.user;
  const navigate = useNavigate();
  const location = useLocation();
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [voucherPopup, setVoucherPopup] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    note: '',
    utensils: false,
  });
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [loading, setLoading] = useState(false);

  const merchant =
    state.items.length > 0 ? state.items[0].restaurant || state.items[0].merchant : null;
  const restaurantLat = merchant?.lat;
  const restaurantLon = merchant?.lng;
  const deliveryLat = selectedAddress?.lat;
  const deliveryLon = selectedAddress?.lng;

  let distanceKm = 0;
  let deliveryFee = 0;

  if (merchant && selectedAddress) {
    distanceKm = getDistanceKm(merchant.lat, merchant.lng, selectedAddress.lat, selectedAddress.lng);
    deliveryFee = calculateDeliveryFee(distanceKm);
  }

  const subtotal = state.total;
  const discountAmount = selectedVoucher ? calculateVoucherDiscount() : 0;
  const finalTotal = subtotal + deliveryFee - discountAmount;

  // ================= WebSocket =================
  useEffect(() => {
    if (!merchant?.id) return;

    socketRef.current = io('https://badafuta-production.up.railway.app', {
      transports: ['websocket'],
      path: '/socket.io',
    });

    socketRef.current.emit('registerMerchant', merchant.id);

    socketRef.current.on('newOrder', (order) => {
      console.log('🔥 Nhận đơn mới:', order);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [merchant?.id]);

  // ================= Address & GPS =================
  useEffect(() => {
    if (!user) return;

    const savedAddresses = JSON.parse(localStorage.getItem(`addressList_${user.id}`)) || [];
    setAddressList(savedAddresses);

    const defaultAddress = {
      id: Date.now(),
      full_name: user?.full_name ?? 'Người dùng',
      phone: user?.phone ?? '',
      address: '',
      note: '',
      utensils: false,
    };

    const fetchAddress = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        );
        const data = await res.json();
        const gpsAddress = { ...defaultAddress, address: data.display_name || '' };
        setFormData(gpsAddress);
        setSelectedAddress(gpsAddress);
      } catch (err) {
        setFormData(defaultAddress);
        setSelectedAddress(defaultAddress);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAddress(pos.coords.latitude, pos.coords.longitude),
        () => setSelectedAddress(defaultAddress),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setSelectedAddress(defaultAddress);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const savedSelected = JSON.parse(localStorage.getItem(`selectedAddress_${user.id}`));
    if (savedSelected) {
      setSelectedAddress(savedSelected);
      setFormData(savedSelected);
    }
  }, [user]);

  // ================= Countdown COD =================
  useEffect(() => {
    if (!showConfirmPopup || countdown === 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showConfirmPopup, countdown]);

  useEffect(() => {
    if (countdown === 0 && showConfirmPopup) {
      handleCreateOrder();
      setShowConfirmPopup(false);
    }
  }, [countdown, showConfirmPopup]);

  // ================= Payment =================
  const handlePaymentMethodSelect = (method) => setSelectedPaymentMethod(method);

  async function handleSaveOnCheckout() {
    if (!selectedAddress) return alert('Chưa có địa chỉ giao hàng!');
    if (!selectedPaymentMethod) return alert('Vui lòng chọn phương thức thanh toán!');

    const newAddress = { ...formData, id: Date.now() };
    const isExisting = addressList.some(
      (addr) =>
        addr.full_name === newAddress.full_name &&
        addr.phone === newAddress.phone &&
        addr.address === newAddress.address,
    );

    if (!isExisting) {
      const updatedList = [...addressList, newAddress];
      setAddressList(updatedList);
      localStorage.setItem(`addressList_${user.id}`, JSON.stringify(updatedList));
    }

    setSelectedAddress(newAddress);

    const method = selectedPaymentMethod.type.toUpperCase();

    const orderBody = {
      user_id: user.id,
      merchant_id: merchant.id,
      phone: newAddress.phone,
      delivery_address: newAddress.address,
      voucher: selectedVoucher ? selectedVoucher.code : null,
      delivery_fee: deliveryFee,
      note: formData.note,
      utensils: true,
      payment_method: selectedPaymentMethod.type,
      items: state.items.map((i) => ({
        menu_item_id: i.menu_item_id ?? i.menuItem?.id,
        quantity: i.quantity,
        price: i.price ?? i.menuItem?.price,
        note: i.note ?? '',
        selected_option_items: (i.selectedToppings ?? []).map((t) => ({
          option_item_id: t.option_item_id ?? t.id,
          option_item_name: t.option_item_name ?? t.name,
          price: t.price,
        })),
      })),
    };

    if (method === 'COD') {
      setShowConfirmPopup(true);
      setCountdown(10);
    } else {
      const url =
        method === 'VNPAY'
          ? 'https://badafuta-production.up.railway.app/api/payment/initiate'
          : 'https://badafuta-production.up.railway.app/api/momo/create';
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        window.location.href = data.payment_url;
      } catch (err) {
        console.error('Payment error:', err);
        alert('Không thể chuyển thanh toán!');
      }
    }
  }

  async function handleCreateOrder() {
    try {
      const orderBody = {
        user_id: user.id,
        merchant_id: merchant.id,
        phone: selectedAddress.phone,
        delivery_address: selectedAddress.address,
        voucher: selectedVoucher ? selectedVoucher.code : null,
        delivery_fee: deliveryFee,
        payment_method: 'COD',
        note: formData.note,
        utensils: true,
        items: state.items.map((i) => ({
          menu_item_id: i.menu_item_id ?? i.menuItem?.id,
          quantity: i.quantity,
          price: i.price ?? i.menuItem?.price,
          note: i.note ?? '',
          selected_option_items: (i.selectedToppings ?? []).map((t) => ({
            option_item_id: t.option_item_id ?? t.id,
            option_item_name: t.option_item_name ?? t.name,
            price: t.price,
          })),
        })),
      };

      const res = await fetch('https://badafuta-production.up.railway.app/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      clearCart();
      navigate('/cart/checkout/ordersuccess', { state: { order: data } });
    } catch (err) {
      console.error('❌ Lỗi tạo đơn:', err);
      alert('Không thể tạo đơn hàng!');
    }
  }

  // ================= Voucher =================
  async function loadVouchers() {
    try {
      const res = await fetch('https://badafuta-production.up.railway.app/api/voucher/getAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, merchant_id: merchant.id }),
      });
      const json = await res.json();
      const list = [
        ...(json.data?.appVouchers || []),
        ...(json.data?.merchantVouchers || []),
        ...(json.data?.userVouchers || []),
      ];
      setVouchers(list);
    } catch (err) {
      console.error(err);
    }
  }

  function calculateVoucherDiscount() {
    if (!selectedVoucher) return 0;
    const V = selectedVoucher;
    const totalItems = subtotal;
    const shipFee = deliveryFee;
    const total = subtotal + deliveryFee;
    let discount = 0;
    if (V.apply_type === 'DELIVERY') {
      discount = V.discount_type === 'AMOUNT' ? V.discount_value : (shipFee * V.discount_value) / 100;
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, shipFee);
    } else if (V.apply_type === 'MERCHANT') {
      discount = V.discount_type === 'AMOUNT' ? V.discount_value : (totalItems * V.discount_value) / 100;
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, totalItems);
    } else if (V.apply_type === 'TOTAL') {
      discount = V.discount_type === 'AMOUNT' ? V.discount_value : (total * V.discount_value) / 100;
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, total);
    }
    return Math.floor(discount);
  }

  if (!user) return <p>Đang tải thông tin người dùng...</p>;
  if (!selectedAddress) return <p>Đang tải địa chỉ giao hàng...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout Page</h1>
      {/* ... ở đây tiếp tục render UI như code trước, form địa chỉ, payment method, voucher, button đặt hàng, popup countdown ... */}
    </div>
  );
}
