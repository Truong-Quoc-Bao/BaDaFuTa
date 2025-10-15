// import { useState } from 'react'
// import RegisterPage from "./pages/RegisterPage"
// import LoginPage from "./pages/LoginPage"
// import { RestaurantPage } from './pages/RestaurantPage'
// import HomePage from "./pages/HomePage";
// import { MerchantLoginPage } from "./pages/MerchantLoginPage";
// import Header from "./components/Header"
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       {/* <RegisterPage /> */}
//       <LoginPage />
//       {/* <RestaurantPage/>  */}
//       {/* <MerchantLoginPage/> */}
//       {/* {/* <HomePage/> */}

//       {/* <Header/> */}
//     </>
//   );
// }

// export default App

// import { Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import RegisterPage from "./pages/RegisterPage";
// import LoginPage from "./pages/LoginPage";
// import { LocationProvider } from "./contexts/LocationContext";
// import { RestaurantPage } from "./pages/RestaurantPage";

// function App() {
//   return (
//     <LocationProvider>
//       <Routes>
//         {/* <Route path="/" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/restaurant/:id" element={<RestaurantPage />} /> */}
//         <Route path="/" element={<RestaurantPage />} />
//       </Routes>
//     </LocationProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { RestaurantPage } from "./pages/RestaurantPage";
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import "./App.css"; // nếu bạn có css riêng

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* <Route path="/" element={<RestaurantPage />} />
        <Route
          path="/restaurant/:restaurantId/item/:itemId"
          element={<MenuItemDetailPage />}
        /> */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<RegisterPage />} />
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </CartProvider>
  );
}

export default App;
