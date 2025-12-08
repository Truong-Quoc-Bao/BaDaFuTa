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

  // Tính khoảng cách (km)
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

  // --- 2. STATE CHO ANIMATION ---
  const [currentStep, setCurrentStep] = useState(1);
  const droneMarkerRef = useRef(null); // Ref để điều khiển marker trực tiếp (mượt hơn state)

  // Thời gian giả lập cho demo (ms)
  const PREP_TIME = 5000; // 5 giây chuẩn bị
  const TAKEOFF_TIME = 5000; // 5 giây cất cánh
  const MIN_FLIGHT_TIME = 20000; // Bay tối thiểu 20 giây (để kịp nhìn)

  // Fetch Order & LocationIQ (Giữ nguyên logic cũ của bạn)
  async function getLatLngFromAddress(address) {
    /* ... (Giữ nguyên code getLatLngFromAddress cũ của bạn) ... */
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

  // Fetch order by ID nếu không có state (Giữ nguyên)
  useEffect(() => {
    if (!orderFromState && id) {
      fetch(`https://badafuta-production.up.railway.app/api/order/getOrder/${id}`)
        .then((res) => (res.ok ? res.json() : Promise.reject('Failed')))
        .then((data) => setOrder(data))
        .catch((err) => console.error(err));
    }
  }, [id, orderFromState]);

  // --- 3. LOGIC REALTIME ANIMATION (QUAN TRỌNG) ---
  useEffect(() => {
    if (!order || !order.merchant_location || !order.delivery_location) return;

    // 1. Tính toán thông số bay
    const startPos = [order.merchant_location.lat, order.merchant_location.lng];
    const endPos = [order.delivery_location.lat, order.delivery_location.lng];
    const distance = haversineDistance(startPos[0], startPos[1], endPos[0], endPos[1]);

    // Tốc độ giả lập: đảm bảo bay ít nhất MIN_FLIGHT_TIME
    const droneSpeed = 200; // km/h
    let flightTime = (distance / droneSpeed) * 3600 * 1000;
    if (flightTime < MIN_FLIGHT_TIME) flightTime = MIN_FLIGHT_TIME;

    // Tổng thời gian quy trình
    const totalDuration = PREP_TIME + TAKEOFF_TIME + flightTime;

    // 2. Xác định thời điểm bắt đầu (Lưu vào localStorage để F5 không bị reset từ đầu)
    const orderKey = order.id || order._id || id;
    const storageKey = `order_${orderKey}_start_simulation`;
    let startTime = localStorage.getItem(storageKey);

    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    // 3. Vòng lặp Animation Frame
    let animationFrameId;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      // --- CẬP NHẬT STEP ---
      let nextStep = 1;
      if (elapsed > totalDuration) {
        nextStep = 4; // Đã giao
      } else if (elapsed > PREP_TIME + TAKEOFF_TIME) {
        nextStep = 3; // Đang bay
      } else if (elapsed > PREP_TIME) {
        nextStep = 2; // Cất cánh
      } else {
        nextStep = 1; // Chuẩn bị
      }

      setCurrentStep((prev) => (prev !== nextStep ? nextStep : prev));

      // --- CẬP NHẬT VỊ TRÍ DRONE (Chỉ khi ở Step 3) ---
      if (nextStep === 3 && droneMarkerRef.current) {
        // Tính % quãng đường đã bay
        // flightElapsed chạy từ 0 -> flightTime
        const flightElapsed = elapsed - PREP_TIME - TAKEOFF_TIME;
        const progress = Math.min(flightElapsed / flightTime, 1);

        // Nội suy tọa độ (Interpolation)
        const lat = startPos[0] + (endPos[0] - startPos[0]) * progress;
        const lng = startPos[1] + (endPos[1] - startPos[1]) * progress;

        droneMarkerRef.current.setLatLng([lat, lng]);
      } else if (nextStep === 4 && droneMarkerRef.current) {
        // Nếu đã giao xong, set cứng vị trí tại nhà khách
        droneMarkerRef.current.setLatLng(endPos);
      }

      // Tiếp tục lặp nếu chưa xong hẳn
      if (elapsed <= totalDuration + 1000) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Bắt đầu chạy
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [order]); // Chạy lại khi order load xong

  // --- 4. CÁC BIẾN HIỂN THỊ ---
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
  const estimatedDelivery = new Date(new Date(order.created_at).getTime() + 15 * 60 * 1000); // Giả lập +15p

  const handleBack = () => navigate('/my-orders');

  // Icon Drone
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

  /* ... (PHẦN RETURN Ở DƯỚI) ... */

  const droneAnimationStarted = useRef(false);
  const droneAnimationStartTime = useRef(null);

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
        <div className="w-10 md:w-32"></div> {/* Spacer for alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Map & Status (Chiếm 2 phần) */}
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
                {/* Progress Bar Background */}
                <div className="absolute top-5 md:top-6 left-10 right-10 h-1 bg-gray-100 rounded-full -z-0">
                  {/* Active Progress Bar */}
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
            {/* Map Section */}
            <div className="bg-white p-2 rounded-3xl shadow-xl shadow-gray-200/50 border border-white relative overflow-hidden group">
              <div className="h-80 md:h-[450px] w-full rounded-2xl overflow-hidden relative z-0">
                <MapContainer
                  center={restaurantPos}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full outline-none"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />
                  {/* Nhà hàng */}
                  <Marker position={restaurantPos}>
                    <Popup className="font-sans">
                      <span className="font-bold">Nhà hàng:</span> {order.merchant_name}
                    </Popup>
                  </Marker>

                  {/* Nhà khách */}
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
                    </>
                  )}

                  {/* --- DRONE MARKER (Đã đơn giản hóa) --- */}
                  {/* Chỉ hiển thị Drone khi bắt đầu cất cánh (Step >= 2) */}
                  {currentStep >= 2 && deliveryPos && (
                    <Marker
                      ref={droneMarkerRef} // Gán ref để logic trên kia điều khiển
                      icon={droneIcon}
                      position={restaurantPos} // Vị trí khởi đầu
                      zIndexOffset={1000} // Luôn nổi lên trên
                    />
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
                  disabled={isUpdating} // 1. Vô hiệu hóa khi đang load
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-green-600/30 text-lg font-semibold w-full md:w-auto transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={async () => {
                    setIsUpdating(true); // 2. Bắt đầu quay
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
                      setIsUpdating(false); // 3. Tắt quay nếu gặp lỗi để bấm lại
                    }
                  }}
                >
                  {isUpdating ? (
                    // Icon quay quay
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  ) : (
                    // Icon check cũ
                    <Check className="w-6 h-6 mr-2" />
                  )}
                  {isUpdating ? 'Đang xử lý...' : 'Xác nhận đã nhận hàng'}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Cột phải: Thông tin đơn hàng (Chiếm 1 phần) */}
          <div className="space-y-6">
            {/* Locations Info */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Lộ trình
              </h3>

              <div className="flex flex-col">
                {/* --- KHỐI 1: TỪ (Bao gồm cả đường kẻ nối xuống) --- */}
                <div className="flex gap-3">
                  {/* Cột Icon: Chấm cam + Line */}
                  <div className="flex flex-col items-center">
                    {/* Chấm cam */}
                    <div className="mt-1 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white shadow-md z-10 shrink-0"></div>
                    {/* Đường kẻ: flex-1 để tự giãn hết chiều cao khối này + translate-y để nối vào chấm dưới */}
                    <div className="w-0.5 bg-gray-300 flex-1 translate-y-1"></div>
                  </div>

                  {/* Cột Nội dung: Thêm pb-6 để đẩy khối dưới ra xa */}
                  <div className="flex flex-col gap-1 pb-8 w-full">
                    <p className="text-xs text-gray-400 font-medium">Điểm lấy hàng</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      {order?.merchant_name}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-2">{order?.merchant_address}</p>
                    <p className="text-gray-400 text-xs">{order?.merchant_phone}</p>
                  </div>
                </div>

                {/* --- KHỐI 2: ĐẾN (Chấm xanh nằm ngay dòng tiêu đề) --- */}
                <div className="flex gap-3">
                  {/* Cột Icon: Chỉ chứa chấm xanh */}
                  <div className="flex flex-col items-center">
                    {/* Chấm xanh: mt-1 để căn thẳng với dòng text đầu tiên */}
                    <div className="mt-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white shadow-md z-10 shrink-0"></div>
                  </div>

                  {/* Cột Nội dung */}
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
            {/* Order Summary Items */}
            <div className="space-y-4">
              {/* --- KHỐI 1: DANH SÁCH MÓN & TỔNG TIỀN --- */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                    Chi tiết đơn hàng
                  </h3>
                </div>

                {/* List món ăn (Dùng divide-y để kẻ dòng tự động) */}
                <div className="px-4 py-2">
                  {order?.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                      {/* Hình ảnh (Nhỏ gọn w-16) */}
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

                      {/* Thông tin */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* Dòng 1: Tên + Giá */}
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                            {item.name_item}
                          </p>
                          <span className="font-bold text-orange-600 text-sm whitespace-nowrap">
                            {Number(item.price).toLocaleString('vi-VN')}đ
                          </span>
                        </div>

                        {/* Dòng 2: Số lượng */}
                        <p className="text-xs text-gray-500 mt-1">
                          Số lượng:{' '}
                          <span className="font-medium text-gray-900">x{item.quantity}</span>
                        </p>

                        {/* Dòng 3: Topping (Nếu có) */}

                        {/* Dòng 3: Topping (Logic y hệt của bạn) */}
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

                {/* Tổng tiền & Phí */}
                <div className="bg-gray-50/30 px-4 py-3 border-t border-gray-100 space-y-2">
                  {/* Phí vận chuyển */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Phí giao hàng</span>
                    </div>
                    <span className="font-medium text-gray-700">
                      {Number(order.delivery_fee).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Phí áp dụng */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="w-3.5 h-3.5 text-blue-500" />
                      <span>Phí dịch vụ</span>
                    </div>
                    <span className="font-medium text-gray-700">{order.feesapply || '0đ'}</span>
                  </div>

                  {/* Giảm giá */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Percent className="w-3.5 h-3.5 text-green-500" />
                      <span>Giảm giá</span>
                    </div>
                    <span className="font-medium text-green-600">
                      -{Number(order.discount || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Đường kẻ đứt */}
                  <div className="border-t border-dashed border-gray-300 my-2"></div>

                  {/* TỔNG TIỀN */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">Tổng thanh toán</span>
                    <span className="text-lg font-bold text-orange-600">
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* --- KHỐI 2: CHI TIẾT KHÁC (Ultra Compact) --- */}
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-gray-700 font-bold mb-2 text-xs uppercase tracking-wide">
                  Thông tin thêm
                </h3>

                <div className="flex flex-col divide-y divide-gray-50 text-xs">
                  {/* Dụng cụ */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <ForkKnife className="w-3.5 h-3.5 text-orange-500" />
                      <span>Dụng cụ</span>
                    </div>
                    <span className="font-medium text-gray-800">{order.utensils || 'Không'}</span>
                  </div>

                  {/* Ghi chú */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Ghi chú</span>
                    </div>
                    <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
                      {order.note || 'Không'}
                    </span>
                  </div>

                  {/* Mã đơn */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="w-3.5 h-3.5 text-gray-600" />
                      <span>Mã đơn</span>
                    </div>
                    <span className="font-mono bg-gray-100 px-1.5 rounded text-[10px] text-gray-600 border border-gray-200">
                      {order.order_id || 'N/A'}
                    </span>
                  </div>

                  {/* Thời gian đặt */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-green-500" />
                      <span>Đặt lúc</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {formatDateTime(order.created_at)}
                    </span>
                  </div>

                  {/* Giao lúc */}
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-purple-500" />
                      {/* Nếu có delivered_at thì là "Giao lúc", chưa có thì là "Dự kiến" */}
                      <span>{order.delivered_at ? 'Giao lúc' : 'Dự kiến giao'}</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {/* Nếu có delivered_at thì lấy nó, không thì lấy estimatedDelivery (biến đã tính ở đầu file) */}
                      {order.delivered_at
                        ? formatDateTime(order.delivered_at)
                        : formatDateTime(estimatedDelivery)}
                    </span>
                  </div>

                  {/* Thanh toán */}
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
