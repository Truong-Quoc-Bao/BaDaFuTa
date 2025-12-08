import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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
  Clock,
  ShoppingBag,
  Loader2,
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
  { id: 1, label: 'Đã đặt', icon: Check },
  { id: 2, label: 'Cất cánh', icon: Truck },
  { id: 3, label: 'Vận chuyển', icon: Package },
  { id: 4, label: 'Đã giao', icon: Home },
];

export const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const orderFromState = location.state?.order || null;
  const [order, setOrder] = useState(orderFromState || null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const droneMarkerRef = useRef(null);
  const mapRef = useRef(null);

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

    const startPos = [order.merchant_location.lat, order.merchant_location.lng];
    const endPos = [order.delivery_location.lat, order.delivery_location.lng];
    const distance = haversineDistance(startPos[0], startPos[1], endPos[0], endPos[1]);

    const PREP_TIME = 5000;
    const TAKEOFF_TIME = 5000;
    const MIN_FLIGHT_TIME = 20000;

    const droneSpeed = 200; // km/h
    let flightTime = (distance / droneSpeed) * 3600 * 1000;
    if (flightTime < MIN_FLIGHT_TIME) flightTime = MIN_FLIGHT_TIME;

    return {
      startPos,
      endPos,
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

    // Logic Reset: Nếu chưa có hoặc đã quá cũ -> Reset StartTime
    if (!startTime || now - parseInt(startTime) > flightData.totalDuration + 300000) {
      startTime = now;
      localStorage.setItem(storageKey, startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    let animationFrameId;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const { step, progress } = calculateState(elapsed, flightData);

      setCurrentStep(step);

      // Cập nhật vị trí Drone trực tiếp vào Ref (Siêu mượt)
      if (step === 3 && droneMarkerRef.current) {
        const { startPos, endPos } = flightData;
        const lat = startPos[0] + (endPos[0] - startPos[0]) * progress;
        const lng = startPos[1] + (endPos[1] - startPos[1]) * progress;

        droneMarkerRef.current.setLatLng([lat, lng]);
      } else if (step === 4 && droneMarkerRef.current) {
        droneMarkerRef.current.setLatLng(flightData.endPos);
      }

      if (elapsed <= flightData.totalDuration + 1000) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [flightData, order]); // Dependency an toàn

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
  const estimatedDelivery = new Date(new Date(order.created_at).getTime() + 15 * 60 * 1000);

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
  
  // --- COMPONENT PHỤ: Giúp lấy map instance ra ngoài ---
  const MapHandler = () => {
    const map = useMap();
    useEffect(() => {
      // Gán map instance vào ref của cha để dùng trong vòng lặp
      mapRef.current = map;
    }, [map]);
    return null;
  };

  // --- COMPONENT CON: TỰ ĐỘNG FOCUS KHI LOAD ---
  const FocusOnLoad = ({ flightData }) => {
    const map = useMap();
    const hasFocused = useRef(false); // Dùng cờ này để chỉ focus 1 lần đầu tiên

    useEffect(() => {
      // Nếu chưa có data hoặc đã focus rồi thì thôi
      if (!flightData || hasFocused.current) return;

      const orderKey = order.id || order._id || id;
      const storageKey = `order_${orderKey}_start_simulation`;
      const storedStart = localStorage.getItem(storageKey);

      if (storedStart) {
        const elapsed = Date.now() - parseInt(storedStart, 10);
        let targetPos = flightData.startPos;
        let zoomLevel = 15; // Zoom gần hơn chút để thấy drone rõ

        // 1. Nếu đã giao xong -> Focus điểm đến
        if (elapsed > flightData.totalDuration) {
          targetPos = flightData.endPos;
        }
        // 2. Nếu đang bay (Step 3) -> Tính tọa độ hiện tại
        else if (elapsed > flightData.prepTime + flightData.takeoffTime) {
          const flightElapsed = elapsed - flightData.prepTime - flightData.takeoffTime;
          const progress = flightElapsed / flightData.flightTime;

          const lat =
            flightData.startPos[0] + (flightData.endPos[0] - flightData.startPos[0]) * progress;
          const lng =
            flightData.startPos[1] + (flightData.endPos[1] - flightData.startPos[1]) * progress;
          targetPos = [lat, lng];
        }
        // 3. Nếu đang chuẩn bị/cất cánh -> Focus điểm đi
        else {
          targetPos = flightData.startPos;
        }

        // Thực hiện Focus
        map.setView(targetPos, zoomLevel, { animate: true, duration: 1 });
        hasFocused.current = true; // Đánh dấu là đã focus xong, để người dùng tự do kéo map sau đó
      }
    }, [flightData, map]);

    return null;
  };

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
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
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
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Dự kiến giao</p>
                    <p className="font-bold text-gray-800">
                      {estimatedDelivery.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
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
                  <FocusOnLoad flightData={flightData} />
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
                        color="#f97316"
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
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-green-600/30 text-lg font-semibold w-full md:w-auto transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                      <span>{order.delivered_at ? 'Giao lúc' : 'Dự kiến giao'}</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {order.delivered_at
                        ? formatDateTime(order.delivered_at)
                        : formatDateTime(estimatedDelivery)}
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
