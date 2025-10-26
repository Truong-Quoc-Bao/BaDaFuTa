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

// OrderSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  const handleReturn = () => {
    localStorage.removeItem("orderConfirmed");
    navigate("/"); // hoặc "/cart"
  };

  // KHÔNG remove trong useEffect — để reload vẫn giữ được
  // useEffect(() => { localStorage.removeItem("orderConfirmed"); }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Đặt hàng thành công!</h1>
      <p className="mb-4">Cảm ơn bạn đã mua hàng.</p>
      <button
        onClick={handleReturn}
        className="bg-accent text-white px-4 py-2 rounded"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}

function AppRoutes() {
  const { state, isInitialized } = useCart();
  const cart = state.items || [];

  if (!isInitialized) return null; // ⏳ chờ cart load xong

  return (
    <Routes>
      {/* ... các route khác */}
      <Route
        path="/cart/checkout"
        element={
          <ProtectedRoute condition={cart.length > 0} redirectTo="/cart">
            <CheckOutPage />
          </ProtectedRoute>
        }
      />
      {/* ... */}
    </Routes>
  );
}



import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useCart();
  const [validated, setValidated] = useState(false); // ✅ trạng thái kiểm tra xong chưa

  useEffect(() => {
    // Đợi cart state load xong (tránh undefined)
    if (!state || state.items === undefined) return;

    const orderConfirmed = localStorage.getItem("orderConfirmed");

    // Nếu chưa có flag hoặc giỏ hàng trống → quay về /cart
    if (!orderConfirmed || state.items.length === 0) {
      navigate("/cart");
      return;
    }

    // ✅ Nếu hợp lệ
    setValidated(true);

    // Xoá flag sau khi đã render xong trang
    const timer = setTimeout(() => {
      localStorage.removeItem("orderConfirmed");
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, state]);

  // ⚠️ Nếu chưa xác thực, tạm không render gì (tránh nháy trắng)
  if (!validated) return null;

  const handleReturn = () => navigate("/");
  const handleCancelOrder = () => {
    const confirmCancel = window.confirm("❗ Bạn có chắc muốn huỷ đơn hàng này không?");
    if (confirmCancel) {
      alert("🚫 Đơn hàng đã được huỷ thành công!");
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-500 mb-6">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao hàng sớm nhất có thể!
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="default"
          className="w-[160px] bg-orange-600 hover:bg-orange-700 text-white"
          onClick={handleReturn}
        >
          Quay lại trang chủ
        </Button>

        <Button
          variant="destructive"
          className="w-[160px] bg-red-600 hover:bg-red-700 text-white"
          onClick={handleCancelOrder}
        >
          Huỷ đơn
        </Button>
      </div>
    </div>
  );
}


useEffect(() => {
  const orderConfirmed = localStorage.getItem("orderConfirmed");
  if (!orderConfirmed) {
    navigate("/cart", { replace: true });
    return;
  }

  setValidated(true);

  return () => {
    localStorage.removeItem("orderConfirmed"); // xoá flag sau khi render
  };
}, [navigate]);
<Button
  variant="default"
  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
  onClick={() => {
    localStorage.setItem("orderConfirmed", "true");
    navigate("/cart/checkout/ordersuccess");
    clearCart();
  }}
>
  Xác nhận ngay
</Button>


function App() {
  const location = useLocation();
  const hideHeaderFooter = [
    "/login",
    "/register",
    "/merchantlogin",
    "/phone-otp",
  ].includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { pointerEvents: "none" },
            pauseOnFocusLoss: false,
            pauseOnHover: false,
          }}
        />
        {hideHeaderFooter ? (
          <AppRoutes />
        ) : (
          <Layout>
            <AppRoutes />
          </Layout>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
