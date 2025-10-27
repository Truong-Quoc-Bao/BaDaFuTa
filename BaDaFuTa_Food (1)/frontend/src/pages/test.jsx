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

// ----- AppInner: mount CartProvider sau AuthProvider -----
function AppInner() {
  const location = useLocation();
  const hideHeaderFooter = [
    "/login",
    "/register",
    "/merchantlogin",
    "/phone-otp",
  ].includes(location.pathname);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { pointerEvents: "none" },
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }}
      />

      <CartProvider>
        {!hideHeaderFooter ? (
          <Layout>
            <AppRoutes />
          </Layout>
        ) : (
          <AppRoutes />
        )}
      </CartProvider>
    </>
  );
}

// ----- App chính: AuthProvider bao ngoài cùng -----
function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;


// trong component Header:
const { state: cartState } = useCart();
const { state: authState, logout } = useAuth();
const cartIconRef = useRef(null);

const navigate = useNavigate();
const location = useLocation();
const [menuOpen, setMenuOpen] = useState(false);

// Lấy user từ AuthContext
const user = authState.user;

if (!cartState || !authState) {
  return null; // render null lúc provider chưa mount hoặc chưa init
}

const isLoggedIn = authState.isAuthenticated; 
const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
