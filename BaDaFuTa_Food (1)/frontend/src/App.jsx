import { useState } from 'react'
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import { RestaurantPage } from './pages/RestaurantPage'
import HomePage from "./pages/HomePage";
import { MerchantLoginPage } from "./pages/MerchantLoginPage";
import Header from "./components/Header"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterPage /> 
      {/* <LoginPage />    */}
      {/* <RestaurantPage/>  */}
      {/* <MerchantLoginPage/> */} 
      {/* {/* <HomePage/> */}
      {/* <Header/> */}
    </>
  );
}

export default App


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import RegisterPage from "./pages/RegisterPage"
// import LoginPage from "./pages/LoginPage"
// import { LocationProvider } from "./contexts/LocationContext";
// import { RestaurantPage } from './pages/RestaurantPage'

// function App() {
//   return (
//     <LocationProvider>
//       <Routes>
//         {/* <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="" element={<HomePage />} /> */}
//         {/* Trang chi tiết nhà hàng */}
//         <Route path="/restaurant/:id" element={<RestaurantPage />} />
//       </Routes>
//     </LocationProvider>
//   );
// }

// export default App;


// import { Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import { LocationProvider } from "./contexts/LocationContext";
// import { RestaurantPage } from "./pages/RestaurantPage";

// function App() {
//   return (
//     // <LocationProvider>
//     //   <Routes>
//     //     <Route path="/" element={<HomePage />} />
        
//     //   </Routes>
//     // </LocationProvider>
//     <RestaurantPage />
//   );
// }

// export default App;
