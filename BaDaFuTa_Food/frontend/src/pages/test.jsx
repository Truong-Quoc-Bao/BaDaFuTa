// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { CartProvider } from "./contexts/CartContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import MerchantLogin from "./pages/MerchantLoginPage"
// import PhoneVerification from "./pages/PhoneVerification"
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
// import CheckOutPage from "./pages/CheckOutPage"
// import { Toaster } from "react-hot-toast";
// import OrderSuccess from "./pages/OrderSuccess";
// import "./index.css";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// function App() {
//   const location = useLocation(); // ✅ lấy location hiện tại
//   const hideHeaderFooter = ["/login", "/register", "/merchantlogin", "/phone-otp"].includes(location.pathname);

//   return (
//     <AuthProvider>
//       <CartProvider>
//         {!hideHeaderFooter && <Header />}
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 3000, // 2 giây tự tắt
//             style: { pointerEvents: "none" }, // tránh bị touch giữ
//             pauseOnFocusLoss: false,
//             pauseOnHover: false,
//           }}
//         />
//         {/* <ToastContainer
//           position="top-right"
//           toastOptions={{
//             duration: 2000, // 2 giây tự tắt
//             style: { pointerEvents: "none" }, // tránh bị touch giữ
//             pauseOnFocusLoss: false,
//             pauseOnHover: false,
//           }}

//         /> */}
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/phone-otp" element={<PhoneVerification />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/merchantlogin" element={<MerchantLogin />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/support" element={<SupportPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//           <Route path="/restaurant/:id" element={<RestaurantPage />} />
//           <Route
//             path="/restaurant/:id/menu/:itemId"
//             element={<MenuItemDetailPage />}
//           />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/cart/checkout" element={<CheckOutPage />} />
//           <Route path="/cart/checkout/ordersuccess" element={<OrderSuccess/>} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         {!hideHeaderFooter && <Footer />}
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;





///checkout

  // // ======================
  // // 🧩 Khi bấm "Xác nhận"
  // // ======================
  // const handleSaveOnCheckout = () => {
  //   if (!selectedAddress) {
  //     alert("Chưa có địa chỉ giao hàng!");
  //     return;
  //   }
  //   if (!selectedPaymentMethod) {
  //     alert("Vui lòng chọn phương thức thanh toán!");
  //     return;
  //   }

  //   const newAddress = { ...formData, id: Date.now() };

  //   // Tính thời gian dự kiến giao hàng: 35-40 phút
  //   const now = new Date();
  //   const minutesToAdd = Math.floor(Math.random() * 6) + 35;
  //   const estimatedTime = new Date(now.getTime() + minutesToAdd * 60000);
  //   // Gán estimatedTime ngay vào address
  //   const finalAddress = { ...newAddress, estimatedTime };

  //   const isExisting = addressList.some(
  //     (addr) =>
  //       addr.full_name === newAddress.full_name &&
  //       addr.phone === newAddress.phone &&
  //       addr.address === newAddress.address
  //   );

  //   // Hiển thị popup xác nhận
  //   setSelectedAddress(finalAddress); // ✅ gán ngay để popup show thời gian
  //   setShowConfirmPopup(true);
  //   setCountdown(10); // reset countdown

  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         setShowConfirmPopup(false);

  //         if (!isExisting) {
  //           // Lưu địa chỉ mới
  //           const updatedList = [...addressList, finalAddress];
  //           setAddressList(updatedList);
  //           localStorage.setItem(
  //             `addressList_${user.id}`,
  //             JSON.stringify(updatedList)
  //           );
  //           setSelectedAddress(newAddress);
  //           alert("✅ Địa chỉ mới đã được lưu vào danh sách địa chỉ cũ!");
  //         } else {
  //           const existingAddr = addressList.find(
  //             (addr) =>
  //               addr.full_name === newAddress.full_name &&
  //               addr.phone === newAddress.phone &&
  //               addr.address === newAddress.address
  //           );
  //           setSelectedAddress({ ...existingAddr, estimatedTime });
  //           // alert("✅ Đang sử dụng địa chỉ cũ, không lưu trùng!");
  //         }

  //         // 🔥 Gọi API tạo đơn hàng trực tiếp tại đây
  //         const orderBody = {
  //           user_id: user.id,
  //           merchant_id: merchant.id,
  //           phone: finalAddress.phone,
  //           delivery_address: finalAddress.address,
  //           delivery_fee: 30000,
  //           items: state.items?.map((item) => ({
  //             menu_item_id: item.menuItem?.id,
  //             quantity: item.quantity,
  //             price: item.menuItem?.price,
  //           })),
  //         };
  //         console.log("📦 Order body:", JSON.stringify(orderBody, null, 2));

  //         fetch("/apiLocal/order", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(orderBody),
  //         })
  //           .then(async (res) => {
  //             if (!res.ok) throw new Error(await res.text());
  //             return res.json();
  //           })
  //           .then((data) => {
  //             console.log("✅ Đơn hàng tạo thành công:", data);
  //             localStorage.setItem("orderConfirmed", "true");
  //             navigate("/cart/checkout/ordersuccess");
  //             clearCart();
  //           })
  //           .catch((err) => {
  //             console.error("❌ Lỗi tạo đơn:", err);
  //             alert("Không thể tạo đơn hàng!");
  //           });

  //         // alert("✅ Đơn hàng đã được tự động xác nhận sau 20 giây!");

  //         // // await placeOrderAPI(state.items); // thanh toán
  //         // localStorage.setItem("orderConfirmed", "true");
  //         // navigate("/cart/checkout/ordersuccess");
  //         // clearCart(); // ✅ clear cart sau khi navigate
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // };







import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import MerchantLogin from "./pages/MerchantLoginPage";
import PhoneVerification from "./pages/PhoneVerification";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { SupportPage } from "./pages/SupportPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { RestaurantPage } from "./pages/RestaurantPage";
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckOutPage";
import OrderSuccess from "./pages/OrderSuccess";
import { Toaster } from "react-hot-toast";
import "./index.css";

// ----- Protected wrapper dựa trên giỏ hàng -----
function ProtectedRouteWrapper({ children }) {
  const { state, isInitialized } = useCart();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return state.items.length > 0 ? children : <Navigate to="/cart" />;
}

// ----- Routes -----
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/phone-otp" element={<PhoneVerification />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/merchantlogin" element={<MerchantLogin />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route
        path="/restaurant/:id/menu/:itemId"
        element={<MenuItemDetailPage />}
      />
      <Route path="/cart" element={<CartPage />} />

      <Route
        path="/cart/checkout"
        element={
          <ProtectedRouteWrapper>
            <CheckOutPage />
          </ProtectedRouteWrapper>
        }
      />

      <Route
        path="/cart/checkout/ordersuccess"
        element={
          <ProtectedRouteWrapper>
            <ProtectedRoute
              condition={localStorage.getItem("orderConfirmed") === "true"}
              redirectTo="/cart"
            >
              <OrderSuccess />
            </ProtectedRoute>
          </ProtectedRouteWrapper>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}







// ======================
// 🧩 Khi bấm "Đặt hàng / Xác nhận"
// ======================
const handleSaveOnCheckout = async () => {
  if (!selectedAddress) {
    alert("Chưa có địa chỉ giao hàng!");
    return;
  }
  if (!selectedPaymentMethod) {
    alert("Vui lòng chọn phương thức thanh toán!");
    return;
  }

  const newAddress = { ...formData, id: Date.now() };
  const now = new Date();
  const minutesToAdd = Math.floor(Math.random() * 6) + 35;
  const estimatedTime = new Date(now.getTime() + minutesToAdd * 60000);
  const finalAddress = { ...newAddress, estimatedTime };

  const isExisting = addressList.some(
    (addr) =>
      addr.full_name === newAddress.full_name &&
      addr.phone === newAddress.phone &&
      addr.address === newAddress.address
  );

  if (!isExisting) {
    const updatedList = [...addressList, finalAddress];
    setAddressList(updatedList);
    localStorage.setItem(
      `addressList_${user.id}`,
      JSON.stringify(updatedList)
    );
    alert("✅ Địa chỉ mới đã được lưu vào danh sách!");
  }

  setSelectedAddress(finalAddress);
  const method = selectedPaymentMethod.type.toUpperCase();

  const orderBody = {
    user_id: user.id,
    merchant_id: merchant.id,
    phone: finalAddress.phone,
    delivery_address: finalAddress.address,
    delivery_fee: finalAddress.deliveryFee,
    payment_method: selectedPaymentMethod.type,
    note: finalAddress?.note,
    items: state.items.map((i) => ({
      menu_item_id: i.menu_item_id ?? i.menuItem?.id,
      quantity: i.quantity,
      price: i.price ?? i.menuItem?.price,
    })),
  };

  if (method === "COD") {
    setShowConfirmPopup(true);
    setCountdown(10);
  } else if (method === "VNPAY") {
    try {
      const res = await fetch("http://localhost:3000/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      window.location.href = data.payment_url;
      // Clear giỏ hàng để tránh lỗi lặp đơn nếu cần
      clearCart();
    } catch (err) {
      console.error("❌ Lỗi tạo đơn VNPay:", err);
      alert("Không thể chuyển sang VNPay!");
    }
  }
};

// ======================
// ⏱️ Đếm ngược popup tiền mặt
// ======================
useEffect(() => {
  if (!showConfirmPopup) return;
  if (countdown === 0) return;
  const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
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
    const orderBody = {
      user_id: user.id,
      merchant_id: merchant.id,
      phone: selectedAddress.phone,
      delivery_address: selectedAddress.address,
      delivery_fee: selectedAddress.deliveryFee,
      payment_method: "COD",
      note: selectedAddress?.note,
      items: state.items.map((i) => ({
        menu_item_id: i.menu_item_id ?? i.menuItem?.id,
        quantity: i.quantity,
        price: i.price ?? i.menuItem?.price,
      })),
    };

    const res = await fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    console.log("✅ Đơn hàng tạo thành công:", data);
    localStorage.setItem("orderConfirmed", "true");
    clearCart();
    navigate("/cart/checkout/ordersuccess");
  } catch (err) {
    console.error("❌ Lỗi tạo đơn:", err);
    alert("Không thể tạo đơn hàng!");
  }
};

// ======================
// 🧩 VNPay Callback handler (trang callback)
// ======================
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const orderId = params.get("order_id");

  if (!status || !orderId) return;

  if (status === "success") {
    navigate("/cart/checkout/ordersuccess");
  } else if (status === "cancel") {
    navigate("/cart/checkout/pending");
  }
}, []);


// ======================
  // VNPay Callback
  // ======================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (!status) return;

    switch (status) {
      case "success":
       console.log("✅ Đơn hàng tạo thành công:", data);
       localStorage.setItem("orderConfirmed", "true");
       clearCart();
       navigate("/cart/checkout/ordersuccess");
        break;

      case "pending":
        // ⏳ giữ giỏ hàng khi huỷ
        navigate("/cart/checkout/orderpending");
        break;

      default:
        navigate("/cart/checkout/orderfailed");
        break;
    }
  }, []);




/** 🔹 Xử lý callback từ VNPAY */
async callback(req: Request, res: Response) {
  try {
    const result = await paymentService.handleVnpayCallback(req.query);

    if (result.status === "success") {
      // ✅ Redirect sang frontend với query param vnpay=true
      return res.redirect(
        `http://localhost:5173/cart/checkout/ordersuccess?status=success&vnpay=true&code=${result.code}`
      );
    } else {
      // ❌ Redirect sang trang pending hoặc failed
      return res.redirect(
        `http://localhost:5173/cart/checkout/pending?status=failed&vnpay=true&code=${result.code}`
      );
    }
  } catch (err: any) {
    console.error("callback error:", err);
    return res.redirect(
      `http://localhost:5173/cart/checkout/orderfailed?status=error&message=${encodeURIComponent(
        err.message
      )}`
    );
  }
}




useEffect(() => {
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const code = params.get("code");

  if (!status) return;

  setLoading(true);

  const timer = setTimeout(() => {
    switch (status) {
      case "success":
        localStorage.setItem("orderConfirmed", "true");
        clearCart();
        navigate("/cart/checkout/ordersuccess");
        break;

      case "canceled":
        navigate("/cart/pending"); // FE sẽ nhận redirect từ BE
        break;

      default:
        clearCart();
        alert("❌ Thanh toán thất bại, vui lòng thử lại!");
        navigate("/cart/checkout/orderfailed");
        break;
    }
    setLoading(false);
  }, 300);

  return () => clearTimeout(timer);
}, [location.search, navigate]);
