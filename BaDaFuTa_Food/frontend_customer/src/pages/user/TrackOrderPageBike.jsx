import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
import TruckAnimated from '../../components/TruckAnimated'; // đường dẫn tùy dự án

// Fix icon mặc định Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const timelineSteps = [
  { id: 1, label: 'Đã đặt đơn', icon: Check },
  { id: 2, label: 'Tài xế nhận đơn', icon: Truck },
  { id: 3, label: 'Tới quán', icon: MapPin },
  { id: 4, label: 'Đã lấy đơn', icon: Package },
  { id: 5, label: 'Giao thành công', icon: Home },
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

  // console.log('Received Order ID:', orderId); // kiểm tra

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

  // cho phép auto tracking theo mặc định; chúng ta sẽ resume từ savedStep nếu có
  const [isAutoTracking, setIsAutoTracking] = useState(true);

  // const [isAutoTracking, setIsAutoTracking] = useState(() => {
  //   const fromSuccess = location.state?.from === 'OrderSuccess';
  //   return fromSuccess || !!orderFromState; // ✅ Cho phép auto nếu từ OrderSuccess
  // });

  // ref để đảm bảo updateBody chỉ gọi 1 lần
  const hasUpdatedRef = useRef(false);
  // ref để giữ timer id
  const timerRef = useRef(null);

  // Tạm set currentStep = 2 để test thấy tài xế luôn
  const testOrder = {
    driver: {
      name: 'Trương Quốc Bảo',
      BS: '79-Z1 51770',
      SĐT: '0399503025',
    },
    created_at: new Date(),
  };

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
      // fetch(`https://badafuta-production.up.railway.app/api/order/getOrder/${id}`)
      fetch(`https://badafuta.onrender.com/api/order/getOrder/${id}`)
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
  const stepDuration = 20000; // 20s mỗi step

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

  // -------- Auto increment step logic (robust — resumes using saved start time) --------
  useEffect(() => {
    if (!order || !isAutoTracking) return;

    // ensure we don't double-update when currentStep already past final
    if (currentStep > timelineSteps.length) return;

    // compute stepDuration and remaining
    const stepDuration = 20000; // 20s per step
    const now = Date.now();

    // If saved start time is in future or not a number, reset to now
    const start = Number(stepStartTime) || now;
    // elapsed in current step
    const elapsed = Math.max(0, now - start);
    const remaining = Math.max(stepDuration - elapsed, 0);

    // If we're already at final step, run completion flow
    if (currentStep >= timelineSteps.length) {
      localStorage.removeItem(`order_${orderKey}_step`);
      localStorage.removeItem(`order_${orderKey}_step_start`);
      // completion
      (async () => {
        if (hasUpdatedRef.current) return; // already handled
        hasUpdatedRef.current = true;

        try {
          // choose api identifier (order.id || order.order_id || id)
          const apiId = order.id || order._id || order.order_id || id;
          if (!apiId) {
            console.error('No order id available for update');
            return;
          }
          const res = await fetch(
            // `https://badafuta-production.up.railway.app/api/order/${apiId}/updateBody`,
            `https://badafuta.onrender.com/api/order/${apiId}/updateBody`,

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

          // cleanup + navigate
          setIsAutoTracking(false);
          setIsDelivered(true);
          localStorage.removeItem(`order_${apiId}_step`);
          localStorage.removeItem(`order_${apiId}_step_start`);

          navigate('/my-orders', {
            state: { activeTab: 'COMPLETED', updatedOrder: data },
          });
        } catch (err) {
          console.error('❌ Error updating order on completion:', err);
        }
      })();

      return;
    }

    // Otherwise schedule increment after remaining milliseconds
    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, timelineSteps.length));
      setStepStartTime(Date.now());
    }, remaining);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, isAutoTracking, currentStep, stepStartTime, id]);

  if (!order) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

  const createdAt = new Date(order.created_at);
  const estimatedDelivery = new Date(createdAt.getTime() + 40 * 60 * 1000);
  // Xác định màu theo trạng thái
  const truckColor = () => {
    switch (currentStep) {
      case 1:
        return 'text-gray-400'; // chuẩn bị
      case 2:
        return 'text-orange-400'; // đang nhận đơn
      case 3:
        return 'text-yellow-500'; // tới quán
      case 4:
        return 'text-blue-500'; // đang vận chuyển
      case 5:
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

  // For UI: compute stepProgress for active step using stepStartTime
  const activeElapsed = Math.min(Math.max(0, Date.now() - stepStartTime), 20000);
  const activeProgress = Math.min(activeElapsed / 20000, 1);

  console.log('Order object received:', order);
  console.log('Order ID:', order?.order_id);

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
            {currentStep === 2 && 'Tài xế đã nhận đơn và đang trên đường tới quán...'}
            {currentStep === 3 && 'Tài xế đã tới quán và đang lấy đơn...'}
            {currentStep === 4 && 'Đơn hàng đang được vận chuyển...'}
            {currentStep === 5 && 'Đơn đã giao thành công 🎉'}
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

                  {/* 🚚 Xe chạy trên line */}
                  {isActive && (
                    <motion.div
                      className="absolute top-[-20px] z-10"
                      initial={{ left: `${stepProgress * 100}%` }}
                      animate={{ left: '100%' }}
                      transition={{ duration: (1 - stepProgress) * 20, ease: 'linear' }}
                    >
                      <TruckAnimated />
                    </motion.div>
                  )}
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
      {/* ✅ Driver Info chỉ hiện khi currentStep ≥ 2 */}
      {testOrder.driver && currentStep >= 2 && (
        // <div className="mt-4 text-sm text-gray-700 flex items-center space-x-2 bg-gray-50 p-3 rounded-xl shadow-sm">
        <div className="mt-4 bg-gray-50 p-4 md:p-3 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 text-gray-700 text-sm">
          <span className="font-medium ">Tài xế:</span>
          {/* Ảnh + thông tin */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-wrap">
            <img
              src={
                testOrder.driver?.avatar ||
                'https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/487326873_1887063878796318_9080709797256676382_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=94e2a3&_nc_ohc=treCi7K2T6YQ7kNvwFF10Nh&_nc_oc=AdlUuTytQt-R2TK52H5r46SC9Nau9ZJ6fyIbujyuF5NoIxATLgChqysYBgd7qvsKSrUhietYcqIt_5zpoKol9Mwv&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=exNZjuM-vVhrNERk1uvp-w&oh=00_AfhqOXRDKIUgDydZ8TKCkLNEEfkX0S1GZT9HnZrpt1q0rQ&oe=69137A79'
              }
              alt="Driver avatar"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-1 md:space-y-0">
              {/* Tên tài xế */}
              <span className="text-gray-500">{testOrder.driver?.name} |</span>
              {/* Biển số xe */}
              <span className="text-gray-500 flex items-center">
                <Bike className="w-4 h-4 mr-1 text-orange-500" />
                Biển số: {testOrder.driver?.BS}
              </span>
              {/* Rating */}
              <span className=" text-gray-500">5.0</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
          </div>

          {/* SĐT */}
          {testOrder.driver?.SĐT && (
            <span className="flex items-center text-gray-500">
              | <Phone className="w-4 h-4 mx-2 text-orange-500" /> {testOrder.driver.SĐT}
            </span>
          )}
          {/* Icon tin nhắn */}
          {/* 💬 Icon tin nhắn */}
          <button
            onClick={() => navigate(`/chat-driver/${testOrder.driver?.id}`)}
            className="mt-2 md:mt-0 ml-0 md:ml-auto flex items-center gap-1 text-gray-500 hover:text-orange-600 transition"
          >
            <MessageCircle className="w-4 h-4 text-orange-500 " />
            <span>Nhắn tin</span>
          </button>
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
