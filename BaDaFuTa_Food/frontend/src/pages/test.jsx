import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Button } from '../../components/ui/button';
import L from 'leaflet';
import {
  MapPin,
  MessageCircle,
  Phone,
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
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix icon mặc định Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const timelineSteps = [
  { id: 1, label: 'Đã đặt đơn', icon: Check },
  { id: 2, label: 'Drone cất cánh', icon: Truck },
  { id: 3, label: 'Drone vận chuyển', icon: Package },
  { id: 4, label: 'Giao thành công', icon: Home },
];

export const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ thêm dòng này
  const { id } = useParams();

  // order có thể đến qua state (navigate) hoặc fetch bằng param id
  const orderFromState = location.state?.order || null;
  const cameFrom = location.state?.from || null; // e.g. 'OrderSuccess' (nếu được set)

  const [order, setOrder] = useState(orderFromState || null);
  const [isDelivered, setIsDelivered] = useState(false);

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

  // Hàm tính khoảng cách giữa 2 điểm lat/lng (km)
  async function getLatLngFromAddress(address) {
    if (!address) return null;

    // YOUR FREE KEY ở đây (đăng ký xong copy-paste vào)
    const LOCATIONIQ_TOKEN = 'pk.4e0ece0ff0632fae5010642d702d5dfa'; // thay bằng key thật của bạn

    // Chuẩn hóa nhẹ địa chỉ (không cần quá tay)
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

      console.log('LocationIQ response:', data);

      if (data && data.length > 0 && !data.error) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      } else {
        console.warn('LocationIQ không tìm thấy:', cleanAddress);
        return null;
      }
    } catch (err) {
      console.error('Lỗi LocationIQ:', err);
      return null;
    }
  }

  // Sử dụng khi fetch order
  useEffect(() => {
    if (order && !order.delivery_location && order.delivery_address) {
      getLatLngFromAddress(order.delivery_address).then((loc) => {
        if (loc) setOrder((prev) => ({ ...prev, delivery_location: loc }));
      });
    }
  }, [order]);

  function haversineDistance(lat1, lng1, lat2, lng2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Khoảng cách từ quán → người nhận
  const distanceKm =
    order?.merchant_location && order?.delivery_location
      ? haversineDistance(
          order.merchant_location.lat,
          order.merchant_location.lng,
          order.delivery_location.lat,
          order.delivery_location.lng,
        )
      : 0;

  console.log('Địa chỉ giao hàng: ', order.delivery_address);
  console.log('Khoảng cách chim bay:', distanceKm, 'km');

  // TỐC ĐỘ DRONE
  const droneSpeed = 200;

  // Khoảng cách (km) → thời gian bay (ms) – giữ nguyên công thức cũ
  const droneTravelTime = (distanceKm / droneSpeed) * 60 * 60 * 1000; // km / (km/h) → giờ → ms

  console.log('Thời gian bay drone (ms):', droneTravelTime);
  console.log(
    `Drone tốc độ ${droneSpeed} km/h → bay ${distanceKm.toFixed(2)}km chỉ mất ${(
      droneTravelTime / 1000
    ).toFixed(1)} giây`,
  );

  // --- Helpers: orderKey (dùng để lưu localStorage) và apiId (dùng cho API) ---
  const orderKey = useMemo(() => {
    // prefer internal id, then order_id, then route param
    return (
      (order && (order.id || order._id || order.order_id)) ||
      (orderFromState && (orderFromState.id || orderFromState._id || orderFromState.order_id)) ||
      id ||
      null
    );
  }, [order, orderFromState, id]);

  // --- restore step & start time from localStorage keyed by orderKey ---
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const key = id ? `order_${id}_step` : null;
      const saved = key ? localStorage.getItem(key) : null;
      return saved ? Number(saved) : orderFromState?.currentStep || 1;
    } catch (e) {
      return orderFromState?.currentStep || 1;
    }
  });

  const [stepStartTime, setStepStartTime] = useState(() => {
    try {
      const key = id ? `order_${id}_step_start` : null;
      const saved = key ? localStorage.getItem(key) : null;
      return saved ? Number(saved) : Date.now();
    } catch (e) {
      return Date.now();
    }
  });

  // ref để giữ timer id
  const timerRef = useRef(null);

  // -------- Fetch order nếu cần (reload trường hợp mất state) --------
  useEffect(() => {
    // If we already have orderFromState, set it (and attempt to restore saved step/time)
    if (orderFromState) {
      setOrder(orderFromState);

      // restore saved step/start if exists for that order
      const keyBase =
        orderFromState.id || orderFromState._id || orderFromState.order_id || id || null;
      if (keyBase) {
        const savedStep = localStorage.getItem(`order_${keyBase}_step`);
        const savedStart = localStorage.getItem(`order_${keyBase}_step_start`);
        if (savedStep) setCurrentStep(Number(savedStep));
        if (savedStart) setStepStartTime(Number(savedStart));
      }
      return;
    }

    // else try fetch by route param id (most cases)
    if (id) {
      fetch(`https://badafuta-production.up.railway.app/api/order/getOrder/${id}`)
        // fetch(`/apiLocal/order/getOrder/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Fetch order failed');
          return res.json();
        })
        .then((data) => {
          setOrder(data);

          // restore saved step/start for fetched order
          const keyBase = data.id || data._id || data.order_id || id;
          const savedStep = localStorage.getItem(`order_${keyBase}_step`);
          const savedStart = localStorage.getItem(`order_${keyBase}_step_start`);
          if (savedStep) setCurrentStep(Number(savedStep));
          if (savedStart) setStepStartTime(Number(savedStart));
        })
        .catch((err) => {
          console.error('❌ Fetch order error:', err);
        });
    }
  }, [id, orderFromState]);

  // -------- Persist currentStep and stepStartTime keyed by the actual orderKey --------
  const stepDuration = 30000; // 20s mỗi step

  useEffect(() => {
    if (!orderKey) return;

    const savedStep = Number(localStorage.getItem(`order_${orderKey}_step`)) || 1;
    const savedStart = Number(localStorage.getItem(`order_${orderKey}_step_start`)) || Date.now();

    const now = Date.now();
    const stepsPassed = Math.floor((now - savedStart) / stepDuration);
    const updatedStep = Math.min(savedStep + stepsPassed, timelineSteps.length);

    setCurrentStep(updatedStep);

    // reset stepStartTime cho step hiện tại
    setStepStartTime(now - ((now - savedStart) % stepDuration));

    // update localStorage
    localStorage.setItem(`order_${orderKey}_step`, updatedStep);
    localStorage.setItem(`order_${orderKey}_step_start`, now - ((now - savedStart) % stepDuration));
  }, [orderKey]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  if (!order) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

  const restaurantPos = order.merchant_location
    ? [order.merchant_location.lat, order.merchant_location.lng]
    : [0, 0];

  const deliveryPos = order.delivery_location
    ? [order.delivery_location.lat, order.delivery_location.lng]
    : null;

  const createdAt = new Date(order.created_at);
  const estimatedDelivery = new Date(createdAt.getTime() + 10 * 60 * 1000);
  // Xác định màu theo trạng thái
  const truckColor = () => {
    switch (currentStep) {
      case 1:
        return 'text-gray-400'; // chuẩn bị
      case 2:
        return 'text-orange-400'; // đang nhận đơn
      case 3:
        return 'text-blue-500'; // đang vận chuyển
      case 4:
        return 'text-green-500'; // đã giao
      default:
        return 'text-gray-400';
    }
  };

  console.log('👉 order.driver:', order.driver);
  console.log('👉 currentStep:', currentStep);

  const handleBack = () => {
    navigate('/my-orders');
  };
  // Tạo SVG icon máy bay
  const droneIcon = new L.DivIcon({
    html: `
      <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Thân drone đen bóng -->
        <ellipse cx="100" cy="90" rx="44" ry="22" fill="#1e293b"/>
        <ellipse cx="100" cy="86" rx="30" ry="12" fill="#334155"/>
        
        <!-- 4 cánh quạt + hiệu ứng quay nhẹ (dùng CSS nếu cần) -->
        <g class="drone-propellers">
          <circle cx="68" cy="68" r="20" fill="#fb923c" opacity="0.4"/>
          <circle cx="132" cy="68" r="20" fill="#fb923c" opacity="0.4"/>
          <circle cx="68" cy="112" r="20" fill="#fb923c" opacity="0.4"/>
          <circle cx="132" cy="112" r="20" fill="#fb923c" opacity="0.4"/>
        </g>
        
        <!-- Cánh quạt thật -->
        <rect x="63" y="60" width="10" height="36" rx="5" fill="#fb923c"/>
        <rect x="127" y="60" width="10" height="36" rx="5" fill="#fb923c"/>
        <rect x="63" y="104" width="10" height="36" rx="5" fill="#fb923c"/>
        <rect x="127" y="104" width="10" height="36" rx="5" fill="#fb923c"/>
        
        <!-- Hộp đồ ăn Ba Đa Phu Ta treo lủng lẳng -->
        <rect x="82" y="125" width="36" height="42" rx="8" fill="#ea580c"/>
        <rect x="82" y="125" width="36" height="10" fill="#f97316"/>
        <text x="100" y="148" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Arial, sans-serif">BĐPT</text>
        
        <!-- Dây treo hộp -->
        <line x1="90" y1="112" x2="88" y2="125" stroke="#94a3b8" stroke-width="4"/>
        <line x1="110" y1="112" x2="112" y2="125" stroke="#94a3b8" stroke-width="4"/>
        
        <!-- Đèn LED cam nhấp nháy -->
        <circle cx="100" cy="80" r="10" fill="#fb923c">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Hiệu ứng phát sáng nhẹ -->
        <circle cx="100" cy="80" r="16" fill="#fb923c" opacity="0.3"/>
      </svg>
    `,
    className: 'custom-drone-icon', // để thêm CSS nếu cần animate
    iconSize: [48, 68], // chiều ngang 48px, cao 68px (vì có hộp treo)
    iconAnchor: [24, 54], // neo đúng giữa đáy hộp đồ ăn (nhìn tự nhiên khi di chuyển)
    popupAnchor: [0, -50],
  });

  // For UI: compute stepProgress for active step using stepStartTime
  const activeElapsed = Math.min(Math.max(0, Date.now() - stepStartTime), 20000);

  const droneAnimationStarted = useRef(false);
  const droneAnimationStartTime = useRef(null); // Lưu thời gian thực tế bắt đầu bay

  console.log('Order object received:', order);
  console.log('Order ID:', order?.order_id);

  console.log('lat:', order?.merchant_location.lat);
  console.log('lng:', order?.merchant_location.lng);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Tiêu đề */}
      {/* Nút back  */}
      <Button onClick={handleBack} variant="outline" className="mb-6 mt-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại Đơn hàng của tôi
      </Button>
      {/* <div className="max-w-2xl mx-auto space-y-6"> */}
      {/* Tiêu đề */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Theo dõi đơn hàng</h2>
      </div>

      {/* Khối thông tin */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm text-gray-700 text-sm space-y-4">
        {/* Dự kiến giao hàng */}
        <div className="flex items-center space-x-3 w-full">
          <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <p className="text-gray-600 text-sm md:text-base">
            Dự kiến giao hàng:{' '}
            <span className="font-semibold text-orange-500">
              {estimatedDelivery.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
        </div>

        {/* Trạng thái tài xế */}
        <div className="flex items-center space-x-3 w-full">
          <Truck className={`w-6 h-6 flex-shrink-0 ${truckColor()}`} />
          <p className="text-gray-600 text-sm md:text-base break-words">
            {currentStep === 1 && 'Đơn hàng đang chuẩn bị...'}
            {currentStep === 2 && 'Drone đang cất cánh...'}
            {currentStep === 3 && 'Drone đang vận chuyển đơn hàng...'}
            {currentStep === 4 && 'Đơn đã giao thành công 🎉'}
          </p>
        </div>
      </div>

      {/* </div> */}

      {/* Timeline responsive */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 relative">
        {timelineSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index + 1 < currentStep;
          const isActive = index + 1 === currentStep;

          const stepDuration = 20000;
          const now = Date.now();
          const elapsed = Math.max(0, now - stepStartTime);
          const stepProgress = Math.min(elapsed / stepDuration, 1);

          return (
            <div
              key={step.id}
              className="flex md:flex-1 flex-col items-center text-center relative"
            >
              {/* Line between steps */}
              {index < timelineSteps.length - 1 && (
                <div
                  className="hidden md:block absolute top-5 left-2/2 transform -translate-x-1/2 h-1 z-0 bg-gray-300 overflow-visible"
                  style={{ width: '100%' }}
                >
                  {/* Thanh màu cam tải dần */}
                  <motion.div
                    key={`progress-${currentStep}`}
                    className="h-full bg-orange-500 origin-left"
                    initial={{ scaleX: isCompleted ? 1 : stepProgress }}
                    animate={{ scaleX: isCompleted ? 1 : isActive ? 1 : 0 }}
                    transition={{
                      duration: isActive ? (1 - stepProgress) * 20 : 0,
                      ease: 'linear',
                    }}
                  />
                </div>
              )}

              {/* Icon */}
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 mb-2 z-10"
                initial={{
                  backgroundColor: '#f3f3f3', // gray ban đầu
                  borderColor: '#d1d5db',
                  color: '#9ca3af',
                }}
                animate={{
                  backgroundColor: isCompleted
                    ? '#f97316' // bg-orange-500 hoàn thành
                    : isActive
                    ? ['#f3f3f3', '#f97316'] // từ gray → cam dần
                    : '#f3f3f3', // chưa tới: gray
                  borderColor: isCompleted
                    ? '#f97316'
                    : isActive
                    ? ['#d1d5db', '#fb923c'] // từ gray → border-orange-400
                    : '#d1d5db',
                  color: isCompleted
                    ? '#ffffff'
                    : isActive
                    ? ['#9ca3af', '#f97316'] // text từ gray → cam
                    : '#9ca3af',
                }}
                transition={{
                  duration: isActive ? 3 : 0, // chạy từ từ trong 3 giây khi active
                  ease: 'easeInOut',
                }}
              >
                <StepIcon
                  className="w-5 h-5 md:w-6 md:h-6"
                  style={{
                    stroke: isCompleted || isActive ? '#ffffff' : '#9ca3af',
                  }}
                />
              </motion.div>

              {/* Label */}
              <motion.span
                className="text-xs md:text-sm font-medium"
                initial={{ color: '#9ca3af' }} // xám ban đầu
                animate={{
                  color: isCompleted
                    ? '#f97316' // cam full nếu đã hoàn thành
                    : isActive
                    ? ['#9ca3af', '#f97316'] // chuyển từ xám → cam mượt
                    : '#9ca3af', // chưa tới step
                }}
                transition={{ duration: isActive ? 3 : 0, ease: 'easeInOut' }}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
      {/* Map */}
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={restaurantPos}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={restaurantPos}>
            <Popup>
              Nhà hàng: {order.merchant_name} <br />
              Địa chỉ: {order.merchant_address || 'Không có'}
            </Popup>
          </Marker>
          {deliveryPos && (
            <Marker position={deliveryPos}>
              <Popup>Địa chỉ giao hàng: {order.delivery_address}</Popup>
            </Marker>
          )}
          {deliveryPos && <Polyline positions={[restaurantPos, deliveryPos]} color="orange" />}
          {/* Drone bay realtime */}
          {currentStep >= 2 && deliveryPos && (
            <Marker
              icon={droneIcon}
              position={restaurantPos} // vẫn để position ban đầu để Leaflet không lỗi
              ref={(marker) => {
                if (!marker || !deliveryPos) return;

                // === 1. Kiểm tra đã từng bắt đầu animation chưa ===
                const storageKey = `order_${orderKey}_drone_anim`;
                const saved = localStorage.getItem(storageKey);
                let shouldStartNew = !saved;

                if (!droneAnimationStarted.current) {
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    droneAnimationStartTime.current = parsed.startTime;
                    droneAnimationStarted.current = true;
                  } else {
                    // Chưa từng bay → bắt đầu mới
                    droneAnimationStartTime.current = Date.now();
                    droneAnimationStarted.current = true;
                    localStorage.setItem(
                      storageKey,
                      JSON.stringify({ startTime: droneAnimationStartTime.current }),
                    );
                  }
                }

                // Nếu đã tới nơi rồi (bước 4+) → đặt luôn vị trí đích + thoát
                if (currentStep >= 4) {
                  marker.setLatLng(deliveryPos);
                  return;
                }

                // === 2. Tính toán thông số bay ===
                const startPos = restaurantPos;
                const endPos = deliveryPos;
                const totalDistance = haversineDistance(
                  startPos[0],
                  startPos[1],
                  endPos[0],
                  endPos[1],
                );

                const speedKmh = 200;
                const duration = (totalDistance / speedKmh) * 3600 * 1000; // ms

                // Thời gian đã trôi qua kể từ lúc thực sự bắt đầu bay
                const timeElapsed = Date.now() - droneAnimationStartTime.current;

                // Nếu đã bay quá duration → nhảy thẳng tới đích
                if (timeElapsed >= duration) {
                  marker.setLatLng(endPos);
                  if (currentStep < 4) {
                    setCurrentStep(4);
                    localStorage.setItem(`order_${orderKey}_step`, '4');
                    localStorage.setItem(`order_${orderKey}_step_start`, Date.now().toString());
                  }
                  return;
                }

                // === 3. Hàm animation ===
                function animate(time) {
                  if (!marker?.setLatLng) return;

                  const elapsed = Date.now() - droneAnimationStartTime.current;
                  const t = Math.min(elapsed / duration, 1);

                  const lat = startPos[0] + (endPos[0] - startPos[0]) * t;
                  const lng = startPos[1] + (endPos[1] - startPos[1]) * t;

                  marker.setLatLng([lat, lng]);

                  if (t < 1) {
                    requestAnimationFrame(animate);
                  } else {
                    // ĐÃ TỚI NƠI
                    if (currentStep < 4) {
                      setCurrentStep(4);
                      localStorage.setItem(`order_${orderKey}_step`, '4');
                      localStorage.setItem(`order_${orderKey}_step_start`, Date.now().toString());
                    }
                    // Xóa data cũ nếu muốn (tùy bạn)
                    // localStorage.removeItem(storageKey);
                  }
                }

                // Bắt đầu animation (chỉ chạy 1 lần duy nhất)
                if (shouldStartNew || !marker._animationRunning) {
                  marker._animationRunning = true;
                  setTimeout(() => requestAnimationFrame(animate), 300);
                }
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* ✅ Driver Info chỉ hiện khi currentStep ≥ 2 */}
      {currentStep >= 2 && (
        <div className="mt-4 bg-gray-50 p-4 md:p-3 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 text-gray-700 text-sm">
          <span className="font-medium ">Drone giao hàng:</span>
          {/* Ảnh + thông tin */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-wrap">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3159/3159100.png" // icon drone
              alt="Drone avatar"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
              {/* Tên drone */}
              <span className="text-gray-500">Drone A1 |</span>
              {/* Loại drone */}
              <span className="text-gray-500 flex items-center">
                {/* <DeliveryDrone className="w-4 h-4 mr-1 text-orange-500" /> */}
                Loại: QuadCopter
              </span>
              {/* Rating */}
              <span className="text-gray-500">5.0</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
          </div>

          {/* Nút nhắn tin */}
          <button
            onClick={() => navigate(`/chat-driver/${testOrder.driver?.id}`)}
            className="mt-2 md:mt-0 ml-0 md:ml-auto flex items-center gap-1 text-gray-500 hover:text-orange-600 transition"
          >
            <MessageCircle className="w-4 h-4 text-orange-500 " />
            <span>Nhắn tin</span>
          </button>
        </div>
      )}
      {currentStep === timelineSteps.length && !isDelivered && (
        <div className="mt-6 flex flex-col items-center gap-2 px-4">
          {/* Text nằm trên nút */}
          <p className="text-gray-500 text-center text-sm max-w-xs">
            Đơn hàng đã được giao đến, vui lòng nhấn "Đã nhận hàng"
          </p>

          {/* Nút */}
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center"
            onClick={async () => {
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
                console.error('❌ Lỗi khi xác nhận đã nhận hàng:', err);
              }
            }}
          >
            <Check className="w-5 h-5 mr-2" />
            Đã nhận hàng
          </Button>
        </div>
      )}

      {/* Order info responsive */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-2 text-sm text-gray-500 md:text-base">
        {/* <p className="text-lg">Thông tin đơn hàng</p> */}

        <div className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-sm">
          {/* Từ */}
          <div className="flex items-start space-x-2">
            {/* Chấm trạng thái */}
            <span className="w-3 h-3 mt-1 rounded-full bg-orange-500 flex-shrink-0"></span>

            <div className="flex flex-col">
              {/* Từ: Tên quán" */}
              <div className="flex space-x-1 items-center">
                <span className="text-gray-700 font-semibold">Từ: </span>
                <span className="text-gray-600 font-medium">
                  {order?.merchant_name || 'Đang tải tên quán...'}
                </span>
              </div>
              {/* Địa chỉ */}
              <span className="text-gray-500 text-sm">
                {order?.merchant_address || 'Đang tải địa chỉ...'}
              </span>
              <span className="text-gray-500 text-sm">{order?.merchant_phone}</span>
            </div>
          </div>

          {/* Line nối */}
          <div className="w-0.5 bg-gray-300 h-6 mx-1 ml-1"></div>

          {/* Đến */}
          <div className="flex items-start space-x-2">
            {/* Chấm xanh */}
            <span className="w-3 h-3 mt-1 rounded-full bg-green-500 flex-shrink-0"></span>

            {/* Nội dung Đến */}
            <div className="flex flex-col">
              {/* Hàng chữ "Đến: Địa chỉ" */}
              <div className="flex items-center space-x-1">
                <span className="text-gray-700 font-semibold">Đến: </span>
                <span className="text-gray-600 font-medium">
                  {order?.delivery_address || 'Đang tải địa chỉ...'}
                </span>
              </div>

              {/* Tên + số điện thoại */}
              <span className="text-gray-500 text-sm mt-1">
                {order.receiver_name || 'Đang tải tên người nhận...'} |{' '}
                {order.receiver_phone || 'Đang tải số điện thoại...'}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {/* Tóm tắt đơn hàng */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h2>

            {order?.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-2 rounded-lg bg-gray-100 transition"
              >
                {/* Hình món */}
                {item?.image_item?.url ? (
                  <img
                    src={item.image_item.url}
                    alt={item.name_item}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded-lg">
                    No Image
                  </div>
                )}
                {/* Tên + số lượng + topping */}
                <div className="flex-1 flex flex-col">
                  <span className="font-medium text-gray-800">Tên món: {item.name_item}</span>
                  <span className="text-sm">Số lượng: {item.quantity}</span>
                  <span className="text-sm">
                    Giá: {Number(item.price).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-sm">
                    Topping:{' '}
                    {item.options
                      .map((opt) => `${opt.option_name} (${opt.option_item_name})`)
                      .join(', ') || 'Hình như bạn chưa chọn topping cho món này!'}
                  </span>
                </div>
              </div>
            ))}
            <div className="text-sm space-y-2">
              {/* <div className="flex justify-between items-center"> */}
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">Phí giao hàng:</span>
                </div>
                <span className="text-gray-600">
                  {Number(order.delivery_fee).toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Phí áp dụng:</span>
                </div>
                <span className="text-gray-600">{order.feesapply || 'Không có'}</span>
              </div>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
                <div className="flex items-center space-x-2">
                  <Percent className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Giảm giá:</span>
                </div>
                <span className="text-gray-600">{order.discount || '0'}đ</span>
              </div>

              <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600">Tổng tiền:</span>
                </div>
                <span className="font-bold text-gray-800">
                  {Number(order.total_amount).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
          {/* Thông tin đơn hàng */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 pb-2">Thông tin đơn hàng</h2>

            {/* Dụng cụ ăn uống */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
              <div className="flex items-center space-x-2">
                <ForkKnife className="w-4 h-4 text-orange-500" />
                <span>Dụng cụ ăn uống</span>
              </div>
              <span className="text-gray-600">{order.utensils || 'Không có'}</span>
            </div>

            {/* Ghi chú */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2 ">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Ghi chú</span>
              </div>
              <span className="text-gray-600">{order.note || 'Không có'}</span>
            </div>
            {/* Mã đơn */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2 ">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Mã đơn</span>
              </div>
              <span className="text-gray-600 text-right">{order.order_id || 'Không có'}</span>
            </div>
            {/* Thời gian đặt hàng */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span>Thời gian đặt hàng</span>
              </div>
              <span className="text-gray-600 text-right">{formatDateTime(order.created_at)}</span>
            </div>

            {/* Giao lúc (nếu có) */}
            {order.delivered_at && (
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>Giao lúc</span>
                </div>
                <span className="text-gray-600">{formatDateTime(order.delivered_at)}</span>
              </div>
            )}

            {/* Thanh toán */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600 px-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <span>Thanh toán</span>
              </div>
              <span className="text-gray-600">{order.payment_method}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* Restaurant Header Section - FIX HOÀN HẢO CHO MOBILE */
}
<div className="relative grid grid-cols-1 lg:grid-cols-10 gap-0 rounded-2xl overflow-hidden bg-gray-900 my-8 shadow-lg max-w-7xl mx-auto">
  {/* LEFT: Ảnh bìa */}
  <div className="relative lg:col-span-4 h-[28vh] lg:h-[300px] overflow-hidden">
    <ImageWithFallback
      src={restaurant?.cover_image?.url}
      alt={restaurant?.merchant_name || 'Restaurant cover'}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  </div>

  {/* RIGHT: Thông tin nhà hàng + Nút Yêu thích KHÔNG che tên */}
  <div className="relative lg:col-span-6 bg-gray-800 px-6 md:px-8 lg:px-10 py-6 md:py-8">
    {/* NÚT YÊU THÍCH - ĐẶT Ở ĐÂY ĐỂ KHÔNG CHE TÊN NHÀ HÀNG */}
    <div className="absolute top-5 right-5 z-30">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleToggleFavorite}
        className={`
          flex items-center justify-center gap-2 px-5 py-3 rounded-full border shadow-2xl backdrop-blur-md transition-all duration-300
          ${
            isFavorite
              ? 'bg-white text-orange-500 shadow-orange-500/30'
              : 'bg-black/40 border-white/30 text-white hover:bg-black/50'
          }
        `}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.6, 1], rotate: [0, 20, -20, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Star
            className={`w-5 h-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-white'}`}
          />
        </motion.div>
        <span className="text-sm font-bold hidden sm:inline">
          {isFavorite ? 'Đã thích' : 'Yêu thích'}
        </span>
      </motion.button>
    </div>

    {/* Nội dung tên + badge - được đẩy xuống một chút trên mobile để KHÔNG bị che */}
    <div className="pt-12 sm:pt-0">
      {' '}
      {/* Quan trọng: pt-12 trên mobile để chừa chỗ cho nút */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {restaurant?.merchant_name || 'Đang tải...'}
        </h1>
        <Award className="w-6 h-6 text-yellow-400 flex-shrink-0" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
          {restaurant?.cuisine || 'Ẩm thực'}
        </Badge>
        <Badge variant="outline" className="bg-gray-600 border-gray-500 text-white px-3 py-1">
          Cao cấp
        </Badge>
      </div>
    </div>

    {/* Phần stats giữ nguyên */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
      {/* ... các ô rating, thời gian, phí ship ... */}
    </div>
  </div>
</div>;
