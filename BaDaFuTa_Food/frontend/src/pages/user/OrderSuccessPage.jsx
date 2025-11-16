// import { CheckCircle } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useCart } from "../../contexts/CartContext";

// export default function OrderSuccessPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { clearCart } = useCart();

//   const [validated, setValidated] = useState(false);
//   const [order, setOrder] = useState(null);

//   // Lấy orderId từ query param
//   const params = new URLSearchParams(location.search);
//   const orderId = params.get("orderId");

//   useEffect(() => {
//     // ❌ Không có orderId → đuổi về cart
//     if (!orderId) {
//       navigate("/cart", { replace: true });
//       return;
//     }

//     // ❌ Chưa có dấu hiệu đã xác nhận từ callback → đuổi về cart
//     const confirmed = localStorage.getItem("orderConfirmed");
//     if (!confirmed) {
//       navigate("/cart", { replace: true });
//       return;
//     }

//     // 🟢 Bắt đầu load order
//     async function loadOrder() {
//       try {
//         const res = await fetch(`http://localhost:3000/api/order/${orderId}`);
//         const data = await res.json();

//         setOrder(data); // Lưu order vào state
//         clearCart(); // Xóa cart
//         setValidated(true); // Cho phép render UI

//         // Sau 5 giây → auto chuyển sang trang theo dõi đơn
//         setTimeout(() => {
//           navigate(`/track-order/${orderId}`, { state: { order: data } });
//         }, 5000);

//         // Xoá dấu ấn xác nhận
//         setTimeout(() => {
//           localStorage.removeItem("orderConfirmed");
//         }, 5000);
//       } catch (err) {
//         console.error("Load order error:", err);
//         navigate("/cart/checkout/orderfailed");
//       }
//     }

//     loadOrder();
//   }, [orderId, navigate, clearCart]);

//   // Chưa load xong → ẩn UI
//   if (!validated) return null;

//   const handleReturn = () => navigate("/");

//   const handleCancelOrder = () => {
//     if (window.confirm("❗ Bạn có chắc muốn huỷ đơn hàng này không?")) {
//       alert("🚫 Đã huỷ đơn!");
//       navigate("/");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-[500px] text-center">
//       <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />

//       <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
//       <p className="text-gray-500 mb-6">Đơn hàng đang được xử lý.</p>

//       <p className="text-sm text-gray-600 mb-4">
//         Mã đơn hàng: <strong>{order?.order_id}</strong>
//       </p>

//       <div className="flex flex-col gap-3">
//         <Button
//           className="bg-orange-600 hover:bg-orange-700 text-white"
//           onClick={handleReturn}
//         >
//           Quay lại trang chủ
//         </Button>

//         <Button
//           variant="destructive"
//           className="bg-red-600 hover:bg-red-700 text-white"
//           onClick={handleCancelOrder}
//         >
//           Huỷ đơn
//         </Button>
//       </div>
//     </div>
//   );
// }

// import { CheckCircle } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useCart } from "../../contexts/CartContext";

// export default function OrderSuccessPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { clearCart } = useCart();

//   const [validated, setValidated] = useState(false);
//   const [order, setOrder] = useState(null);

//   // Case 1: COD → FE gửi nguyên object về state
//   const orderFromState = location.state?.order;

//   // Case 2: MoMo / VNPay → Backend redirect kèm ?orderId
//   const params = new URLSearchParams(location.search);
//   const orderIdFromQuery = params.get("orderId");

//   useEffect(() => {
//     // Nếu có order từ state → COD flow
//     if (orderFromState) {
//       setOrder(orderFromState);
//       clearCart();
//       setValidated(true);

//       setTimeout(() => {
//         navigate(`/track-order/${orderFromState.order_id}`, {
//           state: { order: orderFromState },
//         });
//       }, 5000);
//       return;
//     }

//     // Nếu không có order nhưng có orderId → MoMo/VNPay flow
//     if (orderIdFromQuery) {
//       async function loadOrder() {
//         try {
//           const res = await fetch(
//             `http://localhost:3000/api/order/${orderIdFromQuery}`
//           );
//           const full = await res.json();

//           setOrder(full);
//           clearCart();
//           setValidated(true);

//           setTimeout(() => {
//             navigate(`/track-order/${orderIdFromQuery}`, {
//               state: { order: full },
//             });
//           }, 5000);
//         } catch (err) {
//           console.error("❌ Load order error:", err);
//           navigate("/cart");
//         }
//       }

//       loadOrder();
//       return;
//     }

//     // ❌ Không có cả 2 → người dùng mở tab /ordersuccess → Redirect về cart
//     navigate("/cart", { replace: true });
//   }, [orderFromState, orderIdFromQuery, navigate, clearCart]);

//   if (!validated) return null;

//   const handleReturn = () => navigate("/");
//   const handleCancelOrder = () => {
//     if (window.confirm("❗Bạn chắc muốn huỷ đơn?")) {
//       alert("Đã huỷ đơn!");
//       navigate("/");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-[500px] text-center">
//       <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />

//       <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
//       <p className="text-gray-500 mb-6">Đơn hàng đang được xử lý.</p>

//       <p className="text-sm text-gray-600 mb-4">
//         Mã đơn hàng: <strong>{order?.order_id}</strong>
//       </p>

//       <div className="flex flex-col gap-3">
//         <Button
//           className="bg-orange-600 hover:bg-orange-700 text-white"
//           onClick={handleReturn}
//         >
//           Quay lại trang chủ
//         </Button>

//         <Button
//           variant="destructive"
//           className="bg-red-600 hover:bg-red-700 text-white"
//           onClick={handleCancelOrder}
//         >
//           Huỷ đơn
//         </Button>
//       </div>
//     </div>
//   );
// }

import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const [validated, setValidated] = useState(false);
  const [order, setOrder] = useState(null);

  // Case 1: COD → FE gửi nguyên object qua state
  const orderFromState = location.state?.order;

  // Case 2: MoMo / VNPay redirect → backend gửi data=<base64>
  const params = new URLSearchParams(location.search);
  const encodedData = params.get("data");
  const status = params.get("status");

  useEffect(() => {
    // ============================
    // CASE 1: COD
    // ============================
    if (orderFromState) {
      setOrder(orderFromState);
      clearCart();
      setValidated(true);

      setTimeout(() => {
        navigate(`/track-order/${orderFromState.order_id}`, {
          state: { order: orderFromState },
        });
      }, 5000);

      return;
    }

    // ============================
    // CASE 2: MoMo / VNPay → nhận data base64
    // ============================
    if (status === "success" && encodedData) {
      try {
        const decoded = JSON.parse(atob(encodedData));
        console.log("📦 Order from callback:", decoded);

        setOrder(decoded);
        clearCart();
        setValidated(true);

        // Auto chuyển qua trang theo dõi đơn
        setTimeout(() => {
          navigate(`/track-order/${decoded.order_id}`, {
            state: { order: decoded },
          });
        }, 5000);
      } catch (err) {
        console.error("❌ Decode callback error:", err);
        navigate("/cart/checkout/orderfailed");
      }

      return;
    }

    // ============================
    // ❌ Không có thông tin gì → cấm vào
    // ============================
    navigate("/cart", { replace: true });
  }, [orderFromState, encodedData, status, navigate, clearCart]);

  if (!validated) return null;

  const handleReturn = () => navigate("/");
  const handleCancelOrder = () => {
    if (window.confirm("❗Bạn chắc muốn huỷ đơn?")) {
      alert("Đã huỷ đơn!");
      navigate("/");
    }
  };

  // return (
  //   <div className="flex flex-col items-center justify-center h-[500px] text-center">
  //     <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />

  //     <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
  //     <p className="text-gray-500 mb-6">Đơn hàng đang được xử lý.</p>

  //     <p className="text-sm text-gray-600 mb-4">
  //       Mã đơn hàng: <strong>{order?.order_id}</strong>
  //     </p>

  //     <div className="flex flex-col gap-3">
  //       <Button
  //         className="bg-orange-600 hover:bg-orange-700 text-white"
  //         onClick={handleReturn}
  //       >
  //         Quay lại trang chủ
  //       </Button>

  //       <Button
  //         variant="destructive"
  //         className="bg-red-600 hover:bg-red-700 text-white"
  //         onClick={handleCancelOrder}
  //       >
  //         Huỷ đơn
  //       </Button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />

      <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-500 mb-6">Đơn hàng đang được xử lý.</p>

      <p className="text-sm text-gray-600 mb-4">
        Mã đơn hàng: <strong>{order?.order_id}</strong>
      </p>

      <div className="flex flex-col gap-3">
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={handleReturn}
        >
          Quay lại trang chủ
        </Button>

        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleCancelOrder}
        >
          Huỷ đơn
        </Button>
      </div>
    </div>
  );
}
