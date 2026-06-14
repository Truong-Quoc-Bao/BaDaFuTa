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
  FileText,
  Ticket,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Textarea } from '../../components/ui/textarea';
import { CancelOrderDialog } from '../../components/CancelOrderDialog';
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
import { Clock } from 'lucide-react';
import { getDistanceKm, calculateDeliveryFee } from '../../utils/distanceUtils';
import { Badge } from '../../components/ui/badge';
import PopupVoucher from '@/components/VoucherDialog';
import { CashIcon, VnPayIcon, MomoIcon } from '../../components/PaymentIcons';
import { io } from 'socket.io-client/dist/socket.io.js';
import { LocateFixed } from 'lucide-react';
export default function CheckOutPage() {
  // 🟢 Khai báo socketRef
  const socketRef = useRef(null);
  // 🧩 Lấy user từ AuthContext
  const { state: authState } = useAuth();
  const user = authState.user;
  // Cancel
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  // 🏦 State quản lý phương thức thanh toán
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  // 🛒 Lấy giỏ hàng
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  // 🧠 STATE QUẢN LÝ
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [voucherPopup, setVoucherPopup] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  console.log('ORDER SEND VOUCHER:', selectedVoucher || null);
  console.log('TYPE:', typeof selectedVoucher);
  console.log('TYPE:', user.full_name || null);

  // Lấy merchant (restaurant hoặc merchant)
  const merchant =
    state.items.length > 0 ? state.items[0].restaurant || state.items[0].merchant : null;

  // Lấy tọa độ nhà hàng chính xác
  const merchantLat = merchant?.location?.lat ?? merchant?.raw?.coordinates?.lat ?? 0;
  const merchantLng = merchant?.location?.lng ?? merchant?.raw?.coordinates?.lng ?? 0;

  // Lấy tọa độ giao hàng
  const deliveryLat = selectedAddress?.lat ?? 0;
  const deliveryLng = selectedAddress?.lng ?? 0;
  // 🛠️ FIX: Kiểm tra xem đã có địa chỉ VÀ có tọa độ hợp lệ chưa
  const hasValidAddress = selectedAddress && deliveryLat !== 0 && deliveryLng !== 0;

  // Tính khoảng cách (km) -> Nếu chưa có địa chỉ thì là 0
  const distanceKm = hasValidAddress
    ? getDistanceKm(merchantLat, merchantLng, deliveryLat, deliveryLng)
    : 0;

  // Tính phí ship -> Nếu chưa có địa chỉ thì là 0
  const deliveryFee = hasValidAddress ? calculateDeliveryFee(distanceKm) : 0;

  // Cập nhật item trong state để hiển thị trên checkout
  if (state.items.length > 0) {
    state.items[0].deliveryFee = deliveryFee;
    // state.items[0].deliveryTime = deliveryTime;
  }

  // Log thông tin
  console.log('Merchant Lat/Lng:', merchantLat, merchantLng);
  console.log('Delivery Lat/Lng:', deliveryLat, deliveryLng);
  console.log('Distance (km):', distanceKm);
  console.log('Delivery Fee (VND):', deliveryFee);
  // console.log('Estimated Delivery Time (min):', deliveryTime);

  // ================= WebSocket =================
  useEffect(() => {
    if (!merchant?.id) return;

    // socketRef.current = io('https://badafuta-production.up.railway.app', {
    socketRef.current = io('https://badafuta.onrender.com', {
      transports: ['websocket'],
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected:', socketRef.current.id);
      socketRef.current.emit('joinMerchant', merchant.id);
    });

    socketRef.current.on('newOrder', (order) => {
      console.log('🔥 Nhận đơn mới:', order);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected:', reason);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [merchant?.id]);

  // 🏦 Handler khi chọn phương thức
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCancelOrder = () => {
    clearCart();
    navigate('/order-cancelled');
  };

  const subtotal = state.total;
  const total = subtotal + deliveryFee;

  const [step, setStep] = useState('list'); // list | edit | add

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    note: '',
    utensils: '',
  });

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setFormData(addr);
    localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(addr));
    setIsDialogOpen(false);
  };

  const noteRef = useRef(formData.note || '');
  const [note, setNote] = useState(formData.note || '');

  const handleConfirmNote = () => {
    console.log('📝 Ghi chú đã xác nhận:', noteRef.current);
  };

  // useEffect(() => {
  //   if (!user) return;

  //   // ✅ Lấy danh sách địa chỉ cũ từ localStorage
  //   const savedAddresses = JSON.parse(localStorage.getItem(`addressList_${user.id}`)) || [];
  //   setAddressList(savedAddresses);

  //   const savedSelected = JSON.parse(localStorage.getItem(`selectedAddress_${user.id}`));
  //   if (savedSelected) {
  //     console.log('📦 Dùng địa chỉ đã lưu từ LocalStorage:', savedSelected);
  //     setSelectedAddress(savedSelected);
  //     setFormData(savedSelected);
  //     return; // ⛔ Dừng hàm tại đây, không chạy xuống phần GPS bên dưới
  //   }

  //   const defaultAddress = {
  //     id: Date.now(),
  //     full_name: user?.full_name ?? 'Người dùng',
  //     phone: user?.phone ?? '',
  //     address: '', // để trống nếu GPS bị từ chối
  //     note: '',
  //     utensils: '',
  //   };

  //   // Hàm fetch địa chỉ từ GPS
  //   const fetchAddress = async (lat, lon) => {
  //     try {
  //       const res = await fetch(
  //         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
  //       );
  //       const data = await res.json();
  //       const gpsAddress = {
  //         ...defaultAddress,
  //         address: data.display_name || '',
  //         lat,
  //         lng: lon,
  //       };
  //       setFormData(gpsAddress);
  //       setSelectedAddress(gpsAddress);
  //     } catch (err) {
  //       console.log('Reverse geocode error:', err);
  //       setFormData({
  //         ...defaultAddress,
  //         lat,
  //         lng: lon,
  //       });
  //       setSelectedAddress({
  //         ...defaultAddress,
  //         lat,
  //         lng: lon,
  //       });
  //     }
  //   };

  //   // Lấy GPS nếu trình duyệt hỗ trợ
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => fetchAddress(pos.coords.latitude, pos.coords.longitude),
  //       (err) => {
  //         console.warn('GPS bị từ chối:', err.message);
  //         // hiển thị input trống
  //         setIsEditing(true);
  //         setFormData(defaultAddress);
  //         setSelectedAddress({
  //           defaultAddress,
  //         });
  //       },
  //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  //     );
  //   } else {
  //     console.warn('Geolocation không hỗ trợ');
  //     setIsEditing(true);
  //     setFormData(defaultAddress);
  //     setSelectedAddress({ defaultAddress });
  //   }
  // }, [user]);

  // 1️⃣ Hàm xử lý lấy vị trí GPS (Dùng chung cho cả tự động và nút bấm)
  const handleGetCurrentLocation = () => {
    // Template địa chỉ mặc định
    const defaultAddress = {
      id: Date.now(),
      full_name: user?.full_name ?? 'Người dùng',
      phone: user?.phone ?? '',
      address: 'Đang lấy vị trí...', // Hiển thị tạm để user biết đang chạy
      note: '',
      utensils: '',
      lat: 0,
      lng: 0,
    };

    // Nếu đang ở chế độ sửa, cập nhật UI ngay để user thấy phản hồi
    if (isEditing) {
      setFormData((prev) => ({ ...prev, address: 'Đang tìm vị trí...' }));
    }

    // Hàm gọi API lấy tên đường
    const fetchAddressName = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        );
        const data = await res.json();

        const gpsAddress = {
          ...defaultAddress,
          // Giữ lại tên/sđt nếu người dùng đang nhập dở
          full_name: formData.full_name || defaultAddress.full_name,
          phone: formData.phone || defaultAddress.phone,
          address: data.display_name || 'Vị trí hiện tại',
          lat,
          lng: lon,
        };

        // Cập nhật State
        setFormData(gpsAddress);
        setSelectedAddress(gpsAddress);

        // 🔥 Lưu ngay vào LocalStorage để F5 không mất
        localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(gpsAddress));
      } catch (err) {
        console.error('Lỗi lấy tên đường:', err);
        // Nếu lỗi API thì vẫn lưu tọa độ
        const fallbackAddr = {
          ...defaultAddress,
          lat,
          lng: lon,
          address: `Toạ độ: ${lat}, ${lon}`,
        };
        setFormData(fallbackAddr);
        setSelectedAddress(fallbackAddr);
      }
    };

    // Gọi trình duyệt lấy GPS
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAddressName(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn('GPS bị từ chối:', err.message);
          setIsEditing(true);
          const emptyAddr = { ...defaultAddress, address: '' };
          setFormData(emptyAddr);
          setSelectedAddress(emptyAddr);
          alert('Không thể lấy vị trí. Vui lòng kiểm tra quyền GPS hoặc nhập tay.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      console.warn('Geolocation không hỗ trợ');
      setIsEditing(true);
      const emptyAddr = { ...defaultAddress, address: '' };
      setFormData(emptyAddr);
      setSelectedAddress(emptyAddr);
    }
  };

  // 2️⃣ useEffect: Chỉ chạy tự động nếu CHƯA CÓ địa chỉ
  useEffect(() => {
    if (!user) return;

    // Load danh sách cũ
    const savedAddresses = JSON.parse(localStorage.getItem(`addressList_${user.id}`)) || [];
    setAddressList(savedAddresses);

    // Load địa chỉ đang chọn
    const savedSelected = JSON.parse(localStorage.getItem(`selectedAddress_${user.id}`));

    if (savedSelected) {
      console.log('📦 Dùng địa chỉ đã lưu:', savedSelected);
      setSelectedAddress(savedSelected);
      setFormData(savedSelected);
      return; // ⛔ Có rồi thì DỪNG, không tự chạy GPS
    }

    // ⛔ Nếu chưa có thì mới tự động chạy GPS lần đầu
    console.log('🌍 Chưa có địa chỉ, tự động lấy GPS...');
    handleGetCurrentLocation();
  }, [user]);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // ======================
  // 🧩 Khi bấm "Đặt hàng / Xác nhận"
  // ======================
  const handleSaveOnCheckout = async () => {
    if (!selectedAddress) {
      alert('Chưa có địa chỉ giao hàng!');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    const newAddress = { ...formData, id: Date.now() };

    // Tính thời gian dự kiến giao hàng: 35–40 phút
    const now = new Date();
    const minutesToAdd = Math.floor(Math.random() * 6) + 35;
    const estimatedTime = new Date(now.getTime() + minutesToAdd * 60000);
    const finalAddress = { ...newAddress, estimatedTime };

    // Kiểm tra địa chỉ đã tồn tại chưa
    const isExisting = addressList.some(
      (addr) =>
        addr.full_name === newAddress.full_name &&
        addr.phone === newAddress.phone &&
        addr.address === newAddress.address,
    );

    // Nếu là địa chỉ mới thì lưu vào danh sách
    if (!isExisting) {
      const updatedList = [...addressList, finalAddress];
      setAddressList(updatedList);
      localStorage.setItem(`addressList_${user.id}`, JSON.stringify(updatedList));
      alert('✅ Địa chỉ mới đã được lưu vào danh sách!');
    }

    // Gán địa chỉ đã chọn
    setSelectedAddress(finalAddress);

    // 🔹 Chuẩn hóa method về chữ hoa
    const method = selectedPaymentMethod.type.toUpperCase();

    // Tạo body chung cho cả 2 phương thức
    const orderBody = {
      user_id: user.id,
      full_name: user.full_name,
      merchant_id: merchant.id,
      phone: finalAddress.phone,
      delivery_address: finalAddress.address,
      voucher: selectedVoucher ? selectedVoucher.code : null,
      delivery_fee: deliveryFee,
      note: note,
      utensils: true,
      payment_method: selectedPaymentMethod.type, // COD / VNPAY / MOMO

      items: state.items.map((i) => ({
        menu_item_id: i.menu_item_id ?? i.menuItem?.id,
        quantity: i.quantity,
        price: i.price ?? i.menuItem?.price,
        note: i.note ?? '', // <-- thêm dòng này

        selected_option_items: (i.selectedToppings ?? []).map((t) => ({
          option_item_id: t.option_item_id ?? t.id,
          option_item_name: t.option_item_name ?? t.name,
          price: t.price,
        })),
      })),
    };

    // ----------------------
    // Tiền mặt (COD)
    // ----------------------
    if (method === 'COD') {
      setShowConfirmPopup(true);
      setCountdown(10);
    }
    // ----------------------
    // VNPay
    // ----------------------
    else if (method === 'VNPAY') {
      try {
        console.log('📤 Sending body to VNPay:', orderBody);
        // const res = await fetch('https://badafuta-production.up.railway.app/api/payment/initiate', {
        const res = await fetch('https://badafuta.onrender.com/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));

        console.log('📦 VNPay payment data:', data);

        // ✅ redirect đúng field backend trả về
        window.location.href = data.payment_url;
        // Clear giỏ hàng
        // clearCart();
      } catch (err) {
        console.error('❌ Lỗi tạo đơn VNPay:', err);
        alert('Không thể chuyển sang VNPay!');
      }
    } else if (method === 'MOMO') {
      try {
        console.log('📤 Sending body to MoMo:', orderBody);
        // const res = await fetch('https://badafuta-production.up.railway.app/api/momo/create', {
        const res = await fetch('https://badafuta.onrender.com/api/momo/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderBody),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));

        console.log('📦 momo payment data:', data);

        // ✅ redirect đúng field backend trả về
        window.location.href = data.payment_url;
        // Clear giỏ hàng
        // clearCart();
      } catch (err) {
        console.error('❌ Lỗi tạo đơn VNPay:', err);
        alert('Không thể chuyển sang VNPay!');
      }
    }
  };

  // ======================
  // ⏱️ Đếm ngược popup tiền mặt
  // ======================
  useEffect(() => {
    if (!showConfirmPopup) return;
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showConfirmPopup, countdown]);

  // ======================
  // 🧭 Khi countdown = 0 => tự gọi API tiền mặt
  // ======================
  useEffect(() => {
    if (countdown === 0 && showConfirmPopup) {
      handleCreateOrder();
      setShowConfirmPopup(false);
    }
  }, [countdown, showConfirmPopup]);

  // ======================
  // 🚀 Hàm gọi API tạo đơn tiền mặt
  // ======================
  const handleCreateOrder = async () => {
    try {
      // const orderBody = {
      //   user_id: user.id,
      //   merchant_id: merchant.id,
      //   phone: selectedAddress.phone,
      //   delivery_address: selectedAddress.address,
      //   delivery_fee: deliveryFee,
      //   payment_method: 'COD', // ✅ đồng bộ với backend
      //   note: selectedAddress?.note,
      //   items: state.items.map((i) => ({
      //     menu_item_id: i.menu_item_id ?? i.menuItem?.id,
      //     quantity: i.quantity,
      //     price: i.price ?? i.menuItem?.price,
      //   })),
      // };

      const orderBody = {
        user_id: user.id,
        full_name: user.full_name,
        merchant_id: merchant.id,
        phone: selectedAddress.phone,
        delivery_address: selectedAddress.address,
        voucher: selectedVoucher ? selectedVoucher.code : null,
        delivery_fee: deliveryFee,
        payment_method: 'COD', // ✅ đồng bộ với backend
        note: selectedAddress?.note,
        utensils: true,
        items: state.items.map((i) => ({
          menu_item_id: i.menu_item_id ?? i.menuItem?.id,
          quantity: i.quantity,
          price: i.price ?? i.menuItem?.price,
          note: i.note ?? '', // <-- thêm dòng này

          selected_option_items: (i.selectedToppings ?? []).map((t) => ({
            option_item_id: t.option_item_id ?? t.id,
            option_item_name: t.option_item_name ?? t.name,
            price: t.price,
          })),
        })),
      };

      console.log('ORDER SEND VOUCHER:', selectedVoucher);
      console.log('📤 Gửi order tới backend:', orderBody);
      // const res = await fetch('https://badafuta-production.up.railway.app/api/order', {
      const res = await fetch('https://badafuta.onrender.com/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });
      console.log('📥 Response:', res.status);

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      console.log('✅ Đơn hàng tạo thành công:', data);
      // emit socket để merchant nhận real-time
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('newOrder', {
          ...orderBody,
          order_id: data.order_id,
        });
      }

      localStorage.setItem('orderConfirmed', 'true');
      clearCart();
      // navigate("/cart/checkout/ordersuccess");
      // data là object trả về khi tạo đơn hàng thành công
      navigate('/cart/checkout/ordersuccess', { state: { order: data } });
    } catch (err) {
      console.error('❌ Lỗi tạo đơn:', err);
      alert('Không thể tạo đơn hàng!');
    }
  };

  const [loading, setLoading] = useState(false);
  // ======================
  // 🧭 VNPay Redirect Handler (giống MoMo)
  // ======================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const base64 = params.get('data');

    // Nếu không phải callback VNPay → bỏ qua
    if (!status || !base64) return;

    // FAILED → quay về checkout
    if (status !== 'success') {
      navigate('/cart/checkout/orderfailed');
      return;
    }

    try {
      setLoading(true);

      // 🔹 Decode base64 → JSON
      const jsonString = atob(decodeURIComponent(base64));
      const fullOrder = JSON.parse(jsonString);

      // 🔹 Lấy orderId
      const orderId = fullOrder?.order_id || fullOrder?.id;

      // 🔹 Lưu vào localStorage (giống MoMo)
      localStorage.setItem('orderConfirmed', 'true');
      localStorage.setItem('lastOrderId', orderId);

      // 🔹 Clear cart
      clearCart();

      setLoading(false);

      // 🔹 Điều hướng sang trang success (gửi full data luôn)
      navigate(`/cart/checkout/ordersuccess?status=success&data=${encodeURIComponent(base64)}`);
    } catch (err) {
      console.error('VNPay callback decode error:', err);
      navigate('/cart/checkout/orderfailed');
    }
  }, [location.search]);

  // ======================
  // 🧭 MoMo Redirect Handler
  // ======================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');

    if (!orderId) return;

    setLoading(true);

    // Lưu lại để OrderSuccessPage dùng
    localStorage.setItem('orderConfirmed', 'true');
    localStorage.setItem('lastOrderId', orderId);

    clearCart();
    setLoading(false);

    // Điều hướng sang trang thành công – CHỈ GỬI orderId
    navigate(`/cart/checkout/ordersuccess?orderId=${orderId}`);
  }, [location.search]);

  // 🧾 Hàm thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✏️ Chỉnh sửa địa chỉ hiện tại
  const handleEdit = () => {
    setIsDialogOpen(true);
    setIsEditing(false);
    setIsAdding(false);
  };

  // ➕ Thêm địa chỉ mới
  const handleAddNewAddress = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({ full_name: '', phone: '', address: '', note: '' });
    setIsDialogOpen(true); // 👈 mở popup
  };

  // ============================================
  // 📍 FIX: Hàm lấy tọa độ từ LocationIQ khi nhập tay
  // ============================================
  const fetchCoordinates = async (address) => {
    if (!address) return null;

    const LOCATIONIQ_TOKEN = 'pk.4e0ece0ff0632fae5010642d702d5dfa';
    const cleanAddress = address.trim();

    // Link API đúng như bạn yêu cầu
    const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(
      cleanAddress,
    )}&format=json&limit=1&countrycodes=vn&addressdetails=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Kiểm tra nếu có data trả về
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (err) {
      console.error('Lỗi lấy tọa độ LocationIQ:', err);
    }
    return null;
  };

  // 💾 Lưu khi chỉnh sửa (Fix: Gọi API LocationIQ để lấy lat/lng mới)
  const handleSaveEdit = async () => {
    // Gọi API lấy tọa độ
    const coords = await fetchCoordinates(formData.address);

    const updatedAddress = {
      ...formData,
      // Nếu có coords mới thì dùng, không thì giữ cái cũ hoặc 0
      lat: coords ? coords.lat : formData.lat || 0,
      lng: coords ? coords.lng : formData.lng || 0,
      id: selectedAddress?.id ?? Date.now(),
    };

    setAddressList((prev) =>
      prev.map((addr) => (addr.id === selectedAddress.id ? updatedAddress : addr)),
    );

    setSelectedAddress(updatedAddress);
    localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(updatedAddress));

    setIsEditing(false);
    if (coords) {
      alert('✅ Đã cập nhật địa chỉ và tính lại phí ship!');
    } else {
      alert('✅ Đã cập nhật thông tin giao hàng!');
    }
  };
  // 💾 Lưu khi thêm mới (Fix: Gọi API LocationIQ để lấy lat/lng mới)
  const handleSaveAdd = async () => {
    // Gọi API lấy tọa độ
    const coords = await fetchCoordinates(formData.address);

    const newAddress = {
      ...formData,
      id: Date.now(),
      lat: coords ? coords.lat : 0,
      lng: coords ? coords.lng : 0,
    };

    const updatedList = [...addressList, newAddress];
    setAddressList(updatedList);
    setSelectedAddress(newAddress);

    localStorage.setItem(`addressList_${user.id}`, JSON.stringify(updatedList));
    localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(newAddress));

    setIsAdding(false);
    if (coords) {
      alert('✅ Đã thêm địa chỉ mới và cập nhật phí ship!');
    } else {
      alert('✅ Đã thêm địa chỉ mới!');
    }
  };

  useEffect(() => {
    if (!user) {
      const savedUser = JSON.parse(localStorage.getItem('auth_user'));
      if (savedUser) authState.user = savedUser;
    }

    if (user) {
      const savedSelected = JSON.parse(localStorage.getItem(`selectedAddress_${user.id}`));
      if (savedSelected) {
        setSelectedAddress(savedSelected);
        setFormData(savedSelected);
      }
    }
  }, [user]);

  // Thanh Toán
  function PaymentMethodSelector({ selectedMethod, onSelect }) {
    const methods = [
      { type: 'COD', label: 'Tiền mặt' },
      { type: 'VNPAY', label: 'Thanh toán VNPay' },
      { type: 'MOMO', label: 'Ví Momo' },
    ];

    return (
      <div className="flex flex-col space-y-2 mb-4">
        {methods.map((m) => (
          <Button
            key={m.type}
            variant={selectedMethod?.type === m.type ? 'default' : 'outline'}
            className="text-left"
            onClick={() => onSelect(m)}
          >
            {m.label}
          </Button>
        ))}
      </div>
    );
  }

  if (!user) return <p>Đang tải thông tin người dùng...</p>;
  if (!selectedAddress) return <p>Đang tải địa chỉ giao hàng...</p>;

  async function loadVouchers() {
    try {
      // const res = await fetch('https://badafuta-production.up.railway.app/api/voucher/getAll', {
      const res = await fetch('https://badafuta.onrender.com/api/voucher/getAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          merchant_id: merchant.id,
        }),
      });

      const json = await res.json();

      const list = [
        ...(json.data?.appVouchers || []),
        ...(json.data?.merchantVouchers || []),
        ...(json.data?.userVouchers || []),
      ];

      setVouchers(list);
    } catch (error) {
      console.error('Lỗi load voucher:', error);
    }
  }
  // ---------------------------------------------
  // TÍNH GIẢM GIÁ VOUCHER (GIỐNG HỆT BACKEND)
  // ---------------------------------------------
  const calculateVoucherDiscount = () => {
    if (!selectedVoucher) return 0;

    const V = selectedVoucher;
    const totalItems = subtotal;
    const shipFee = deliveryFee;
    const total = subtotal + deliveryFee;

    let discount = 0;

    // DELIVERY
    if (V.apply_type === 'DELIVERY') {
      if (V.discount_type === 'AMOUNT') {
        discount = V.discount_value;
      } else {
        discount = (shipFee * V.discount_value) / 100;
      }
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, shipFee);
    }

    // MERCHANT → giảm trên món
    else if (V.apply_type === 'MERCHANT') {
      if (V.discount_type === 'AMOUNT') {
        discount = V.discount_value;
      } else {
        discount = (totalItems * V.discount_value) / 100;
      }
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, totalItems);
    }

    // TOTAL → giảm trên toàn đơn
    else if (V.apply_type === 'TOTAL') {
      if (V.discount_type === 'AMOUNT') {
        discount = V.discount_value;
      } else {
        discount = (total * V.discount_value) / 100;
      }
      if (V.max_discount) discount = Math.min(discount, V.max_discount);
      discount = Math.min(discount, total);
    }

    return Math.floor(discount);
  };

  const discountAmount = calculateVoucherDiscount();
  const finalTotal = subtotal + deliveryFee - discountAmount;

  const cartTotal = state.items.reduce((sum, item) => {
    const basePrice = item.menuItem?.price ?? 0;

    const toppings = (item.selected_option_items ?? []).reduce((t, op) => t + (op.price ?? 0), 0);

    return sum + (basePrice + toppings) * item.quantity;
  }, 0);

  console.log('Tổng tiền:', cartTotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="outline" onClick={() => navigate('/cart')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại giỏ hàng
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card className="mb-6  hover:scale-100">
            <CardHeader className="font-semibold text-2xl flex justify-between items-center">
              <CardTitle>Thông tin giao hàng</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleEdit} // 👈 mở popup chỉnh sửa
                >
                  Chọn lại địa chỉ
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between items-start p-4 rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span>Địa chỉ giao hàng mặt định</span>
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData(selectedAddress); // ✅ nạp dữ liệu đang chọn
                          setIsEditing(true); // ✅ bật chế độ sửa
                          setIsAdding(false);
                          setIsDialogOpen(true); // ✅ mở popup
                        }}
                      >
                        <Edit /> Sửa
                      </Button>
                    </div>
                  </div>

                  <p className="flex items-center justify-between text-sm text-gray-500 w-full whitespace-nowrap gap-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" />
                      <span>Tên khách hàng: </span>
                    </span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedAddress?.full_name || 'Người dùng'}
                    </span>
                  </p>

                  <p className="flex items-center justify-between text-sm text-gray-500 w-full whitespace-nowrap gap-2">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <span> Số điện thoại giao hàng: </span>
                    </span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedAddress?.phone || ''}
                    </span>
                  </p>

                  {/* Địa chỉ giao hàng */}
                  <p className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="flex flex-wrap w-full">
                      <span className="flex flex-wrap items-center">
                        <span>Địa chỉ giao hàng: &nbsp;</span>{' '}
                        {/* Nếu đang edit địa chỉ (GPS bị từ chối) thì hiện input */}
                        {isEditing || !selectedAddress.address ? (
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ giao hàng"
                            className="font-semibold text-gray-900 break-words"
                          />
                        ) : (
                          <span className="font-semibold text-gray-900 break-words capitalize">
                            {' '}
                            {selectedAddress?.address || 'Chưa có địa chỉ'}
                          </span>
                        )}
                      </span>
                    </span>
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-8 px-3 text-xs font-medium flex items-center gap-2 transition-colors"
                      onClick={handleGetCurrentLocation}
                      type="button" // Để không bị submit form nếu nằm trong form
                    >
                      <LocateFixed className="w-3.5 h-3.5" />
                      Lấy vị trí hiện tại
                    </Button>
                  </div>

                  {/* 📝 Ghi chú giao hàng */}
                  <div className="w-full space-y-2">
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Edit3 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Ghi chú giao hàng: </span>
                    </p>
                    <Textarea
                      placeholder="Nhập ghi chú cho đơn hàng (VD: Giao buổi sáng, gọi trước khi tới...)"
                      value={formData.note} // ✅ bind trực tiếp với formData
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }));
                        setSelectedAddress((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }));
                      }}
                      className="w-full min-h-[90px] font-semibold text-gray-500 break-words resize-none text-xs capitalize"
                    />
                  </div>

                  {/* ✅ Checkbox utensils */}
                  {/* <label className="flex items-center gap-2 text-sm mt-1">
                    <input
                      type="checkbox"
                      checked={formData.utensils || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          utensils: e.target.checked,
                        }));
                      }}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded"
                    />
                    Dụng cụ ăn uống
                  </label> */}

                  {/* <div className="mt-3 flex">
                    <Button className="" onClick={handleConfirmNote}>
                      Xác nhận
                    </Button>
                  </div> */}
                </div>
              </div>

              {/* Popup sửa hoặc thêm địa chỉ */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg border border-gray-200 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing
                        ? 'Chỉnh sửa địa chỉ giao hàng'
                        : isAdding
                        ? 'Thêm địa chỉ mới'
                        : 'Quản lý địa chỉ'}
                    </DialogTitle>
                  </DialogHeader>

                  {/* 🧩 Nếu đang chỉnh sửa hoặc thêm mới thì chỉ hiển thị form */}
                  {isEditing || isAdding ? (
                    <div className="space-y-4">
                      {/* Nút quay lại */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setIsAdding(false);
                        }}
                        className="w-[4px] h-[4px] border-0"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                      <div className="space-y-2">
                        <Label>Họ tên:* </Label>
                        <Input
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="Nhập họ tên người nhận"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Số điện thoại:* </Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Địa chỉ:* </Label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Nhập địa chỉ giao hàng"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ghi chú</Label>
                        <Textarea
                          name="note"
                          value={formData.note}
                          onChange={handleInputChange}
                          placeholder="Ghi chú (nếu có)"
                        />
                      </div>

                      <DialogFooter className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setIsAdding(false);
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={isEditing ? handleSaveEdit : handleSaveAdd}
                        >
                          {isEditing ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    // 🧾 Hiển thị danh sách địa chỉ nếu chưa bấm sửa hoặc thêm
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-[4px] h-[4px] border-0"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                      <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto">
                        {addressList.map((addr) => (
                          <div
                            key={addr.id}
                            className={`flex justify-between items-start border rounded-lg p-3 cursor-pointer ${
                              selectedAddress?.id === addr.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200'
                            }`}
                            onClick={async () => {
                              let finalAddr = { ...addr };

                              // Nếu địa chỉ cũ chưa có tọa độ (hoặc = 0), tự động lấy lại
                              if (!finalAddr.lat || finalAddr.lat === 0) {
                                const coords = await fetchCoordinates(finalAddr.address);
                                if (coords) {
                                  finalAddr.lat = coords.lat;
                                  finalAddr.lng = coords.lng;
                                }
                              }

                              // Cập nhật state
                              setSelectedAddress(finalAddr);
                              setFormData(finalAddr); // Sync form

                              // Cập nhật trạng thái "Mặc định" trong list
                              const updatedList = addressList.map((a) =>
                                a.id === finalAddr.id
                                  ? { ...finalAddr, isDefault: true }
                                  : { ...a, isDefault: false },
                              );
                              setAddressList(updatedList);

                              // Lưu LocalStorage
                              localStorage.setItem(
                                `addressList_${user.id}`,
                                JSON.stringify(updatedList),
                              );
                              localStorage.setItem(
                                `selectedAddress_${user?.id}`,
                                JSON.stringify(finalAddr),
                              );

                              // Đóng popup
                              setIsDialogOpen(false);
                            }}
                          >
                            <div>
                              {addr.isDefault && (
                                <p className="text-sm text-orange-500 font-medium mb-1">Mặt định</p>
                              )}
                              <p className="font-semibold">{addr.full_name}</p>
                              <p className="text-sm text-gray-500">{addr.phone}</p>
                              <p className="text-sm text-gray-500">
                                {selectedAddress?.id === addr.id
                                  ? selectedAddress.address || 'Chưa có địa chỉ'
                                  : addr.address || 'Chưa có địa chỉ'}
                              </p>
                              {addr.note && (
                                <p className="text-sm text-gray-400 italic">Ghi chú: {addr.note}</p>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện click cha (chọn địa chỉ)
                                  setFormData(addr); // Nạp data của địa chỉ này vào form
                                  setIsEditing(true);
                                  setIsAdding(false);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" /> Sửa
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ➕ Nút thêm địa chỉ mới */}
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => {
                            setIsAdding(true);
                            setIsEditing(false);
                            setFormData({
                              name: '',
                              phone: '',
                              address: '',
                              note: '',
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Thêm địa chỉ mới
                        </Button>
                      </div>

                      {/* <DialogFooter>
                        
                      </DialogFooter> */}
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 w-[200px] flex justify-start text-white"
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(false);
                  setFormData({
                    name: '',
                    phone: '',
                    address: '',
                    note: '',
                  });
                  setIsDialogOpen(true); // ✅ thêm dòng này để hiện popup
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm địa chỉ mới
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-col p-4 rounded-xl border border-gray-200 bg-white shadow-md mb-4">
            <p className="font-semibold text-lg flex items-center mb-3">
              <CreditCard className="w-5 h-5 mr-2 text-orange-500" /> Phương thức thanh toán
            </p>

            <div className="grid gap-3">
              {['COD', 'VNPAY', 'MOMO'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition
                    ${
                      selectedPaymentMethod?.type === type
                        ? 'bg-gray-100 border-gray-100 text-black shadow-lg'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="font-medium flex items-center gap-2">
                    {type === 'COD' && <CashIcon className="w-6 h-6 text-green-500" />}
                    {type === 'VNPAY' && <VnPayIcon className="w-6 h-6 text-blue-500" />}
                    {type === 'MOMO' && <MomoIcon className="w-6 h-6 text-pink-500" />}
                    {type === 'COD' ? 'Tiền mặt' : type === 'VNPAY' ? 'VNPay' : 'Ví Momo'}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 text-orange-500"
                    checked={selectedPaymentMethod?.type === type}
                    onChange={() => handlePaymentMethodSelect({ type })}
                  />
                </label>
              ))}
            </div>
          </div>
          {/* Box áp mã voucher */}
          <div
            className="flex flex-col p-4 rounded-xl border border-gray-200 bg-white shadow-md mb-4 cursor-pointer"
            onClick={async () => {
              await loadVouchers();
              setVoucherPopup(true);
            }}
          >
            <p className="font-semibold text-lg inline-flex items-center gap-2">
              <Ticket className="w-5 h-5 text-orange-500" />
              Áp Mã Voucher
            </p>

            {/* Nếu ĐÃ chọn voucher → Hiển thị ngay trong khung */}
            {selectedVoucher && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-300 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-orange-700">{selectedVoucher.title}</p>
                  <p className="text-sm text-orange-600">Mã: {selectedVoucher.code}</p>
                </div>

                <button
                  className="text-red-500 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation(); // không mở popup
                    setSelectedVoucher(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Popup chọn voucher */}
          <PopupVoucher
            open={voucherPopup}
            onClose={() => setVoucherPopup(false)}
            vouchers={vouchers}
            cartTotal={cartTotal}
            onSelect={(voucherObj) => {
              setSelectedVoucher(voucherObj);
              setVoucherPopup(false);
            }}
          />

          <div className="flex justify-center space-x-3">
            <Button
              onClick={() => {
                console.log('🧭 selectedPaymentMethod:', selectedPaymentMethod);
                if (!selectedPaymentMethod) {
                  alert('Vui lòng chọn phương thức thanh toán!');
                  return;
                }
                handleSaveOnCheckout();
              }}
              className="w-full max-w-full  bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              {selectedPaymentMethod?.type === 'COD' ? 'Đặt hàng' : 'Tiếp tục thanh toán'}
            </Button>

            {/* <Button className="flex-1" variant="outline" onClick={() => setShowCancelDialog(true)} size="lg">
              Hủy
            </Button> */}
          </div>
        </div>
        {showConfirmPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay mờ nền */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Popup chính */}
            <div className="relative bg-white p-6 rounded-lg text-center z-10 max-w-md w-full mx-4 shadow-lg">
              {/* Countdown */}
              <div className="relative w-23 h-23 mx-auto">
                {/* Vòng tròn gradient xoay */}
                <div className="absolute inset-0 rounded-full border-6 border-gray-300 border-t-transparent border-r-transparent border-b-orange-400 border-l-orange-600 animate-spin"></div>

                {/* Đuôi sáng nhỏ dạng comet */}
                {/* <div className="absolute top-1 left-1/2 w-2 h-8 bg-gradient-to-b from-orange-500 to-transparent rounded-full transform -translate-x-1/2 animate-spin"></div> */}

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(255,165,0,0.8)]"></div>

                {/* Countdown ở giữa */}
                <p className="absolute inset-0 flex items-center justify-center text-[32px] font-bold text-red-500 drop-shadow-lg">
                  {countdown}s
                </p>
              </div>
              <br></br>

              {/* Tiêu đề */}
              <p className="text-lg font-semibold mb-4">Xác nhận đặt đơn</p>

              {/* Nội dung */}
              <p className="text-gray-700 mb-4">Bạn ơi, hãy kiểm tra thông tin lần nữa nhé!</p>

              {/* Thông tin địa chỉ */}
              <div className="flex flex-col gap-4 text-gray-700">
                {/* Thẻ địa chỉ */}
                <div className="flex items-start gap-1 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col w-full text-between">
                    <span className="font-semibold text-gray-900 break-words text-sm leading-relaxed">
                      {selectedAddress?.address || 'Chưa có địa chỉ'}
                    </span>
                    <p className="text-gray-600 text-sm mt-1 capitalize font-medium text-center">
                      {selectedAddress?.full_name} | {selectedAddress?.phone}
                    </p>
                  </div>
                </div>

                {/* Thời gian dự kiến */}
                {selectedAddress?.estimatedTime &&
                  new Date(selectedAddress.estimatedTime) > new Date() && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="font-semibold text-yellow-700">
                        Dự kiến giao lúc:{' '}
                        {new Date(selectedAddress.estimatedTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                {/* Danh sách món */}
                <div className="flex flex-col gap-3">
                  {state.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                    >
                      <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <ImageWithFallback
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="object-cover w-12 h-12 rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-gray-900 truncate">
                          {item.menuItem.name}
                        </span>
                        <span className="text-sm text-gray-500 truncate">
                          {item.quantity} món | {item.menuItem.price.toLocaleString('vi-VN')}đ |
                          Tiền mặt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => {
                    // Chuyển về trang checkout
                    setShowConfirmPopup(false);
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2 w-[120px] bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  onClick={() => {
                    handleSaveOnCheckout();
                    handleCreateOrder(); // ✅ Gọi tạo đơn luôn, không cần chờ countdown
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 hover:scale-100">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {state.items.map((item) => {
                  const optionTotal =
                    item.selectedOptions?.reduce(
                      (sum, opt) =>
                        sum + (opt.items?.reduce((s, oi) => s + Number(oi.price || 0), 0) || 0),
                      0,
                    ) || 0;

                  const itemTotal = (item.menuItem.price + optionTotal) * item.quantity;
                  return (
                    // <div key={item.id} className="flex justify-between items-center">
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 p-3 border border-gray-200 bg-gray-50 rounded-md transition"
                    >
                      {/* Hàng trên: Ảnh món + tên + số lượng + giá */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Ảnh món */}
                        <ImageWithFallback
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="object-cover w-[40px] h-[40px] p-1  rounded-lg flex-shrink-0"
                        />
                        {/* Tên + số lượng */}
                        <div className="flex-1 flex flex-col">
                          <p className="font-medium">{item.menuItem.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.menuItem.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        {/* Giá */}
                        <div className="mt-2 md:mt-0 md:ml-4 flex-shrink-0">
                          <span className="font-medium">
                            {(item.menuItem.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                      {/* Topping hiển thị riêng */}
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <div className="mt-2 md:mt-0 md:ml-4 flex flex-wrap gap-1 w-full md:w-auto">
                          {item.selectedToppings.map((topping) => (
                            <Badge
                              key={topping.id}
                              variant="outline"
                              className="text-xs border border-gray-300"
                            >
                              {topping.option_group_name
                                ? `${topping.option_group_name}: ${topping.option_item_name}`
                                : topping.option_item_name}
                              {topping.price > 0 && ` +${topping.price.toLocaleString('vi-VN')}đ`}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {/* Hiển thị option đã chọn */}
                      {console.log('item:', item)}
                    </div>
                  );
                })}
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between">
                <span>
                  Tạm tính ({state.items.reduce((sum, item) => sum + item.quantity, 0)} món)
                </span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="flex justify-between">
                <span>Phí giao hàng: </span>
                <span>
                  <span>
                    {/* Trường hợp 1: Có phí ship hợp lệ (> 0) */}
                    {
                      deliveryFee > 0
                        ? deliveryFee.toLocaleString('vi-VN') + 'đ'
                        : selectedAddress && selectedAddress.address // Trường hợp 2: Có địa chỉ nhưng chưa ra tiền (đang tính/lỗi)
                        ? 'Đang tính...'
                        : 'Chưa có địa chỉ' // Trường hợp 3: Chưa có địa chỉ (null hoặc rỗng)
                    }
                  </span>
                </span>
              </div>

              {/* Hiển thị giảm giá nếu có voucher */}
              {discountAmount > 0 && (
                <>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Giảm giá ({selectedVoucher?.code})</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </>
              )}

              <hr className="border-gray-200" />

              {/* Tổng tiền cuối cùng */}
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{finalTotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelOrder}
      />
    </div>
  );
}
