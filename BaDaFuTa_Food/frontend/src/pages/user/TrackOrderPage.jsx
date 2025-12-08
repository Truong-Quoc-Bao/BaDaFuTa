import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Button } from '../../components/ui/button';
import L from 'leaflet';
import {
  MapPin,
  Map as MapIcon,
  MessageCircle,
  Phone,
  Target,
  Package,
  Truck,
  Bike,
  Check,
  Home,
  Star,
  ArrowLeft,
  ForkKnife,
  FileText,
  Calendar,
  CreditCard,
  Tag,
  Percent,
  DollarSign,
  Clock,
  ShoppingBag,
  Loader2,
  Battery,
  Wifi,
  Zap,
  Navigation,
  AlertTriangle,
  Wind,
  ShieldAlert,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

// Fix icon mặc định Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const timelineSteps = [
  { id: 1, label: 'Đã đặt', icon: Check },
  { id: 2, label: 'Cất cánh', icon: Truck },
  { id: 3, label: 'Vận chuyển', icon: Package },
  { id: 4, label: 'Đã giao', icon: Home },
];

// Component giúp lấy map instance ra ngoài
// --- SỬA LẠI COMPONENT NÀY ---
const MapHandler = React.memo(({ onMapReady, onZoomStart, onZoomEnd }) => {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);

    // Lắng nghe sự kiện Zoom
    map.on('zoomstart', onZoomStart);
    map.on('zoomend', onZoomEnd);

    // Dọn dẹp khi unmount
    return () => {
      map.off('zoomstart', onZoomStart);
      map.off('zoomend', onZoomEnd);
    };
  }, [map, onMapReady, onZoomStart, onZoomEnd]);
  return null;
});
// Component tự động focus khi mới vào
const FocusOnLoad = ({ flightData, orderId }) => {
  const map = useMap();
  const hasFocused = useRef(false);

  useEffect(() => {
    if (!flightData || hasFocused.current) return;

    const storageKey = `order_${orderId}_start_simulation`;
    const storedStart = localStorage.getItem(storageKey);

    if (storedStart) {
      const elapsed = Date.now() - parseInt(storedStart, 10);
      let targetPos = flightData.startPos;

      if (elapsed > flightData.totalDuration) {
        targetPos = flightData.endPos;
      } else if (elapsed > flightData.prepTime + flightData.takeoffTime) {
        const progress =
          (elapsed - flightData.prepTime - flightData.takeoffTime) / flightData.flightTime;
        const lat =
          flightData.startPos[0] + (flightData.endPos[0] - flightData.startPos[0]) * progress;
        const lng =
          flightData.startPos[1] + (flightData.endPos[1] - flightData.startPos[1]) * progress;
        targetPos = [lat, lng];
      } else {
        targetPos = flightData.startPos;
      }

      map.setView(targetPos, 15, { animate: true, duration: 1 });
      hasFocused.current = true;
    }
  }, [flightData, map, orderId]);

  return null;
};

export const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const orderFromState = location.state?.order || null;
  const [order, setOrder] = useState(orderFromState || null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(0);

  // --- THÊM VÀO TRONG TrackOrderPage (Chỗ khai báo Ref) ---
  const isZoomingRef = useRef(false); // Biến cờ: Đang zoom hay không?

  // Dùng useCallback để truyền xuống MapHandler không bị render lại
  const handleZoomStart = useCallback(() => {
    isZoomingRef.current = true;
  }, []);

  const handleZoomEnd = useCallback(() => {
    isZoomingRef.current = false;
  }, []);

  const [droneStats, setDroneStats] = useState({
    battery: 100,
    altitude: 0,
    speed: 0,
    signal: 100,
    status: 'NORMAL', // NORMAL, WARNING, REROUTING
    alertMessage: '',
    latLng: '0, 0', // Tọa độ hiện tại
    distanceRemaining: 0, // Km còn lại
    currentAddress: 'Đang định vị...',
  });

  // Ref để đảm bảo sự kiện chỉ nổ ra 1 lần
  const eventTriggeredRef = useRef(false);
  const droneMarkerRef = useRef(null);
  const mapRef = useRef(null);

  const [isAutoFollow, setIsAutoFollow] = useState(true); // State để đổi màu nút
  const isAutoFollowRef = useRef(true); // Ref để dùng trong vòng lặp animate (quan trọng)

  // Hàm bật tắt
  const toggleAutoFollow = () => {
    const nextState = !isAutoFollow;
    setIsAutoFollow(nextState);
    isAutoFollowRef.current = nextState; // Cập nhật Ref ngay lập tức
  };

  // --- 1. CÁC HÀM TIỆN ÍCH ---
  function formatDateTime(date) {
    if (!date) return 'Không có';
    return new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Hàm lấy địa chỉ từ tọa độ (Dùng LocationIQ token cũ của bạn)
  const fetchAddressName = async (lat, lng) => {
    try {
      const LOCATIONIQ_TOKEN = 'pk.4e0ece0ff0632fae5010642d702d5dfa';
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_TOKEN}&lat=${lat}&lon=${lng}&format=json&accept-language=vi`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.address) {
        // Lọc lấy Xã, Huyện, Tỉnh cho gọn
        const ward = data.address.suburb || data.address.quarter || data.address.village || '';
        const district = data.address.city_district || data.address.district || '';
        const city = data.address.city || data.address.state || '';

        // Ghép chuỗi: "P. Bến Nghé, Q.1, TP.HCM"
        const parts = [ward, district, city].filter((p) => p);
        return parts.length > 0 ? parts.join(', ') : 'Vùng không xác định';
      }
      return 'Đang bay qua vùng biển/rừng...';
    } catch (err) {
      return 'Mất tín hiệu vệ tinh...';
    }
  };

  // Fetch Order & LocationIQ
  async function getLatLngFromAddress(address) {
    if (!address) return null;
    const LOCATIONIQ_TOKEN = 'pk.4e0ece0ff0632fae5010642d702d5dfa';
    const cleanAddress = address
      .replace(/TP\.? ?HCM/g, 'Thành phố Hồ Chí Minh')
      .replace(/Q\.?/g, 'Quận')
      .trim();
    const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(
      cleanAddress,
    )}&format=json&limit=1&countrycodes=vn&addressdetails=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0 && !data.error)
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    if (order && !order.delivery_location && order.delivery_address) {
      getLatLngFromAddress(order.delivery_address).then((loc) => {
        if (loc) setOrder((prev) => ({ ...prev, delivery_location: loc }));
      });
    }
  }, [order]);

  useEffect(() => {
    if (!orderFromState && id) {
      fetch(`https://badafuta-production.up.railway.app/api/order/getOrder/${id}`)
        .then((res) => (res.ok ? res.json() : Promise.reject('Failed')))
        .then((data) => setOrder(data))
        .catch((err) => console.error(err));
    }
  }, [id, orderFromState]);

  // --- 2. LOGIC ANIMATION ĐÃ ĐƯỢC TỐI ƯU ---

  // a. Tính toán thông số bay (Chỉ tính lại khi order thay đổi)
  const flightData = useMemo(() => {
    if (!order || !order.merchant_location || !order.delivery_location) return null;

    const startPos = [Number(order.merchant_location.lat), Number(order.merchant_location.lng)];
    const endPos = [Number(order.delivery_location.lat), Number(order.delivery_location.lng)];
    const distance = haversineDistance(startPos[0], startPos[1], endPos[0], endPos[1]);

    const PREP_TIME = 5000;
    const TAKEOFF_TIME = 5000;
    const MIN_FLIGHT_TIME = 20000;

    const droneSpeed = 200; // km/h
    let flightTime = (distance / droneSpeed) * 3600 * 1000;
    if (flightTime < MIN_FLIGHT_TIME) flightTime = MIN_FLIGHT_TIME;

    console.log('Thời gian bay drone (ms):', flightTime);
    console.log(
      `Drone tốc độ ${droneSpeed} km/h → bay ${distance.toFixed(2)}km chỉ mất ${(
        flightTime / 1000
      ).toFixed(1)} giây`,
    );

    console.log('Distance (km):', distance);

    return {
      startPos,
      endPos,
      distance: distance || 0, // Fallback nếu NaN
      flightTime,
      prepTime: PREP_TIME,
      takeoffTime: TAKEOFF_TIME,
      totalDuration: PREP_TIME + TAKEOFF_TIME + flightTime,
    };
  }, [order]);

  // b. Hàm helper tính toán trạng thái hiện tại dựa trên thời gian trôi qua
  const calculateState = (elapsed, config) => {
    if (!config) return { step: 1, progress: 0 };

    if (elapsed > config.totalDuration) return { step: 4, progress: 1 };

    if (elapsed > config.prepTime + config.takeoffTime) {
      // Step 3: Đang bay
      const flightElapsed = elapsed - config.prepTime - config.takeoffTime;
      return { step: 3, progress: Math.min(flightElapsed / config.flightTime, 1) };
    }

    if (elapsed > config.prepTime) return { step: 2, progress: 0 }; // Cất cánh
    return { step: 1, progress: 0 }; // Chuẩn bị
  };

  // c. State Lazy Initialization: Tính ngay step khi component mount (Fix lỗi F5)
  const [currentStep, setCurrentStep] = useState(() => {
    if (!order || !flightData) return 1;

    const orderKey = order.id || order._id || id;
    const storageKey = `order_${orderKey}_start_simulation`;
    const storedStart = localStorage.getItem(storageKey);

    if (storedStart) {
      const elapsed = Date.now() - parseInt(storedStart, 10);
      // Nếu đã xong quá 5 phút -> Reset về 1 để demo lại
      if (elapsed > flightData.totalDuration + 5 * 60 * 1000) return 1;

      return calculateState(elapsed, flightData).step;
    }
    return 1;
  });

  // d. Effect chạy Animation Loop
  useEffect(() => {
    if (!flightData) return;
    const orderKey = order.id || order._id || id;
    const storageKey = `order_${orderKey}_start_simulation`;
    let startTime = localStorage.getItem(storageKey);
    let now = Date.now();

    if (!startTime || now - parseInt(startTime) > flightData.totalDuration + 300000) {
      startTime = now;
      localStorage.setItem(storageKey, startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    let animationFrameId;
    let lastUiUpdate = 0;
    let lastGeoCheck = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const { step, progress } = calculateState(elapsed, flightData);

      // 1. UPDATE DOM (60FPS - Mượt)
      if (step === 3 && droneMarkerRef.current && !isZoomingRef.current) {
        const lat =
          flightData.startPos[0] + (flightData.endPos[0] - flightData.startPos[0]) * progress;
        const lng =
          flightData.startPos[1] + (flightData.endPos[1] - flightData.startPos[1]) * progress;

        droneMarkerRef.current.setLatLng([lat, lng]);

        if (mapRef.current && isAutoFollowRef.current) {
          mapRef.current.setView([lat, lng], 15, { animate: false });
        }
      } else if (step === 4 && droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng(flightData.endPos);
        if (mapRef.current && isAutoFollowRef.current) {
          mapRef.current.setView(flightData.endPos, 15, { animate: true });
        }
      }

      // 2. UPDATE REACT STATE (10FPS - Không lag)
      if (currentTime - lastUiUpdate > 100 || step !== currentStep) {
        lastUiUpdate = currentTime;
        setCurrentStep(step);

        // Tính ETA
        if (step < 4) {
          const remainingMs = flightData.totalDuration - elapsed;
          const mins = Math.ceil(remainingMs / 60000);
          setEtaMinutes((prev) => (prev !== mins && mins > 0 ? mins : prev));
        } else setEtaMinutes(0);

        // Tính Stats
        let stats = {};
        if (step === 2)
          stats = {
            altitude: Math.min(50, ((elapsed - flightData.prepTime) / 100) * 2),
            speed: 15,
            status: 'NORMAL',
          };

        if (step === 3 && currentTime - lastGeoCheck > 3000) {
          lastGeoCheck = currentTime;

          // Tính tọa độ hiện tại
          const curLat =
            flightData.startPos[0] + (flightData.endPos[0] - flightData.startPos[0]) * progress;
          const curLng =
            flightData.startPos[1] + (flightData.endPos[1] - flightData.startPos[1]) * progress;

          // Gọi hàm lấy địa chỉ (Async nhưng không cần await để tránh chặn animation)
          fetchAddressName(curLat, curLng).then((addr) => {
            setDroneStats((prev) => ({ ...prev, currentAddress: addr }));
          });
        } else if (step === 3) {
          // --- TÍNH TOÁN VỊ TRÍ HIỆN TẠI ---
          const currentLat =
            flightData.startPos[0] + (flightData.endPos[0] - flightData.startPos[0]) * progress;
          const currentLng =
            flightData.startPos[1] + (flightData.endPos[1] - flightData.startPos[1]) * progress;

          // Tính khoảng cách còn lại (Tổng quãng đường * % chưa đi)
          let distRemain = flightData.distance * (1 - progress);
          if (isNaN(distRemain)) distRemain = 0; // Nếu NaN thì về 0

          stats = {
            battery: Math.max(20, 100 - progress * 80),
            altitude: 120 + Math.sin(currentTime / 500) * 5,
            speed: 200 + Math.cos(currentTime / 1000) * 10,
            signal: Math.max(70, 100 - progress * 20 + Math.random() * 5),
            latLng: `${currentLat.toFixed(4)}, ${currentLng.toFixed(4)}`, // Làm tròn 4 số lẻ
            distanceRemaining: distRemain.toFixed(2), // Làm tròn 2 số lẻ (VD: 3.52 km)
          };
          // Sự kiện ngẫu nhiên
          if (progress > 0.4 && progress < 0.7 && !eventTriggeredRef.current) {
            eventTriggeredRef.current = true;
            const events = [
              { msg: '⚠️ CẢNH BÁO: Phát hiện dây điện cao thế!', type: 'REROUTING' },
              { msg: '🚫 VÙNG CẤM BAY: Đang đổi hướng...', type: 'REROUTING' },
              { msg: '⛈️ THỜI TIẾT XẤU: Gió giật cấp 7', type: 'WARNING' },
            ];
            const evt = events[Math.floor(Math.random() * events.length)];
            setDroneStats((prev) => ({ ...prev, status: evt.type, alertMessage: evt.msg }));
            setTimeout(
              () => setDroneStats((prev) => ({ ...prev, status: 'NORMAL', alertMessage: '' })),
              5000,
            );
          }
        } else if (step === 4)
          stats = { altitude: 0, speed: 0, status: 'NORMAL', distanceRemaining: 0 };

        setDroneStats((prev) =>
          prev.status !== 'NORMAL' && step === 3
            ? { ...prev, ...stats, status: prev.status }
            : { ...prev, ...stats },
        );
      }

      if (elapsed <= flightData.totalDuration + 1000)
        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [flightData, order]);

  // --- 3. RENDER ---
  if (!order)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );

  const restaurantPos = order.merchant_location
    ? [order.merchant_location.lat, order.merchant_location.lng]
    : [0, 0];
  const deliveryPos = order.delivery_location
    ? [order.delivery_location.lat, order.delivery_location.lng]
    : null;
  // const estimatedDelivery = new Date(new Date(order.created_at).getTime() + 15 * 60 * 1000);

  let estimatedDelivery;
  if (flightData) {
    const storageKey = `order_${order.id || order._id || id}_start_simulation`;
    const storedStart = localStorage.getItem(storageKey);
    estimatedDelivery = storedStart
      ? new Date(parseInt(storedStart) + flightData.totalDuration)
      : new Date(Date.now() + flightData.totalDuration);
  } else estimatedDelivery = new Date(Date.now() + 15 * 60 * 1000);

  const handleBack = () => navigate('/my-orders');

  const droneIcon = new L.DivIcon({
    html: `
      <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="90" rx="44" ry="22" fill="#1e293b"/>
        <g class="drone-propellers"><circle cx="68" cy="68" r="20" fill="#fb923c" opacity="0.4"/><circle cx="132" cy="68" r="20" fill="#fb923c" opacity="0.4"/><circle cx="68" cy="112" r="20" fill="#fb923c" opacity="0.4"/><circle cx="132" cy="112" r="20" fill="#fb923c" opacity="0.4"/></g>
        <rect x="63" y="60" width="10" height="36" rx="5" fill="#fb923c"/><rect x="127" y="60" width="10" height="36" rx="5" fill="#fb923c"/><rect x="63" y="104" width="10" height="36" rx="5" fill="#fb923c"/><rect x="127" y="104" width="10" height="36" rx="5" fill="#fb923c"/>
        <rect x="82" y="125" width="36" height="42" rx="8" fill="#ea580c"/><rect x="82" y="125" width="36" height="10" fill="#f97316"/>
        <text x="100" y="148" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial">BĐPT</text>
        <line x1="90" y1="112" x2="88" y2="125" stroke="#94a3b8" stroke-width="4"/><line x1="110" y1="112" x2="112" y2="125" stroke="#94a3b8" stroke-width="4"/>
        <circle cx="100" cy="80" r="10" fill="#fb923c"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/></circle>
      </svg>`,
    className: 'custom-drone-icon',
    iconSize: [48, 68],
    iconAnchor: [24, 54],
    popupAnchor: [0, -50],
  });

  console.log('Order object received:', order);
  console.log('Order ID:', order?.order_id);

  console.log('lat:', order?.merchant_location.lat);
  console.log('lng:', order?.merchant_location.lng);

  console.log('👉 order.driver:', order.driver);
  console.log('👉 currentStep:', currentStep);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="hover:bg-orange-50 text-gray-600 hover:text-orange-600 pl-0 md:pl-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Quay lại danh sách</span>
          </Button>
        </div>
        <div className="flex justify-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-gray-600">
            Theo dõi đơn hàng
          </h2>
        </div>
        <div className="w-10 md:w-32"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Map & Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-orange-100/50 border border-orange-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Trạng thái hiện tại</p>
                  {/* THÊM: BẢNG CẢNH BÁO NGUY HIỂM */}
                  <AnimatePresence>
                    {droneStats.alertMessage && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded-r-lg overflow-hidden relative z-10 mt-4"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldAlert className="w-6 h-6 text-red-600 animate-bounce" />
                          <div>
                            <p className="font-bold text-red-700 text-sm">CẢNH BÁO AN TOÀN</p>
                            <p className="text-red-600 text-xs">{droneStats.alertMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center gap-2">
                    {currentStep === 1 && (
                      <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium text-sm">
                        Đang chuẩn bị
                      </span>
                    )}
                    {currentStep === 2 && (
                      <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium text-sm animate-pulse">
                        Drone đang cất cánh
                      </span>
                    )}
                    {currentStep === 3 && (
                      <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm animate-pulse">
                        Đang bay tới bạn
                      </span>
                    )}
                    {currentStep === 4 && (
                      <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium text-sm">
                        Giao thành công
                      </span>
                    )}
                  </div>
                </div>
                {/* --- KHỐI THỜI GIAN THÔNG MINH --- */}
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors duration-500 ${
                    // Nếu đang bay và còn dưới 5 phút -> Chuyển màu đỏ cảnh báo
                    currentStep === 3 && etaMinutes <= 5
                      ? 'bg-red-50 border border-red-100'
                      : 'bg-orange-50'
                  }`}
                >
                  {currentStep === 3 && etaMinutes <= 5 ? (
                    // Icon Chuông rung khi sắp đến
                    <div className="relative">
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <Clock className="w-5 h-5 text-red-500 animate-pulse" />
                    </div>
                  ) : (
                    // Icon Đồng hồ bình thường
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}

                  <div>
                    {/* LOGIC HIỂN THỊ TEXT */}
                    {currentStep === 4 ? (
                      // Case 1: Đã giao
                      <>
                        <p className="text-xs text-green-600 font-bold">Đã hoàn tất</p>
                        <p className="font-bold text-gray-800 text-sm">Thành công</p>
                      </>
                    ) : currentStep === 3 && etaMinutes <= 5 ? (
                      // Case 2: Sắp đến (< 5 phút) -> HIỆN CẢNH BÁO
                      <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">
                          Sắp đến nơi!
                        </p>
                        <p className="font-bold text-red-600 text-xs md:text-sm leading-tight">
                          Còn {etaMinutes} phút nữa
                          <br />
                          <span className="font-normal text-gray-600 text-[10px]">
                            Vui lòng chuẩn bị nhận hàng
                          </span>
                        </p>
                      </div>
                    ) : (
                      // Case 3: Còn xa -> Hiện giờ dự kiến
                      <>
                        <p className="text-xs text-gray-500">Dự kiến giao</p>
                        <p className="font-bold text-gray-800">
                          {estimatedDelivery.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative px-2">
                <div className="flex justify-between items-center relative z-10">
                  {timelineSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index + 1 < currentStep;
                    const isActive = index + 1 === currentStep;

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2 w-20">
                        <motion.div
                          className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${
                            isCompleted
                              ? 'bg-orange-500 border-orange-500 text-white shadow-orange-200'
                              : isActive
                              ? 'bg-white border-orange-500 text-orange-500 ring-4 ring-orange-50'
                              : 'bg-gray-50 border-gray-200 text-gray-400'
                          }`}
                        >
                          <StepIcon
                            className="w-5 h-5 md:w-6 md:h-6"
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                        </motion.div>
                        <span
                          className={`text-xs font-semibold text-center ${
                            isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-5 md:top-6 left-10 right-10 h-1 bg-gray-100 rounded-full -z-0">
                  <motion.div
                    className="h-full bg-orange-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white p-2 rounded-3xl shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden group">
              <div className="h-80 md:h-[450px] w-full rounded-2xl overflow-hidden relative z-0">
                <MapContainer
                  center={restaurantPos}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full outline-none"
                >
                  <FocusOnLoad flightData={flightData} orderId={order.id || order._id || id} />
                  <MapHandler
                    onMapReady={(map) => {
                      mapRef.current = map;
                    }}
                    onZoomStart={handleZoomStart}
                    onZoomEnd={handleZoomEnd}
                  />
                  <div className="absolute bottom-4 left-4 z-[500] flex flex-col gap-2">
                    <Button
                      className={`rounded-full shadow-lg transition-all px-4 py-2 flex items-center gap-2 ${
                        isAutoFollow
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleAutoFollow();
                      }}
                      onDoubleClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {isAutoFollow ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      <span className="text-xs font-semibold">
                        {isAutoFollow ? 'Tắt theo dõi' : 'Bật theo dõi'}
                      </span>
                    </Button>
                  </div>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  <Marker position={restaurantPos}>
                    <Popup className="font-sans">
                      <span className="font-bold">Nhà hàng:</span> {order.merchant_name}
                    </Popup>
                  </Marker>

                  {deliveryPos && (
                    <>
                      <Marker position={deliveryPos}>
                        <Popup className="font-sans">
                          <span className="font-bold">Nhà bạn</span>
                        </Popup>
                      </Marker>
                      <Polyline
                        positions={[restaurantPos, deliveryPos]}
                        color={droneStats.status !== 'NORMAL' ? '#ef4444' : '#f97316'} // Đỏ nếu lỗi, Cam nếu thường
                        weight={4}
                        dashArray="10, 10"
                        opacity={0.6}
                      />

                      {/* FIX: Luôn mount Marker nhưng dùng Opacity để ẩn hiện */}
                      {/* Giữ Ref luôn sống để không bị null khi F5 */}
                      <Marker
                        ref={droneMarkerRef}
                        icon={droneIcon}
                        position={restaurantPos}
                        opacity={currentStep >= 2 ? 1 : 0}
                        zIndexOffset={1000}
                      />
                    </>
                  )}
                </MapContainer>
              </div>
              {/* --- HUD MỚI (CHẾ ĐỘ 1 CỘT DỌC CHO MOBILE) --- */}
              {currentStep >= 2 && currentStep < 4 && (
                <div
                  className="
                  z-[400] font-mono text-xs rounded-xl border shadow-xl backdrop-blur-md transition-all
      
                  /* Cấu hình chung (Mobile + Desktop): */
                  /* Nằm dưới map (mt-3), Chiều rộng Full (w-full) */
                  mt-3 w-full 
                  
                  /* Màu sắc: Nền tối (Slate 900), Chữ trắng */
                  bg-slate-900 text-white border-slate-700 
                  
                  /* Bố cục: Xếp dọc (flex-col), khoảng cách 3, padding 4 */
                  flex flex-col gap-3 p-4
                "
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-1 md:mb-3 pb-2 border-b border-white/20">
                    <span className="font-bold text-orange-400 flex items-center gap-1">
                      <Target className="w-3 h-3" /> DRONE-01
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Wifi className="w-3 h-3" /> {Math.round(droneStats.signal)}%
                    </span>
                  </div>

                  {/* Nhóm 1: Thông tin vị trí */}
                  <div className="space-y-3 md:space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">GPS</span>
                      </div>
                      <div className="text-white text-xs font-medium leading-tight truncate">
                        {droneStats.latLng}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
                        <MapPin className="w-3 h-3" />
                        Đang bay qua:
                      </div>
                      <div className="text-white text-xs font-medium leading-tight truncate">
                        {droneStats.currentAddress}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Navigation className="w-3.5 h-3.5" /> DIST
                      </div>
                      <div className="font-bold text-orange-400">
                        {droneStats.distanceRemaining} km
                      </div>
                    </div>
                  </div>

                  {/* Đường kẻ phân cách (Giờ hiện cả trên Mobile cho dễ nhìn) */}
                  <div className="w-full h-[1px] bg-white/10 my-1"></div>

                  {/* Nhóm 2: Thông số kỹ thuật */}
                  <div className="space-y-3 md:space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Battery className="w-3.5 h-3.5" /> PIN
                      </div>
                      <div
                        className={`font-bold ${
                          droneStats.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'
                        }`}
                      >
                        {Math.round(droneStats.battery)}%
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Zap className="w-3.5 h-3.5" /> SPD
                      </div>
                      <div className="font-bold text-blue-400">
                        {Math.round(droneStats.speed)} km/h
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Wind className="w-3.5 h-3.5" /> ALT
                      </div>
                      <div className="font-bold text-yellow-400">
                        {Math.round(droneStats.altitude)} m
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Driver / Drone Info Overlay */}
              {currentStep >= 2 && (
                <div className="absolute top-4 right-4 z-[500]">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 max-w-[280px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3159/3159100.png"
                        alt="Drone"
                        className="w-6 h-6 invert"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">Drone A1 (Quad)</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
                        <span>5.0</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-orange-50 text-orange-500"
                      onClick={() => navigate(`/chat-driver/${order.driver?.id}`)}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            {currentStep === timelineSteps.length && !isDelivered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center shadow-sm"
              >
                <h3 className="text-lg font-bold text-green-700 mb-2">Đơn hàng đã đến nơi! 🎉</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Cảm ơn bạn đã sử dụng dịch vụ. Chúc bạn ngon miệng!
                </p>
                <Button
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-green-600/30 text-sm font-semibold w-full md:w-auto transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={async () => {
                    setIsUpdating(true);
                    try {
                      const apiId = order.id || order._id || order.order_id || id;
                      if (!apiId) return;

                      const res = await fetch(
                        `https://badafuta-production.up.railway.app/api/order/${apiId}/updateBody`,
                        {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            status: 'COMPLETED',
                            status_payment: 'SUCCESS',
                            delivered_at: new Date().toISOString(),
                          }),
                        },
                      );

                      if (!res.ok) throw new Error('Update failed');
                      const data = await res.json();

                      setIsDelivered(true);
                      navigate('/my-orders', {
                        state: { activeTab: 'COMPLETED', updatedOrder: data },
                      });
                    } catch (err) {
                      console.error('❌ Lỗi khi xác nhận:', err);
                      setIsUpdating(false);
                    }
                  }}
                >
                  {isUpdating ? (
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-6 h-6 mr-2" />
                  )}
                  {isUpdating ? 'Đang xử lý...' : 'Xác nhận đã nhận hàng'}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Cột phải: Thông tin đơn hàng */}
          <div className="space-y-6">
            {/* Locations Info */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Lộ trình
              </h3>

              <div className="flex flex-col">
                {/* TỪ */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white shadow-md z-10 shrink-0"></div>
                    <div className="w-0.5 bg-gray-300 flex-1 translate-y-1"></div>
                  </div>
                  <div className="flex flex-col gap-1 pb-8 w-full">
                    <p className="text-xs text-gray-400 font-medium">Điểm lấy hàng</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      {order?.merchant_name}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2">{order?.merchant_address}</p>
                    <p className="text-gray-400 text-xs">{order?.merchant_phone}</p>
                  </div>
                </div>

                {/* ĐẾN */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white shadow-md z-10 shrink-0"></div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <p className="text-xs text-gray-400 font-medium">Điểm giao hàng</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      {order.receiver_name}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2">{order?.delivery_address}</p>
                    <p className="text-gray-400 text-xs">{order.receiver_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                    Chi tiết đơn hàng
                  </h3>
                </div>

                <div className="px-4 py-2">
                  {order?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                      <div className="shrink-0">
                        {item?.image_item?.url ? (
                          <img
                            src={item.image_item.url}
                            alt={item.name_item}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 rounded-lg font-medium">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                            {item.name_item}
                          </p>
                          <span className="font-bold text-orange-600 text-sm whitespace-nowrap">
                            {Number(item.price).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Số lượng:{' '}
                          <span className="font-medium text-gray-900">x{item.quantity}</span>
                        </p>
                        <div className="mt-1.5 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100 text-xs text-gray-600 leading-snug">
                          Topping:{' '}
                          {item.options && item.options.length > 0
                            ? item.options
                                .map((opt) => `${opt.option_name} (${opt.option_item_name})`)
                                .join(', ')
                            : 'Hình như bạn chưa chọn topping cho món này!'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50/30 px-4 py-3 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Phí giao hàng</span>
                    </div>
                    <span className="font-medium text-gray-700">
                      {Number(order.delivery_fee).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span>Phí dịch vụ</span>
                    </div>
                    <span className="font-medium text-gray-700">{order.feesapply || '0đ'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Percent className="w-3.5 h-3.5 text-green-500" />
                      <span>Giảm giá</span>
                    </div>
                    <span className="font-medium text-green-600">
                      -{Number(order.discount || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-300 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-orange-600">
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Extra */}
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-700 font-bold mb-2 text-xs uppercase tracking-wide">
                  Thông tin thêm
                </h3>
                <div className="flex flex-col divide-y divide-gray-50 text-xs">
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <ForkKnife className="w-3.5 h-3.5 text-orange-500" />
                      <span>Dụng cụ</span>
                    </div>
                    <span className="font-medium text-gray-800">{order.utensils || 'Không'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Ghi chú</span>
                    </div>
                    <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
                      {order.note || 'Không'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="w-3.5 h-3.5 text-gray-600" />
                      <span>Mã đơn</span>
                    </div>
                    <span className="font-mono bg-gray-100 px-1.5 rounded text-[10px] text-gray-600 border border-gray-200">
                      {order.order_id || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-green-500" />
                      <span>Đặt lúc</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {formatDateTime(order.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      {/* SỬA Ở ĐÂY: Dựa vào currentStep để đổi chữ */}
                      <span>{currentStep === 4 ? 'Giao lúc' : 'Dự kiến giao'}</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {/* estimatedDelivery chính là thời điểm Drone chạm đích */}
                      {formatDateTime(estimatedDelivery)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Thanh toán</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {order.payment_method}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
