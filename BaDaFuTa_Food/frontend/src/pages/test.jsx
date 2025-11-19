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

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { OrderHistoryCard } from '../../components/OrderHistoryCard';
// import { ProtectedRoute } from "../components/ProtectedRoute";
import { ShoppingBag, Package2, X, Clock } from 'lucide-react';
import { orderHistory as initialOrderHistory } from '../../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@radix-ui/react-dialog';

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  // const [orders, setOrders] = useState(initialOrderHistory);
  // const [orders, setOrders] = useState([]);
  const [orders, setOrders] = useState([]); // ✅ KHỞI TẠO MẢNG RỖNG

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'PENDING');
  const { state: authState } = useAuth();
  const user = authState?.user;
  //state huỷ đơn
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (location.state?.updatedOrder) {
      const updatedOrder = location.state.updatedOrder;
      setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    }
  }, [location.state?.updatedOrder]);

  // 🧩 Gọi API lấy danh sách đơn hàng
  useEffect(() => {
    if (user === null) return; // Chờ user load từ context

    if (!user) {
      navigate('/login');
      return;
    }

    // Tạo body
    const orderBody = {
      user_id: user.id,
    };

    const fetchOrders = async () => {
      const hosts = ['/apiLocal/order/getOrder'];
      for (const host of hosts) {
        try {
          setLoading(true);
          const token = localStorage.getItem('accessToken');

          const res = await fetch(host, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ user_id: user.id }),
          });

          if (!res.ok) throw new Error(`❌ Lỗi khi gọi ${host}`);
          const data = await res.json();
          console.log('📦 API trả về:', data);

          const formattedOrders = Array.isArray(data.items)
          ? data.items.map(o => ({ ...o, id: o.order_id }))
          : [{ ...data, id: data.order_id }];
        
          setOrders(formattedOrders);
          // setOrders(data.orders);
          setOrders(Array.isArray(data) ? data : [data]);
          console.log('✅ Lấy dữ liệu đơn hàng từ:', host);
          return;
        } catch (err) {
          console.warn(err.message);
        } finally {
          setLoading(false);
        }
      }

      console.error('❌ Không thể lấy dữ liệu đơn hàng từ bất kỳ host nào');
      setError('Không thể tải dữ liệu đơn hàng.');
    };

    fetchOrders();
  }, [user]);

  // Khi nhấn nút Huỷ
  const handleOpenCancelDialog = (order) => {
    if (order.status === 'CONFIRMED') {
      alert('❌ Đơn hàng đã được xác nhận, không thể huỷ.');
      return;
    }
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  // Xác nhận hủy
  const handleConfirmCancel = () => {
    if (orderToCancel) handleCancelOrder(orderToCancel.order_id);
  };
  // Khi xác nhận huỷ
  // const handleCancelOrder = async (order) => {
  //   if (!orderToCancel) return;
  //   const order_id = order.order_id;
  //   const oldStatus = order.status; // lưu trạng thái cũ
  //   // Optimistic update
  //   setOrders((prev) => prev.map((o) => (o.id === order_id ? { ...o, status: 'CANCELED' } : o)));

  //   // Đóng dialog
  //   setShowCancelDialog(false);
  //   setOrderToCancel(null);

  //   try {
  //     const token = localStorage.getItem('accessToken');
  //     const res = await fetch(`/apiLocal/order/${order_id}/cancel`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       },
  //     });

  //     if (!res.ok) throw new Error('❌ Hủy đơn thất bại');

  //     // // Cập nhật ngay state orders
  //     // setOrders((prev) => prev.map((o) => (o.id === order_id ? { ...o, status: 'CANCELED' } : o)));
  //     console.log('✔ Đã hủy đơn:', order_id);
  //   } catch (err) {
  //     console.error('❌ Lỗi hủy đơn:', err);
  //     // 🔹 Rollback dùng trạng thái cũ đã lưu
  //     setOrders((prev) => prev.map((o) => (o.id === order_id ? { ...o, status: oldStatus } : o)));
  //     alert('❌ Hủy đơn thất bại, vui lòng thử lại.');
  //   }
  //   // } finally {
  //   //   setShowCancelDialog(false);
  //   //   setOrderToCancel(null);
  //   // }
  // };
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    const order_id = orderToCancel.order_id;
    const oldStatus = orderToCancel.status;

    // ✅ Optimistic update
    setOrders(prev => prev.map(o => o.order_id === order_id ? { ...o, status: 'CANCELED' } : o));
    setShowCancelDialog(false);
    setOrderToCancel(null);
    setActiveTab('CANCELED'); // đổi tab ngay

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/apiLocal/order/${order_id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error('❌ Hủy đơn thất bại');

      console.log('✔ Đã hủy đơn:', order_id);
    } catch (err) {
      console.error('❌ Lỗi hủy đơn:', err);

      // rollback nếu lỗi
      setOrders(prev => prev.map(o => o.order_id === order_id ? { ...o, status: oldStatus } : o));
      alert('❌ Hủy đơn thất bại, vui lòng thử lại.');
    }
  };

  //Rating
  const handleRatingSubmit = (rating) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === rating.orderId
          ? {
              ...order,
              rating: rating.rating,
              review: rating.review,
              canRate: false,
            }
          : order,
      ),
    );
  };

  // 🧠 Lọc đơn hàng theo trạng thái
  const pendingOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'PENDING') : []),
    [orders],
  );

  const deliveredOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'COMPLETED') : []),
    [orders],
  );

  const shippingOrders = useMemo(
    () =>
      orders
        ? orders.filter((order) => order.status === 'DELIVERING' || order.status === 'CONFIRMED')
        : [],
    [orders],
  );

  const cancelledOrders = useMemo(
    () => (orders ? orders.filter((order) => order.status === 'CANCELED') : []),
    [orders],
  );

  //    const ratingOrders = useMemo(
  //     () => orders.fillter((order) => order.status === "rating"),
  //     [orders]
  //   );

  // console.log('📦 Orders:', data); // xem key của ID là gì

  const EmptyState = ({ type, icon: Icon, message }) => (
    <Card className="hover:scale-100">
      <CardContent className="text-center py-12">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">{message}</h3>
        <p className="text-gray-500 mb-6">
          {type === 'shipping' && 'Bạn chưa có đơn hàng nào đang được giao. Hãy đặt hàng ngay!'}
          {type === 'delivered' &&
            'Bạn chưa có đơn hàng nào đã mua. Khám phá các nhà hàng ngon ngay!'}
          {type === 'cancelled' && 'Bạn chưa có đơn hàng nào bị hủy. Thật tuyệt vời!'}
        </p>
        <Button variant="default" onClick={() => navigate('/')} className="w-max">
          Khám phá nhà hàng
        </Button>
      </CardContent>
    </Card>
  );

  // ⏳ Hiển thị khi đang tải hoặc lỗi
  if (loading) return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  //Giao diện chính
  return (
    // <ProtectedRoute>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {/* <Tabs defaultValue="DELIVERING" className="space-y-6"> */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="PENDING" className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Chờ xác nhận ({pendingOrders.length})</span>
          </TabsTrigger>

          <TabsTrigger value="DELIVERING" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Đang giao ({shippingOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="COMPLETED" className="flex items-center space-x-2">
            <Package2 className="w-4 h-4" />
            <span>Đã giao ({deliveredOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="CANCELED" className="flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>Đã hủy ({cancelledOrders.length})</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="delivered"
            className="flex items-center space-x-2"
          >
            <Package2 className="w-4 h-4" />
            <span>Đánh giá ({ratingOrders.length})</span>
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="PENDING" className="space-y-4">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                onRatingSubmit={handleRatingSubmit}
                onCancel={handleOpenCancelDialog} // ✅ truyền hàm mở dialog
              />
            ))
          ) : (
            <EmptyState type="PENDING" icon={ShoppingBag} message="Chưa có đơn hàng chờ xác nhận" />
          )}
        </TabsContent>

        <TabsContent value="DELIVERING" className="space-y-4">
          {shippingOrders.length > 0 ? (
            shippingOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
            ))
          ) : (
            <EmptyState type="DELIVERING" icon={Clock} message="Chưa có đơn hàng đang giao" />
          )}
        </TabsContent>

        <TabsContent value="COMPLETED" className="space-y-4">
          {deliveredOrders.length > 0 ? (
            deliveredOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
            ))
          ) : (
            <EmptyState type="COMPLETED" icon={Package2} message="Chưa có đơn hàng mua" />
          )}
        </TabsContent>

        <TabsContent value="CANCELED" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            cancelledOrders.map((order) => (
              <OrderHistoryCard key={order.id} order={order} onRatingSubmit={handleRatingSubmit} />
            ))
          ) : (
            <EmptyState type="CANCELED" icon={X} message="Chưa có đơn hàng hủy" />
          )}
        </TabsContent>
      </Tabs>
      {showCancelDialog && orderToCancel && (
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/30" />
            <DialogContent className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <h3 className="text-lg mb-4">
                Bạn có chắc muốn huỷ đơn gồm:{' '}
                {orderToCancel.items.map((item, index) => (
                  <span key={index}>
                    <strong>{item.name_item}</strong>
                    {index < orderToCancel.items.length - 1 ? ', ' : ''}
                  </span>
                ))}{' '}
                không?
              </h3>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Huỷ
                </Button>
                <Button variant="default" className="w-max" onClick={handleCancelOrder}>
                  Xác nhận
                </Button>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
    // </ProtectedRoute>
  );
};
///
///
//
const handleSubmit = () => {
  if (rating === 0) {
    alert("Vui lòng chọn số sao đánh giá");
    return;
  }

  const newRating = {
    orderId: order.id,
    rating,
    review: review.trim(),
    date: new Date().toISOString(),
  };

  if (order.rating) {
    onUpdateRating?.(newRating.orderId, newRating.rating, newRating.review);
  } else {
    onCreateRating?.(newRating.orderId, newRating.rating, newRating.review);
  }

  setRating(0);
  setReview("");
  setHoveredRating(0);
  onOpenChange(false);
};


{order.canRate && activeTab === 'COMPLETED' && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => setShowRatingDialog(true)}
    className="flex items-center gap-1"
  >
    <Star className="w-4 h-4" />
    <span>Đánh giá</span>
  </Button>
)}
<TabsContent value="COMPLETED" className="space-y-4">
  {deliveredOrders.length > 0 ? (
    deliveredOrders.map((order) => (
      <OrderHistoryCard
        key={order.id}
        order={order}
        onCreateRating={handleCreateRating}
        onUpdateRating={handleUpdateRating}
        onDeleteRating={handleDeleteRating}
        onCancel={handleOpenCancelDialog}
      />
    ))
  ) : (
    <EmptyState type="COMPLETED" icon={Package2} message="Chưa có đơn hàng mua" />
  )}
</TabsContent>
const updatedOrder = {
  ...order,
  rating: data.data?.rating || null,
  review: data.data?.review || '',
  canRate: !data.data?.rating,
};
{/* Hiển thị đánh giá với icon chỉnh */}
{order.status === 'COMPLETED' && order.rating && (
  <div className="flex items-center gap-1">
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    <span className="text-sm font-medium">{order.rating}</span>

    {/* Icon cây bút nhỏ để chỉnh */}
    <button
      type="button"
      className="ml-1 text-gray-500 hover:text-gray-700"
      onClick={() => {
        setEditingOrder(order); // lưu order đang chỉnh
        setShowRatingDialog(true); // mở dialog rating
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.232 5.232l3.536 3.536M4 13v7h7l11-11-7-7L4 13z"
        />
      </svg>
    </button>
  </div>
)}
//
//
<div className="flex justify-between items-start p-4 rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
  <div className="space-y-2 w-full">
    <!-- nội dung địa chỉ -->
  </div>

  <!-- Nút sửa thu gọn -->
  <div className="flex-shrink-0">
    <Button
      variant="outline"
      onClick={() => {
        setFormData(selectedAddress);
        setIsEditing(true);
        setIsAdding(false);
        setIsDialogOpen(true);
      }}
      className="flex items-center gap-1"
    >
      <Edit className="w-4 h-4" /> Sửa
    </Button>
  </div>
</div>
//
//
//
//
<Route
path="/cart/checkout/ordersuccess"
element={<OrderSuccessPage />}
/>

{/* 
      <Route
        path="/cart/checkout/ordersuccess"
        element={
          <ProtectedRoute
            condition={localStorage.getItem("orderConfirmed") === "true"}
            redirectTo="/cart"
          >
            <OrderSuccessPage />
          </ProtectedRoute>
        }
        
      /> */}
      <Route
        path="/cart/checkout/ordersuccess"
        element={<OrderSuccessPage />}
      />
 app.jsx
const momoHandled = useRef(false);

useEffect(() => {
  if (status === "success" && encodedData && !momoHandled.current) {
    momoHandled.current = true; // ✅ chỉ chạy 1 lần
    try {
      const decodedJson = atob(decodeURIComponent(encodedData));
      const decodedData = JSON.parse(decodedJson);

      setValidated(true);
      clearCart();

      setTimeout(() => {
        if (decodedData?.status === "DELIVERING") {
          navigate(`/track-order/${decodedData.order_id}`, {
            state: { order: decodedData, from: "OrderSuccess" },
          });
        } else {
          alert("Đơn hàng chưa được xác nhận, không thể xem chi tiết vận chuyển.");
          navigate("/my-orders", { state: { activeTab: "PENDING" } });
        }
      }, 5000);
    } catch (err) {
      console.error("❌ Decode callback error:", err);
      navigate("/cart/checkout/orderfailed");
    }
  }
}, [status, encodedData, navigate, clearCart]);

<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4a90e2">
//
</meta>
//
</link>
app.use(cors({
  origin: [
    "https://ba-da-fu-ta-food.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
DATABASE_URL="postgres://postgres:190404@localhost:54320/BaDaFuTa?schema=public"
JWT_SECRET=bao_dep_trai_vo_dich_1904


fetch('https://badafuta-be.onrender.com/api/categories')
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const url = `${BASE_URL}/restaurants${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`;
const res = await fetch(url);


<div className="flex justify-between items-center w-full">
  <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
    <MapPin className="w-5 h-5 text-accent" />
    <span>Địa chỉ giao hàng mặt định</span>
  </p>

  <div className="flex space-x-2">
    <Button
      variant="outline"
      onClick={() => {
        setFormData(selectedAddress);
        setIsEditing(true);
        setIsAdding(false);
        setIsDialogOpen(true);
      }}
    >
      <Edit /> Sửa
    </Button>
  </div>
</div>
