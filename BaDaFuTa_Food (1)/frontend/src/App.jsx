import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import MerchantLogin from "./pages/MerchantLoginPage"
import PhoneVerification from "./pages/PhoneVerification"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
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
import CheckOutPage from "./pages/CheckOutPage"
import { Toaster } from "react-hot-toast";
import "./index.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


function App() {
  const location = useLocation(); // ✅ lấy location hiện tại
  const hideHeaderFooter = ["/login", "/register", "/merchantlogin", "/phone-otp"].includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {!hideHeaderFooter && <Header />}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000, // 2 giây tự tắt
            style: { pointerEvents: "none" }, // tránh bị touch giữ
            pauseOnFocusLoss: false,
            pauseOnHover: false,
          }}
        />
        {/* <ToastContainer
          position="top-right"
          toastOptions={{
            duration: 2000, // 2 giây tự tắt
            style: { pointerEvents: "none" }, // tránh bị touch giữ
            pauseOnFocusLoss: false,
            pauseOnHover: false,
          }}
         
        /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/phone-otp" element={<PhoneVerification/>}/>
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
          <Route path="/cart/checkout" element={<CheckOutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
