import { useState } from 'react'
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
// import { RestaurantPage } from './pages/RestaurantPage'
// import { HomePage } from "./pages/HomePage";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterPage />  
      <LoginPage />  
      {/* <RestaurantPage/> */}
      {/* <HomePage/> */}
    </>
  );
}

export default App
