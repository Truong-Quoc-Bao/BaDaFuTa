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
// import { motion } from 'framer-motion';
// import TruckAnimated from '../../components/TruckAnimated'; // đường dẫn tùy dự án

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
//   const { id } = useParams();
  
//   const { orderId } = location.state || {}; // nhận orderId từ state
//   // ✅ Lấy order từ state
//   const orderFromState = location.state?.order;
//   const [order, setOrder] = useState(orderFromState || null);
//   const [isDelivered, setIsDelivered] = useState(false);

//   console.log('Received Order ID:', orderId); // kiểm tra

//   // ✅ Lưu step & thời gian bắt đầu
//   const [currentStep, setCurrentStep] = useState(() => {
//     const savedStep = localStorage.getItem(`order_${id}_step`);
//     return savedStep ? Number(savedStep) : orderFromState?.currentStep || 1;
//   });

//   const [stepStartTime, setStepStartTime] = useState(() => {
//     const savedTime = localStorage.getItem(`order_${id}_step_start`);
//     return savedTime ? Number(savedTime) : Date.now();
//   });
//   // const [isAutoTracking, setIsAutoTracking] = useState(true);

//   const [isAutoTracking, setIsAutoTracking] = useState(() => {
//     const fromSuccess = location.state?.from === 'OrderSuccess';
//     return fromSuccess || !!orderFromState; // ✅ Cho phép auto nếu có order hoặc từ OrderSuccess
//   });

//   // const [isAutoTracking, setIsAutoTracking] = useState(false);

//   // Tạm set currentStep = 2 để test thấy tài xế luôn
//   // const order = {
//   // id: 'dummy-123',
//   // status: 'DELIVERING',
//   // merchant: {
//   // merchant_name: 'Nhà hàng Bảo Bến Cảng', // },
//   // driver: {
//   // name: 'Trương Quốc Bảo',
//   // BS: '79-Z1 51770',
//   // SĐT: '0399503025', // },
//   // created_at: new Date(), // };

//   // Fetch order khi reload F5
//   useEffect(() => {
//     if (!orderFromState && id) {
//       fetch(`/apiLocal/order/getOrder/${id}`)
//         .then((res) => res.json())
//         .then((data) => {
//           console.log('✅ Fetched order:', data);
//           setOrder(data);

//           // ⚠️ Nếu reload từ OrderSuccess → khôi phục step đã lưu
//           const savedStep = localStorage.getItem(`order_${data.id}_step`);
//           if (savedStep) setCurrentStep(Number(savedStep));
//         })
//         .catch((err) => console.error(err));
//     } else if (orderFromState) {
//       setOrder(orderFromState);
//     }
//   }, [id, orderFromState]);

//   // Lưu step & stepStartTime
//   useEffect(() => {
//     if (!order) return;
//     localStorage.setItem(`order_${order.id}_step`, currentStep);
//     localStorage.setItem(`order_${order.id}_step_start`, stepStartTime);
//   }, [currentStep, stepStartTime, order?.id]);

//   // Auto increment step
//   useEffect(() => {
//     if (!order || !isAutoTracking) return;

//     const stepDuration = 20000; // 20s
//     const elapsed = Date.now() - stepStartTime;
//     const remaining = Math.max(stepDuration - elapsed, 0);

//     if (currentStep < timelineSteps.length) {
//       const timer = setTimeout(() => {
//         setCurrentStep((prev) => prev + 1);
//         setStepStartTime(Date.now());
//       }, remaining);
//       return () => clearTimeout(timer);
//     } else {
//       // ✅ Giao hàng xong → gọi API updateBody
//       fetch(`/apiLocal/order/${order.id}/updateBody`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           status: 'COMPLETED',
//           status_payment: 'SUCCESS',
//           delivered_at: new Date().toISOString(),
//         }),
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error('Lỗi khi update');
//           return res.json();
//         })
//         .then((data) => {
//           console.log('✅ Update xong, chuyển sang Order Success');
//           setIsAutoTracking(false);
//           setIsDelivered(true);
//           localStorage.removeItem(`order_${order.id}_step`);
//           localStorage.removeItem(`order_${order.id}_step_start`);

//           // 🔥 Chuyển về MyOrdersPage + active tab COMPLETED
//           navigate('/my-orders', {
//             state: { activeTab: 'COMPLETED', updatedOrder: data },
//           });
//         })
//         .catch((err) => console.error('❌ Lỗi updateBody:', err));
//     }
//   }, [currentStep, stepStartTime, order, isAutoTracking]);

//   if (!order) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

//   const createdAt = new Date(order.created_at);
//   const estimatedDelivery = new Date(createdAt.getTime() + 40 * 60 * 1000);
//   console.log('👉 order.driver:', order.driver);
//   console.log('👉 currentStep:', currentStep);

//   const handleBack = () => {
//     navigate('/my-orders');
//   };

//   console.log('Order object received:', order);
//   console.log('Order ID:', order?.order_id);

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
//         {/* <p>
//           Mã đơn hàng: <strong>{order?.order_id}</strong>
//         </p> */}
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
//           const isCompleted = index + 1 < currentStep;
//           const isActive = index + 1 === currentStep;

//           // Tính progress cho step hiện tại
//           const stepProgress = isActive
//             ? Math.min((Date.now() - stepStartTime) / 20000, 1)
//             : isCompleted
//             ? 1
//             : 0;

//           return (
//             <div
//               key={step.id}
//               className="flex md:flex-1 flex-col items-center text-center relative"
//             >
//               {/* Line between steps */}
//               {index < timelineSteps.length - 1 && (
//                 <div
//                   className="hidden md:block absolute top-5 left-2/2 transform -translate-x-1/2 h-1 z-0 bg-gray-300 overflow-visible"
//                   style={{ width: '100%' }}
//                 >
//                   {/* Thanh màu cam tải dần */}
//                   <motion.div
//                     className="h-full bg-orange-500 origin-left"
//                     initial={{ scaleX: isCompleted ? 1 : stepProgress }}
//                     animate={{ scaleX: isCompleted ? 1 : isActive ? 1 : 0 }}
//                     transition={{
//                       duration: isActive ? (1 - stepProgress) * 20 : 0,
//                       ease: 'linear',
//                     }}
//                   />

//                   {/* 🚚 Xe chạy trên line */}
//                   {isActive && (
//                     <motion.div
//                       className="absolute top-[-20px] z-10"
//                       initial={{ left: `${stepProgress * 100}%` }}
//                       animate={{ left: '100%' }}
//                       transition={{ duration: (1 - stepProgress) * 20, ease: 'linear' }}
//                     >
//                       <TruckAnimated />
//                     </motion.div>
//                   )}
//                 </div>
//               )}

//               {/* Icon */}
//               <motion.div
//                 className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 mb-2 z-10"
//                 initial={{
//                   backgroundColor: '#f3f3f3', // gray ban đầu
//                   borderColor: '#d1d5db',
//                   color: '#9ca3af',
//                 }}
//                 animate={{
//                   backgroundColor: isCompleted
//                     ? '#f97316' // bg-orange-500 hoàn thành
//                     : isActive
//                     ? ['#f3f3f3', '#f97316'] // từ gray → cam dần
//                     : '#f3f3f3', // chưa tới: gray
//                   borderColor: isCompleted
//                     ? '#f97316'
//                     : isActive
//                     ? ['#d1d5db', '#fb923c'] // từ gray → border-orange-400
//                     : '#d1d5db',
//                   color: isCompleted
//                     ? '#ffffff'
//                     : isActive
//                     ? ['#9ca3af', '#f97316'] // text từ gray → cam
//                     : '#9ca3af',
//                 }}
//                 transition={{
//                   duration: isActive ? 3 : 0, // chạy từ từ trong 3 giây khi active
//                   ease: 'easeInOut',
//                 }}
//               >
//                 <StepIcon
//                   className="w-5 h-5 md:w-6 md:h-6"
//                   style={{
//                     stroke: isCompleted || isActive ? '#ffffff' : '#9ca3af',
//                   }}
//                 />
//               </motion.div>

//               {/* Label */}
//               <motion.span
//                 className="text-xs md:text-sm font-medium"
//                 initial={{ color: '#9ca3af' }} // xám ban đầu
//                 animate={{
//                   color: isCompleted
//                     ? '#f97316' // cam full nếu đã hoàn thành
//                     : isActive
//                     ? ['#9ca3af', '#f97316'] // chuyển từ xám → cam mượt
//                     : '#9ca3af', // chưa tới step
//                 }}
//                 transition={{ duration: isActive ? 3 : 0, ease: 'easeInOut' }}
//               >
//                 {step.label}
//               </motion.span>
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


//
app
// import { Layout } from "./components/Layout";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { CartProvider, useCart } from "./contexts/CartContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import MerchantLogin from "./pages/MerchantLoginPage";
// import PhoneVerification from "./pages/PhoneVerification";
// import { Header } from "./components/Header";
// import { Footer } from "./components/Footer";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import HomePage from "./pages/HomePage";
// import { AboutPage } from "./pages/AboutPage";
// import { SupportPage } from "./pages/SupportPage";
// import { ProfilePage } from "./pages/ProfilePage";
// import { SettingsPage } from "./pages/SettingsPage";
// import { RestaurantPage } from "./pages/RestaurantPage";
// import MenuItemDetailPage from "./pages/MenuItemDetailPage";
// import CartPage from "./pages/CartPage";
// import CheckOutPage from "./pages/CheckOutPage";
// import { Toaster } from "react-hot-toast";
// import OrderSuccess from "./pages/OrderSuccess";
// import "./index.css";


// // --------- Protected route wrapper sử dụng CartProvider ---------

// // Protected route wrapper dùng CartProvider
// function ProtectedRouteWrapper({ children }) {
//   const { state, isInitialized } = useCart();
//   if (!isInitialized) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-500">
//         Đang tải giỏ hàng...
//       </div>
//     );
//   }

//   const cart = state.items || [];
//   return cart.length > 0 ? children : <Navigate to="/cart" />;
// }

// function AppRoutes() {

//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/phone-otp" element={<PhoneVerification />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/merchantlogin" element={<MerchantLogin />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/support" element={<SupportPage />} />
//       <Route path="/profile" element={<ProfilePage />} />
//       <Route path="/settings" element={<SettingsPage />} />
//       <Route path="/restaurant/:id" element={<RestaurantPage />} />
//       <Route
//         path="/restaurant/:id/menu/:itemId"
//         element={<MenuItemDetailPage />}
//       />
//       <Route path="/cart" element={<CartPage />} />
     
//       <Route
//         path="/cart/checkout"
//         element={
//           <ProtectedRouteWrapper>
//             <CheckOutPage />
//           </ProtectedRouteWrapper>
//         }
//       />

//       <Route
//         path="/cart/checkout/ordersuccess"
//         element={
//           <ProtectedRoute
//             condition={localStorage.getItem("orderConfirmed") === "true"}
//             redirectTo="/cart"
//           >
//             <OrderSuccess />
//           </ProtectedRoute>
//         }
//       />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// // --------- AppInner: gọi useLocation() sau khi providers mount ---------
// function AppInner() {
//   const location = useLocation(); // ✅ giờ gọi safe
//   const hideHeaderFooter = [
//     "/login",
//     "/register",
//     "/merchantlogin",
//     "/phone-otp",
//   ].includes(location.pathname);

//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: { pointerEvents: "none" },
//           pauseOnFocusLoss: false,
//           pauseOnHover: false,
//         }}
//       />

//       <CartProvider>
//         {hideHeaderFooter ? (
//           <AppRoutes />
//         ) : (
//           <Layout>
//             <AppRoutes />
//           </Layout>
//         )}
//       </CartProvider>
//     </>
//   );
// }

// // --------- App chính ---------
// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <AppInner />
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;





//

//
//
//
//
//
//Mới nhất

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
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import TruckAnimated from '../../components/TruckAnimated'; // đường dẫn tùy dự án

// Fix icon mặc định Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
  const navigate = useNavigate();
  const { id } = useParams();

  // order có thể đến qua state (navigate) hoặc fetch bằng param id
  const orderFromState = location.state?.order || null;
  const cameFrom = location.state?.from || null; // e.g. 'OrderSuccess' (nếu được set)

  const [order, setOrder] = useState(orderFromState || null);
  const [isDelivered, setIsDelivered] = useState(false);

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

  // ref để đảm bảo updateBody chỉ gọi 1 lần
  const hasUpdatedRef = useRef(false);
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
      fetch(`/apiLocal/order/getOrder/${id}`)
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
  useEffect(() => {
    if (!orderKey) return;
    try {
      localStorage.setItem(`order_${orderKey}_step`, String(currentStep));
      localStorage.setItem(`order_${orderKey}_step_start`, String(stepStartTime));
    } catch (e) {
      console.warn('localStorage set error', e);
    }
  }, [currentStep, stepStartTime, orderKey]);

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

          const res = await fetch(`/apiLocal/order/${apiId}/updateBody`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'COMPLETED',
              status_payment: 'SUCCESS',
              delivered_at: new Date().toISOString(),
            }),
          });

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

  // If user navigated from OrderSuccess and we want to ensure auto-tracking runs,
  // we will keep isAutoTracking true (default). No extra toggle needed here.
  // BUT if you want different behavior (like pause), you can detect `cameFrom === 'OrderSuccess'`.

  if (!order) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

  const createdAt = new Date(order.created_at);
  const estimatedDelivery = new Date(createdAt.getTime() + 40 * 60 * 1000);

  const handleBack = () => navigate('/my-orders');

  // For UI: compute stepProgress for active step using stepStartTime
  const activeElapsed = Math.min(Math.max(0, Date.now() - stepStartTime), 20000);
  const activeProgress = Math.min(activeElapsed / 20000, 1);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Button onClick={handleBack} variant="outline" className="mb-6 mt-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại Đơn hàng của tôi
      </Button>

      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold">Theo dõi đơn hàng</h2>
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

      {/* Timeline responsive */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 relative">
        {timelineSteps.map((step, index) => {
          const StepIcon = step.icon;
          const stepIndex = index + 1;
          const isCompleted = stepIndex < currentStep;
          const isActive = stepIndex === currentStep;

          // progress for active step
          const stepProgress = isActive ? activeProgress : isCompleted ? 1 : 0;

          return (
            <div key={step.id} className="flex md:flex-1 flex-col items-center text-center relative">
              {index < timelineSteps.length - 1 && (
                <div
                  className="hidden md:block absolute top-5 left-2/2 transform -translate-x-1/2 h-1 z-0 bg-gray-300 overflow-visible"
                  style={{ width: '100%' }}
                >
                  <motion.div
                    className="h-full bg-orange-500 origin-left"
                    initial={{ scaleX: isCompleted ? 1 : stepProgress }}
                    animate={{ scaleX: isCompleted ? 1 : isActive ? stepProgress : 0 }}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute top-[-20px] z-10"
                      initial={{ left: `${stepProgress * 100}%` }}
                      animate={{ left: `${Math.max(stepProgress, 0.02) * 100}%` }}
                      transition={{ duration: 0.3, ease: 'linear' }}
                    >
                      <TruckAnimated />
                    </motion.div>
                  )}
                </div>
              )}

              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border-2 mb-2 z-10"
                animate={{
                  backgroundColor: isCompleted ? '#f97316' : isActive ? '#fde68a' : '#f3f3f3',
                  borderColor: isCompleted || isActive ? '#f97316' : '#d1d5db',
                }}
              >
                <StepIcon
                  className="w-5 h-5 md:w-6 md:h-6"
                  style={{ stroke: isCompleted ? '#fff' : isActive ? '#f97316' : '#9ca3af' }}
                />
              </motion.div>

              <span className={`text-xs md:text-sm font-medium ${isCompleted || isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Driver info */}
      {order.driver && currentStep >= 2 && (
        <div className="mt-4 text-sm text-gray-700 flex items-center space-x-2 bg-gray-50 p-3 rounded-xl shadow-sm">
          <span className="font-medium">Tài xế:</span>
          <img
            src={
              order.driver?.avatar ||
              'https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/487326873_1887063878796318_9080709797256676382_n.jpg'
            }
            alt="Driver avatar"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <span>{order.driver?.name} | </span>
          <Bike className="w-4 h-4 mr-1 text-orange-500" />
          <span className="text-gray-500">Biển số: {order.driver?.BS} | </span>
          <span className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4" />
            ))}
          </span>
          {order.driver?.SĐT && (
            <span className="flex items-center text-gray-500">
              | <Phone className="w-4 h-4 mx-1 text-orange-500" /> {order.driver.SĐT}
            </span>
          )}
          <button
            onClick={() => navigate(`/chat-driver/${order.driver?.id}`)}
            className="ml-auto flex items-center gap-1 text-orange-500 hover:text-orange-600 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Nhắn tin</span>
          </button>
        </div>
      )}

      {/* Order info responsive */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-2 text-sm md:text-base">
        <p className="text-lg font-semibold text-orange-600">Thông tin đơn hàng</p>
        <p>
          <strong>Thanh toán:</strong> {order.payment_method}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {Number(order.total_amount).toLocaleString('vi-VN')}đ
        </p>
        {order.note && (
          <p>
            <strong>Ghi chú:</strong> {order.note}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;


// ✅ Tự động chuyển sang trang theo dõi đơn sau 5 giây
setTimeout(() => {
  navigate(`/track-order/${order.order_id}`, {
    state: { order, from: "OrderSuccess" }, // 👈 thêm flag này
  });
}, 5000);


const [isAutoTracking, setIsAutoTracking] = useState(() => {
  const fromSuccess = location.state?.from === 'OrderSuccess';
  return fromSuccess || !!orderFromState; // ✅ Cho phép auto nếu từ OrderSuccess
});


useEffect(() => {
  if (!orderKey) return;

  const savedStep = localStorage.getItem(`order_${orderKey}_step`);
  const savedStart = localStorage.getItem(`order_${orderKey}_step_start`);

  if (savedStep) setCurrentStep(Number(savedStep));
  if (savedStart) setStepStartTime(Number(savedStart));
}, [orderKey]);


if (currentStep >= timelineSteps.length) {
  localStorage.removeItem(`order_${orderKey}_step`);
  localStorage.removeItem(`order_${orderKey}_step_start`);
  // ...navigate hoặc update trạng thái
}

const stepDuration = 20000; // 20s mỗi step
const now = Date.now();
const elapsed = now - stepStartTime; // thời gian trôi trong step hiện tại
const stepProgress = Math.min(elapsed / stepDuration, 1); // 0 -> 1


//
//
//

//
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TruckAnimated from './TruckAnimated'; // component xe chạy

const timelineSteps = [
  { id: 1, label: 'Đã đặt đơn', icon: Truck },
  { id: 2, label: 'Tài xế nhận đơn', icon: Truck },
  { id: 3, label: 'Tới quán', icon: Truck },
  { id: 4, label: 'Đã lấy đơn', icon: Truck },
  { id: 5, label: 'Giao thành công', icon: Truck },
];

export const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const orderFromState = location.state?.order || null;
  const [order, setOrder] = useState(orderFromState || null);
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(`order_${id}_step`);
    return saved ? Number(saved) : 1;
  });
  const [stepStartTime, setStepStartTime] = useState(() => {
    const saved = localStorage.getItem(`order_${id}_step_start`);
    return saved ? Number(saved) : Date.now();
  });
  const [isAutoTracking, setIsAutoTracking] = useState(true);
  const timerRef = useRef(null);

  const orderKey = useMemo(() => id, [id]);

  // Persist step/time
  useEffect(() => {
    localStorage.setItem(`order_${orderKey}_step`, String(currentStep));
    localStorage.setItem(`order_${orderKey}_step_start`, String(stepStartTime));
  }, [currentStep, stepStartTime, orderKey]);

  // Auto increment step
  useEffect(() => {
    if (!order || !isAutoTracking) return;
    if (currentStep > timelineSteps.length) return;

    const stepDuration = 20000; // 20s
    const now = Date.now();
    const elapsed = Math.max(0, now - stepStartTime);
    const remaining = Math.max(stepDuration - elapsed, 0);

    if (currentStep >= timelineSteps.length) {
      // completed
      localStorage.removeItem(`order_${orderKey}_step`);
      localStorage.removeItem(`order_${orderKey}_step_start`);
      setIsAutoTracking(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, timelineSteps.length));
      setStepStartTime(Date.now());
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [order, isAutoTracking, currentStep, stepStartTime, orderKey]);

  if (!order) return <p className="text-center mt-10">Đang tải đơn hàng...</p>;

  return (
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
          <div key={step.id} className="flex md:flex-1 flex-col items-center text-center relative">
            {/* Line between steps */}
            {index < timelineSteps.length - 1 && (
              <div className="hidden md:block absolute top-5 left-1/2 transform -translate-x-1/2 h-1 w-full z-0 bg-gray-300 overflow-visible">
                {/* Thanh màu cam */}
                <motion.div
                  key={`progress-${currentStep}`}
                  className="h-full bg-orange-500 origin-left"
                  initial={{ scaleX: stepProgress }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: (1 - stepProgress) * stepDuration / 1000,
                    ease: 'linear',
                  }}
                />

                {/* Xe chạy */}
                {isActive && (
                  <motion.div
                    key={`truck-${currentStep}`}
                    className="absolute top-[-20px] z-10"
                    initial={{ left: `${stepProgress * 100}%` }}
                    animate={{ left: '100%' }}
                    transition={{
                      duration: (1 - stepProgress) * stepDuration / 1000,
                      ease: 'linear',
                    }}
                  >
                    <TruckAnimated />
                  </motion.div>
                )}
              </div>
            )}

            {/* Icon step */}
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full z-10 ${
                isCompleted || isActive ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-500'
              }`}
            >
              <StepIcon size={24} />
            </div>
            <span className="mt-2 text-sm">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};





{/* ✅ Driver Info chỉ hiện khi currentStep ≥ 2 */}
{order.driver && currentStep >= 2 && (
  <div className="mt-4 text-sm text-gray-700 flex flex-col md:flex-row md:items-center md:space-x-4 bg-gray-50 p-3 rounded-xl shadow-sm">
    <div className="flex items-center space-x-2 mb-2 md:mb-0">
      {/* Ảnh tài xế */}
      <img
        src={
          order.driver.avatar ||
          'https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/487326873_1887063878796318_9080709797256676382_n.jpg'
        }
        alt="Driver avatar"
        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-300"
      />
      <div className="flex flex-col">
        <span className="font-medium">{order.driver.name || 'Tài xế'}</span>
        <span className="text-gray-500 text-xs md:text-sm flex items-center gap-1">
          <MotorBike className="w-3 h-3 text-orange-500" /> Biển số: {order.driver.BS || '-'}
        </span>
      </div>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4" />
      ))}
    </div>

    {/* SĐT */}
    {order.driver.SĐT && (
      <span className="flex items-center text-gray-500 text-sm md:ml-2 gap-1">
        <Phone className="w-4 h-4 text-orange-500" /> {order.driver.SĐT}
      </span>
    )}

    {/* Icon tin nhắn */}
    {order.driver.id && (
      <button
        onClick={() => navigate(`/chat-driver/${order.driver.id}`)}
        className="mt-2 md:mt-0 ml-auto flex items-center gap-1 text-orange-500 hover:text-orange-600 transition"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm md:text-base">Nhắn tin</span>
      </button>
    )}
  </div>
)}


// Test driver info
const testOrder = {
  id: 'dummy-123',
  status: 'DELIVERING',
  merchant: { merchant_name: 'Nhà hàng Bảo Bến Cảng' },
  driver: {
    id: 'driver-001', // thêm id để nút nhắn tin hoạt động
    name: 'Trương Quốc Bảo',
    BS: '79-Z1 51770',
    SĐT: '0399503025',
    avatar: '', // có thể để avatar rỗng để dùng default
  },
  created_at: new Date(),
};

// Dùng testOrder để render driver info
{testOrder.driver && currentStep >= 2 && (
  <DriverInfo driver={testOrder.driver} />
)}





<div className="flex items-start space-x-2">
  {/* Chấm trạng thái */}
  <span className="w-3 h-3 mt-1 rounded-full bg-orange-500 flex-shrink-0"></span>

  <div className="flex flex-col">
    {/* Hàng chữ "Từ: Tên quán" */}
    <div className="flex space-x-1 items-center">
      <span className="text-gray-700 font-semibold">Từ:</span>
      <span className="text-gray-800 font-medium">
        {order?.merchant_name || 'Đang tải tên quán...'}
      </span>
    </div>
    {/* Địa chỉ */}
    <span className="text-gray-500 text-sm">
      {order?.merchant_address || 'Đang tải địa chỉ...'}
    </span>
  </div>
</div>




export const ToppingSelectionDialog = ({
  isOpen,
  onClose,
  menuItem,
  restaurant,
  quantity,
  imgRef,       // 👈 ref hình món
  cartIconRef,  // 👈 ref icon giỏ hàng
  flyToCart,    // 👈 animation function
}) => {
  const { addItemWithToppings } = useCart();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const isAvailable = menuItem.isAvailable !== false;

  const handleToppingChange = (options, checked) => {
    if (checked) {
      setSelectedToppings((prev) => [...prev, options]);
    } else {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== options.id));
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error('Sản phẩm đã hết hàng/ngừng kinh doanh, vui lòng chọn sản phẩm khác.');
      return;
    }

    const requiredToppings = menuItem.options?.filter((t) => t.required) || [];
    const selectedRequiredToppings = selectedToppings.filter((t) => t.required);

    if (requiredToppings.length > 0 && selectedRequiredToppings.length !== requiredToppings.length) {
      toast.error('Vui lòng chọn topping/tùy chọn đầy đủ.');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItemWithToppings(menuItem, restaurant, selectedToppings, specialInstructions);
    }

    // 👇 Chạy animation nếu có ref
    if (imgRef?.current && cartIconRef?.current && flyToCart) {
      flyToCart();
    }

    // 👇 Hiển thị toast custom
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } flex items-center gap-2 bg-white border border-gray-200 w-[50vw] sm:w-[380px] p-3 rounded-lg`}
      >
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-green-500 rounded-full text-white font-bold">
          ✓
        </div>
        <img
          src={menuItem.image}
          alt={menuItem.name}
          className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded"
        />
        <span className="text-xs sm:text-sm font-medium leading-snug break-words">
          Đã thêm <span className="font-bold text-black">{quantity} </span> cái{' '}
          <span className="font-bold text-black">{menuItem.name}</span> vào giỏ hàng!
        </span>
      </div>
    ));

    onClose();
    setSelectedToppings([]);
    setSpecialInstructions('');
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedToppings([]);
      setSpecialInstructions('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6">
        {/* ... phần còn lại giữ nguyên ... */}
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            disabled={!isAvailable}
          >
            {isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

if (!isAvailable) {
  toast.error('Sản phẩm đã hết hàng/ngừng kinh doanh, vui lòng chọn sản phẩm khác.');
  return;
}

toast.success(`Đã thêm ${quantity} ${menuItem.name} vào giỏ hàng`);
//
//
{state.items.map((item) => {
  const optionTotal = item.selectedOptions
    ? item.selectedOptions.reduce(
        (sum, opt) =>
          sum +
          opt.items.reduce((s, oi) => s + Number(oi.price || 0), 0),
        0
      )
    : 0;

  const itemTotal = (item.menuItem.price + optionTotal) * item.quantity;

  return (
    <div key={item.id} className="flex justify-between items-center">
      <ImageWithFallback
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="object-cover w-[40px] h-[40px] p-1 rounded-lg flex-shrink-0"
      />
      <div className="flex-1">
        <p className="font-medium">{item.menuItem.name}</p>

        {/* Hiển thị option đã chọn */}
        {item.selectedOptions?.map((opt) => (
          <p key={opt.option_id} className="text-xs text-gray-500">
            {opt.option_name}: {opt.items.map((oi) => oi.option_item_name).join(', ')}
          </p>
        ))}

        <p className="text-sm text-gray-500">
          {item.quantity} x {(item.menuItem.price + optionTotal).toLocaleString('vi-VN')}đ
        </p>
      </div>

      <span className="font-medium">{itemTotal.toLocaleString('vi-VN')}đ</span>
    </div>
  );
})}


{state.items
  .reduce((total, i) => {
    const optionTotal = i.selectedOptions
      ? i.selectedOptions.reduce(
          (sum, opt) =>
            sum + opt.items.reduce((s, oi) => s + Number(oi.price || 0), 0),
          0
        )
      : 0;
    return total + (i.menuItem.price + optionTotal) * i.quantity;
  }, 0)
  .toLocaleString('vi-VN')}
//
import { getDistanceKm, calculateDeliveryFee } from '../../utils/distanceUtils';

// Lấy lat/lon nhà hàng và địa chỉ
const restaurantLat = merchant?.lat;
const restaurantLon = merchant?.lon;

const deliveryLat = selectedAddress?.lat;
const deliveryLon = selectedAddress?.lon;

// Tính khoảng cách
const distanceKm = getDistanceKm(restaurantLat, restaurantLon, deliveryLat, deliveryLon);

// Tính phí giao hàng
const deliveryFee = calculateDeliveryFee(distanceKm);

// Tổng cộng
const total = subtotal + deliveryFee;


import { useDeliveryFee } from "../../hooks/useDeliveryFee";
import { useLocation } from "../../contexts/LocationContext";

export default function HomePage() {
  const { state: locationState } = useLocation(); // vị trí người dùng
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // fetch restaurants như anh đã làm
  useEffect(() => { /* ...fetch code... */ }, [searchQuery]);

  return (
    <div>
      {restaurants.map((r) => {
        const fee = useDeliveryFee(
          r.coordinates,
          locationState.currentLocation?.coordinates
        );

        return (
          <div key={r.id}>
            <RestaurantCard restaurant={r} />
            <p className="text-sm text-gray-500">
              Phí giao hàng: {fee.toLocaleString("vi-VN")}đ
            </p>
          </div>
        );
      })}
    </div>
  );
}





/**
 * Tính khoảng cách (km) giữa 2 điểm lat/lon theo Haversine formula
 * @param {number} lat1 
 * @param {number} lng1 
 * @param {number} lat2 
 * @param {number} lng2 
 * @returns {number} khoảng cách (km)
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const R = 6371; // bán kính Trái Đất (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
* Tính phí giao hàng dựa vào khoảng cách
* @param {number} distanceKm 
* @returns {number} phí ship (VNĐ)
*/
export function calculateDeliveryFee(distanceKm) {
  if (distanceKm <= 2) return 10000;
  if (distanceKm <= 5) return 15000;
  if (distanceKm <= 10) return 20000;
  return 30000; // >10km
}

/**
* Tính thời gian giao hàng dựa vào khoảng cách (km)
* Giả sử tốc độ trung bình 25 km/h
* @param {number} distanceKm
* @returns {number} phút
*/
export function estimateDeliveryTime(distanceKm) {
  const speedKmH = 25;
  const timeH = distanceKm / speedKmH;
  return Math.ceil(timeH * 60); // phút
}
//
//
//
const userCoords = state.currentLocation?.coordinates;
const restaurantCoords = restaurant?.coordinates;

let distanceKm = 0;
let deliveryTime = 0;
let deliveryFee = 0;

if (userCoords && restaurantCoords) {
  distanceKm = getDistanceKm(
    userCoords.lat,
    userCoords.lng,
    restaurantCoords.lat,
    restaurantCoords.lng
  );

  deliveryFee = calculateDeliveryFee(distanceKm);
  deliveryTime = estimateDeliveryTime(distanceKm);
}

