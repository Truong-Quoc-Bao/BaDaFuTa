// import { Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./contexts/CartContext";
// import LoginPage from "./pages/LoginPage";
// import Header from "./components/Header";
// import HomePage from "./pages/HomePage";
// import RegisterPage from "./pages/RegisterPage";
// import { RestaurantPage } from "./pages/RestaurantPage";
// import MenuItemDetailPage from "./pages/MenuItemDetailPage";
// import CartPage from "./pages/CartPage"
// import "./App.css"; // nếu bạn có css riêng

// function App() {
//   return (
//     <CartProvider>
//       <Routes>
//         <Route path="/restaurant/:id" element={<RestaurantPage />} />
//         <Route
//           path="/restaurant/:restaurantId/item/:itemId"
//           element={<MenuItemDetailPage />}
//         /> 
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/" element={<HomePage />} />
//         {/* <Route path="/" element={<CartPage />} />  */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </CartProvider>
//   );
// }

// export default App;





import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { RestaurantPage } from "./pages/RestaurantPage";
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/restaurant/:id/" element={<RestaurantPage />} />
        <Route path="/restaurant/:id/item/:itemId" element={<MenuItemDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
