// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Button } from '../../components/ui/button';
// import L from 'leaflet';
// import {
//   MapPin,
//   MessageCircle,
//   Phone,
//   Package,
//   Truck,
//   Bike,
//   Check,
//   Home,
//   Star,
//   ArrowLeft,
// } from 'lucide-react';
// import 'leaflet/dist/leaflet.css';

// // Fix icon mặc định Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const timelineSteps = [
//   { id: 1, label: 'Đã đặt đơn', icon: Check },
//   { id: 2, label: 'Tài xế nhận đơn', icon: Truck },
//   { id: 3, label: 'Tới quán', icon: MapPin },
//   { id: 4, label: 'Đã lấy đơn', icon: Package },
//   { id: 5, label: 'Giao thành công', icon: Home },
// ];

// export const TrackOrderPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); // ✅ thêm dòng này
//   const handleBack = () => {
//     navigate('/my-orders');
//   };

//   // ✅ Tạm set currentStep = 2 để test thấy tài xế luôn
//   const order = {
//     id: 1,
//     status: 'DELIVERING',
//     merchant: {
//       merchant_name: 'Nhà hàng Bảo Bến Cảng',
//     },
//     driver: {
//       name: 'Trương Quốc Bảo',
//       BS: '79-Z1 51770',
//       SĐT: '0399503025',
//     },
//   };

//   const [currentStep, setCurrentStep] = useState(order.currentStep || 1);

//   useEffect(() => {
//     console.log('👉 currentStep:', currentStep);
//     if (currentStep < timelineSteps.length) {
//       const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentStep]);

//   // const restaurantPos = [order.merchant.location.lat, order.merchant.location.lng];
//   // const deliveryPos = order.delivery_location
//   //   ? [order.delivery_location.lat, order.delivery_location.lng]
//   //   : null;

//   const createdAt = new Date(order.created_at);
//   const estimatedDelivery = new Date(createdAt.getTime() + 40 * 60 * 1000);
//   console.log('👉 order.driver:', order.driver);
//   console.log('👉 currentStep:', currentStep);

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-6">
//       {/* Tiêu đề */}
//       {/* Nút back  */}
//       <Button onClick={handleBack} variant="outline" className="mb-6 mt-4">
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Quay lại Đơn hàng của tôi
//       </Button>
//       <div className="text-center space-y-1">
//         <h2 className="text-2xl md:text-3xl font-bold">Theo dõi đơn hàng</h2>

//         <p className="text-gray-600 text-sm md:text-base">
//           Dự kiến giao hàng:{' '}
//           <span className="font-semibold text-orange-500">
//             {estimatedDelivery.toLocaleTimeString('vi-VN', {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </span>
//         </p>
//       </div>

//       {/* Timeline responsive */}
//       <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 relative">
//         {timelineSteps.map((step, index) => {
//           const StepIcon = step.icon;
//           const isActive = index + 1 === currentStep;
//           const isCompleted = index + 1 < currentStep;

//           return (
//             <div
//               key={step.id}
//               className="flex md:flex-1 flex-col items-center text-center relative"
//             >
//               {/* Line between steps */}
//               {index < timelineSteps.length - 1 && (
//                 <div
//                   className={`hidden md:block absolute top-5 left-2/2 transform -translate-x-1/2 h-1 z-0 ${
//                     isCompleted ? 'bg-orange-500' : 'bg-gray-300'
//                   }`}
//                   style={{ width: '100%' }}
//                 />
//               )}

//               {/* Icon */}
//               <div
//                 className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 mb-2 z-10 ${
//                   isCompleted
//                     ? 'bg-orange-500 border-orange-500 text-white'
//                     : isActive
//                     ? 'bg-white border-orange-400 text-orange-500'
//                     : 'bg-gray-100 border-gray-300 text-gray-400'
//                 }`}
//               >
//                 <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
//               </div>

//               {/* Label */}
//               <span
//                 className={`text-xs md:text-sm font-medium ${
//                   isCompleted ? 'text-orange-600' : isActive ? 'text-orange-500' : 'text-gray-400'
//                 }`}
//               >
//                 {step.label}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//       {/* ✅ Driver Info chỉ hiện khi currentStep ≥ 2 */}
//       {order.driver && currentStep >= 2 && (
//         <div className="mt-4 text-sm text-gray-700 flex items-center space-x-2 bg-gray-50 p-3 rounded-xl shadow-sm">
//           <span className="font-medium">Tài xế:</span>
//           {/* Ảnh tài xế */}
//           <img
//             src={
//               order.driver?.avatar ||
//               'https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/487326873_1887063878796318_9080709797256676382_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=94e2a3&_nc_ohc=treCi7K2T6YQ7kNvwFF10Nh&_nc_oc=AdlUuTytQt-R2TK52H5r46SC9Nau9ZJ6fyIbujyuF5NoIxATLgChqysYBgd7qvsKSrUhietYcqIt_5zpoKol9Mwv&_nc_zt=23&_nc_ht=scontent.fsgn2-10.fna&_nc_gid=exNZjuM-vVhrNERk1uvp-w&oh=00_AfhqOXRDKIUgDydZ8TKCkLNEEfkX0S1GZT9HnZrpt1q0rQ&oe=69137A79'
//             }
//             alt="Driver avatar"
//             className="w-8 h-8 rounded-full border border-gray-300"
//           />
//           {/* Tên tài xế */}
//           <span>{order.driver?.name} | </span>
//           {/* Biển số xe */}
//           <Bike className="w-4 h-4 mr-1 text-orange-500" />{' '}
//           <span className="text-gray-500">Biển số: {order.driver?.BS} | </span>
//           {/* Rating */}
//           <span className="flex items-center text-yellow-500">
//             <Star className="w-4 h-4" />
//             <Star className="w-4 h-4" />
//             <Star className="w-4 h-4" />
//             <Star className="w-4 h-4" />
//             <Star className="w-4 h-4" />
//           </span>
//           {/* SĐT */}
//           {order.driver?.SĐT && (
//             <span className="flex items-center text-gray-500">
//               | <Phone className="w-4 h-4 mx-1 text-orange-500" /> {order.driver.SĐT}
//             </span>
//           )}
//           {/* Icon tin nhắn */}
//           {/* 💬 Icon tin nhắn */}
//           <button
//             onClick={() => navigate(`/chat-driver/${order.driver?.id}`)}
//             className="ml-auto flex items-center gap-1 text-orange-500 hover:text-orange-600 transition"
//           >
//             <MessageCircle className="w-5 h-5" />
//             <span>Nhắn tin</span>
//           </button>
//         </div>
//       )}

//       {/* Map responsive */}
//       {/* <div className="w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-md">
//         <MapContainer
//           center={restaurantPos}
//           zoom={13}
//           scrollWheelZoom={false}
//           className="h-full w-full"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           />
//           <Marker position={restaurantPos}>
//             <Popup>
//               Nhà hàng: {order.merchant.merchant_name}
//               <br />
//               Địa chỉ: {order.merchant.location.address}
//             </Popup>
//           </Marker>
//           {deliveryPos && (
//             <Marker position={deliveryPos}>
//               <Popup>Địa chỉ giao hàng</Popup>
//             </Marker>
//           )}
//         </MapContainer>
//       </div> */}

//       {/* Order info responsive */}
//       <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-2 text-sm md:text-base">
//         <p className="text-lg font-semibold text-orange-600">Thông tin đơn hàng</p>
//         <p>
//           <strong>Thanh toán:</strong> {order.payment_method}
//         </p>
//         <p>
//           <strong>Tổng tiền:</strong> {Number(order.total_amount).toLocaleString('vi-VN')}đ
//         </p>
//         {order.note && (
//           <p>
//             <strong>Ghi chú:</strong> {order.note}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// const order = location.state?.order || {
//   id: 'dummy-123',
//   merchant: {
//     merchant_name: 'Seoul BBQ House',
//     location: { lat: 10.7755, lng: 106.7031 },
//   },
//   delivery_address: 'Mizuki Center, 35, Bình Hưng, TP.HCM',
//   currentStep: 2,
//   driver: { name: 'Trương Quốc Bảo', BS: '079-Z1-51770' },
//   payment_method: 'Tiền mặt',
//   total_amount: 450000,
//   note: 'Giao nhanh nếu được',
//   created_at: new Date(),
// };


import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, MapPin, Package, Truck, Check, Home } from "lucide-react";

const timelineSteps = [
  { id: 1, label: "Đã đặt đơn", icon: Check },
  { id: 2, label: "Tài xế nhận đơn", icon: Truck },
  { id: 3, label: "Tới quán", icon: MapPin },
  { id: 4, label: "Đã lấy đơn", icon: Package },
  { id: 5, label: "Giao thành công", icon: Home },
];

export const TrackOrderPage = () => {
  const navigate = useNavigate();

  // ✅ Giả lập dữ liệu
  const order = {
    id: 1,
    status: "DELIVERING",
    merchant: { merchant_name: "Nhà hàng Bảo Bến Cảng" },
    created_at: new Date(),
  };

  const [currentStep, setCurrentStep] = useState(1);

  // 🔁 Chạy tự động từng bước
  useEffect(() => {
    if (currentStep < timelineSteps.length) {
      const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // ✅ Khi đạt bước cuối -> update CSDL
  useEffect(() => {
    if (currentStep === timelineSteps.length) {
      axios
        .put(`http://localhost:5000/orders/update-status/${order.id}`, {
          status: "DELIVERED",
        })
        .then(() => console.log("✅ Đơn hàng cập nhật thành công"))
        .catch((err) => console.error("❌ Lỗi cập nhật:", err));
    }
  }, [currentStep]);

  const handleBack = () => navigate("/my-orders");

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Button onClick={handleBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Đơn hàng của tôi
      </Button>

      <h2 className="text-center text-2xl font-bold">Theo dõi đơn hàng</h2>

      <div className="flex justify-between mt-6 relative">
        {timelineSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index + 1 <= currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-2 ${
                  isCompleted
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-medium ${
                  isCompleted ? "text-orange-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

{timelineSteps.map((step, index) => {
  const StepIcon = step.icon;
  const isCompleted = index + 1 < currentStep;
  const isActive = index + 1 === currentStep;

  return (
    <div key={step.id} className="flex md:flex-1 flex-col items-center text-center relative">
      {/* Icon step với animation màu */}
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
        <StepIcon className="w-5 h-5 md:w-6 md:h-6" />
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-xs md:text-sm font-medium"
        initial={{ color: '#9ca3af' }}
        animate={{
          color: isCompleted
            ? '#1e40af'
            : isActive
            ? ['#9ca3af', '#f97316']
            : '#9ca3af',
        }}
        transition={{ duration: isActive ? 3 : 0, ease: 'easeInOut' }}
      >
        {step.label}
      </motion.span>
    </div>
  );
})}


<motion.div
  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 mb-2 z-10"
  initial={{ backgroundColor: '#f3f3f3', borderColor: '#d1d5db' }}
  animate={{
    backgroundColor: isCompleted
      ? '#f97316' // cam hoàn thành
      : isActive
      ? ['#f3f3f3', '#f97316'] // chuyển từ xám → cam
      : '#f3f3f3',
    borderColor: isCompleted
      ? '#f97316'
      : isActive
      ? ['#d1d5db', '#fb923c']
      : '#d1d5db',
  }}
  transition={{ duration: isActive ? 3 : 0, ease: 'easeInOut' }}
>
  {/* Icon luôn trắng khi nền cam */}
  <StepIcon
    className="w-5 h-5 md:w-6 md:h-6"
    style={{
      fill: isCompleted || isActive ? '#ffffff' : '#9ca3af',
    }}
  />
</motion.div>


import { motion } from 'framer-motion';

const TruckAnimated = () => {
  return (
    <motion.div className="relative w-12 h-6">
      {/* Thân xe */}
      <motion.div className="absolute bottom-0 w-full h-4 bg-blue-600 rounded-md" />
      {/* Cabin */}
      <motion.div className="absolute top-0 left-1 w-4 h-4 bg-blue-800 rounded-sm" />
      {/* Bánh trước */}
      <motion.div
        className="absolute bottom-[-2px] left-1 w-3 h-3 bg-black rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />
      {/* Bánh sau */}
      <motion.div
        className="absolute bottom-[-2px] right-1 w-3 h-3 bg-black rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />
      {/* Khói */}
      <motion.div
        className="absolute -top-2 left-0 w-2 h-2 bg-gray-300 rounded-full opacity-50"
        animate={{ y: [-2, -6], opacity: [0.5, 0], scale: [0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <motion.div
        className="absolute -top-2 left-2 w-2 h-2 bg-gray-400 rounded-full opacity-50"
        animate={{ y: [-2, -6], opacity: [0.5, 0], scale: [0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
      />
    </motion.div>
  );
};

export default TruckAnimated;




/

/

////

///
///

///

//

// Tính progress cho step hiện tại

<motion.div
  className="h-full bg-orange-500"
  initial={false} // ✅ thêm dòng này để không chạy lại animation từ đầu khi reload
  animate={{
    scaleX: stepProgress
      ? 1
      : isActive
      ? [0, 1]
      : 0,
  }}
  transition={{
    duration: isActive ? 20 : 1,
    ease: 'linear',
    repeat: 0,
  }}
  style={{
    transformOrigin: 'left center',
  }}
/>

useEffect(() => {
  const orderConfirmed = localStorage.getItem('orderConfirmed');

  if (!orderConfirmed || !state?.cartOrder) { // giả sử state.cartOrder chứa order vừa đặt
    navigate('/cart', { replace: true });
    return;
  }

  setValidated(true);

  const clearTimer = setTimeout(() => localStorage.removeItem('orderConfirmed'), 5000);

  const redirectTimer = setTimeout(() => {
    // Gửi toàn bộ order qua state
    navigate(`/track-order/${state.cartOrder.id}`, {
      state: { order: state.cartOrder },
    });
  }, 5000);

  return () => {
    clearTimeout(clearTimer);
    clearTimeout(redirectTimer);
  };
}, [navigate, state]);



const { id } = useParams();
const location = useLocation();
const [order, setOrder] = useState(location.state?.order || null);

useEffect(() => {
  if (!order && id) {
    fetch(`/apiLocal/order/getOrder/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error(err));
  }
}, [id, order]);


import { useLocation } from 'react-router-dom';

export default function OrderSuccessPage() {
  const location = useLocation();

  // Lấy orderId từ query param
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  console.log('Order ID:', orderId); // ✅ kiểm tra xem có lấy được không

  return (
    <div>
      <h1>Đặt hàng thành công!</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
import { useLocation } from 'react-router-dom';

const location = useLocation();
const { orderId } = location.state || {};
console.log('Order ID:', orderId);

//
useEffect(() => {
  if (!order || !isAutoTracking) return;

  const stepDuration = 20000; // 20s
  const elapsed = Date.now() - stepStartTime;
  const remaining = Math.max(stepDuration - elapsed, 0);

  if (currentStep < timelineSteps.length) {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setStepStartTime(Date.now());
    }, remaining);
    return () => clearTimeout(timer);
  } else {
    // Khi đến bước cuối → gọi API updateBody
    fetch(`/apiLocal/order/${order.id}/updateBody`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'COMPLETED',
        status_payment: 'SUCCESS',
        delivered_at: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi khi update');
        return res.json();
      })
      .then((data) => {
        console.log('✅ Update xong, chuyển sang Order Success');
        setIsAutoTracking(false);
        setIsDelivered(true);
        localStorage.removeItem(`order_${order.id}_step`);
        localStorage.removeItem(`order_${order.id}_step_start`);

        // 🔥 Tự động chuyển sang trang đặt hàng thành công
        navigate('/cart', { state: { order } });
      })
      .catch((err) => console.error('❌ Lỗi updateBody:', err));
  }
}, [currentStep, stepStartTime, order, isAutoTracking, navigate]);
//
//




// Auto increment step
useEffect(() => {
  if (!order || !isAutoTracking) return;

  const stepDuration = 20000; // 20s
  const elapsed = Date.now() - stepStartTime;
  const remaining = Math.max(stepDuration - elapsed, 0);

  if (currentStep < timelineSteps.length) {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setStepStartTime(Date.now());
    }, remaining);
    return () => clearTimeout(timer);
  } else {
    // ✅ Khi timeline kết thúc → gọi API update order
    fetch(`/apiLocal/order/${order.id}/updateBody`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "COMPLETED",
        status_payment: "SUCCESS",
        delivered_at: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi update");
        return res.json();
      })
      .then((data) => {
        setIsAutoTracking(false);
        setIsDelivered(true);
        localStorage.removeItem(`order_${order.id}_step`);
        localStorage.removeItem(`order_${order.id}_step_start`);

        // 🔥 Chuyển về MyOrdersPage + active tab COMPLETED
        navigate("/my-orders", {
          state: { activeTab: "COMPLETED", updatedOrder: data },
        });
      })
      .catch((err) => console.error("❌ Lỗi updateBody:", err));
  }
}, [currentStep, stepStartTime, order, isAutoTracking]);


const location = useLocation();
const [activeTab, setActiveTab] = useState(
  location.state?.activeTab || "DELIVERING"
);

useEffect(() => {
  if (location.state?.updatedOrder) {
    const updatedOrder = location.state.updatedOrder;
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  }
}, [location.state?.updatedOrder]);
//
//
//
//
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const orderId = params.get('order_id');

  if (!status) return;

  if (status === 'success' && orderId) {
    // gọi API fetch order
    fetch(`http://localhost:3000/api/order/${orderId}`)
      .then((res) => res.json())
      .then((order) => {
        clearCart();
        navigate('/cart/checkout/ordersuccess', { state: { order } });
      })
      .catch(() => {
        alert('Không thể lấy thông tin đơn hàng!');
        navigate('/cart/checkout/orderfailed');
      });
  } else if (status === 'canceled') {
    navigate('/cart/pending');
  } else {
    clearCart();
    navigate('/cart/checkout/orderfailed');
  }
}, [location.search, navigate]);


useEffect(() => {
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const data = params.get('data'); // lấy base64 payload từ BE

  if (!status) return;

  setLoading(true);

  const timer = setTimeout(() => {
    switch (status) {
      case 'success':
        if (data) {
          try {
            const order = JSON.parse(atob(data)); // decode base64 → object
            localStorage.setItem('orderConfirmed', 'true');
            clearCart();

            // ✅ navigate sang ordersuccess kèm state order
            navigate('/cart/checkout/ordersuccess', { state: { order } });
          } catch (err) {
            console.error('❌ Failed to parse order payload:', err);
            alert('Không thể đọc dữ liệu đơn hàng, vui lòng thử lại!');
            navigate('/cart/checkout/orderfailed');
          }
        } else {
          alert('Không có dữ liệu đơn hàng!');
          navigate('/cart/checkout/orderfailed');
        }
        break;

      case 'canceled':
        navigate('/cart/pending');
        break;

      default:
        clearCart();
        alert('❌ Thanh toán thất bại, vui lòng thử lại!');
        navigate('/cart/checkout/orderfailed');
        break;
    }

    setLoading(false);
  }, 300);

  return () => clearTimeout(timer);
}, [location.search, navigate]);


const params = new URLSearchParams(location.search);
const data = params.get('data');
const order = data ? JSON.parse(atob(data)) : null; // ✅ dùng order từ VNPay

//
useEffect(() => {
  if (!order) return;

  // Khởi tạo currentStep & stepStartTime nếu chưa có
  const savedStep = localStorage.getItem(`order_${order.id}_step`);
  setCurrentStep(savedStep ? Number(savedStep) : order.currentStep || 1);

  const savedTime = localStorage.getItem(`order_${order.id}_step_start`);
  setStepStartTime(savedTime ? Number(savedTime) : Date.now());
}, [order]);

//
//
// 1️⃣ Fetch order nếu chưa có
useEffect(() => {
  if (!order && id) {
    fetch(`/apiLocal/order/getOrder/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);

        // Nếu đơn đã COMPLETED, chuyển luôn sang MyOrders
        if (data.status === 'COMPLETED') {
          navigate('/my-orders', { state: { activeTab: 'COMPLETED', updatedOrder: data } });
          return; // quan trọng: không set step nếu COMPLETED
        }

        // Khởi tạo step từ localStorage hoặc order
        const savedStep = localStorage.getItem(`order_${data.id}_step`);
        setCurrentStep(savedStep ? Number(savedStep) : data.currentStep || 1);

        const savedTime = localStorage.getItem(`order_${data.id}_step_start`);
        setStepStartTime(savedTime ? Number(savedTime) : Date.now());

        setIsAutoTracking(true); // bật timeline
      })
      .catch((err) => console.error(err));
  }
}, [id, order, navigate]);

// 2️⃣ Auto increment timeline
useEffect(() => {
  if (!order || !order.id || !isAutoTracking) return;

  const stepDuration = 20000;
  const elapsed = Date.now() - stepStartTime;
  const remaining = Math.max(stepDuration - elapsed, 0);

  if (currentStep < timelineSteps.length) {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setStepStartTime(Date.now());
    }, remaining);
    return () => clearTimeout(timer);
  } else {
    // timeline xong → update order + xoá localStorage
    fetch(`/apiLocal/order/${order.id}/updateBody`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'COMPLETED',
        status_payment: 'SUCCESS',
        delivered_at: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Update thất bại');
        return res.json();
      })
      .then((data) => {
        setIsAutoTracking(false);
        localStorage.removeItem(`order_${order.id}_step`);
        localStorage.removeItem(`order_${order.id}_step_start`);
        navigate('/my-orders', { state: { activeTab: 'COMPLETED', updatedOrder: data } });
      })
      .catch((err) => console.error('❌ Lỗi updateBody:', err));
  }
}, [currentStep, stepStartTime, order, isAutoTracking, navigate]);
