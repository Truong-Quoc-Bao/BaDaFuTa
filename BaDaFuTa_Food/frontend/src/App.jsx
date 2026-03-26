import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from './components/Layout';
// import MerchantLogin from "./pages/merchant/MerchantLoginPage";
import PhoneVerificationPage from './pages/user/PhoneVerificationPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import HomePage from './pages/user/HomePage';
import { AboutPage } from './pages/user/AboutPage';
import { SupportPage } from './pages/user/SupportPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { SettingsPage } from './pages/user/SettingsPage';
import { RestaurantPage } from './pages/user/RestaurantPage';
import MenuItemDetailPage from './pages/user/MenuItemDetailPage';
import CartPage from './pages/user/CartPage';
import CheckOutPage from './pages/user/CheckOutPage';
import { MyOrdersPage } from './pages/user/MyOrdersPage';
import { TrackOrderPage } from './pages/user/TrackOrderPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import OrderPendingPage from './pages/user/OrderPendingPage';
import { ChatDriverPage } from './pages/user/ChatDriverPage';
import { LocationProvider } from './contexts/LocationContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

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
      <Route path="/phone-otp" element={<PhoneVerificationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/merchantlogin" element={<MerchantLogin />} /> */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/restaurant/:id/menu/:itemId" element={<MenuItemDetailPage />} />
      <Route path="/cart" element={<CartPage />} />

      <Route
        path="/cart/checkout"
        element={
          <ProtectedRouteWrapper>
            <CheckOutPage />
          </ProtectedRouteWrapper>
        }
      />

      {/* <Route
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
      <Route path="/cart/checkout/ordersuccess" element={<OrderSuccessPage />} />
      <Route path="/cart/pending" element={<OrderPendingPage />} />

      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/track-order/:id" element={<TrackOrderPage />} />
      <Route path="/chat-driver/:id" element={<ChatDriverPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ----- AppInner: chỉ mount CartProvider sau AuthProvider -----
function AppInner() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/register', '/merchantlogin', '/phone-otp'].includes(
    location.pathname,
  );

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: { pointerEvents: 'none' },
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }}
      />

      <CartProvider>
        {hideHeaderFooter ? (
          <AppRoutes />
        ) : (
          <Layout>
            <AppRoutes />
          </Layout>
        )}
      </CartProvider>
    </>
  );
}

// ----- App chính -----
function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppInner />
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
