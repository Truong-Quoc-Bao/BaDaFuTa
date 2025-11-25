// import { CheckCircle } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useCart } from '../../contexts/CartContext'; // 👈 thêm dòng này

// export default function OrderSuccessPage() {
//   const navigate = useNavigate();
//   const { state } = useCart(); // 👈 lấy giỏ hàng từ context
//   const location = useLocation();
//   const [validated, setValidated] = useState(false); // ✅ trạng thái kiểm tra xong chưa
//   const { order } = location.state || {}; // nhận toàn bộ order object

//   // Lấy orderId từ query param
//   const params = new URLSearchParams(location.search);
//   const { orderId } = location.state || {};

//   console.log('Order ID:', orderId); // ✅ kiểm tra xem có lấy được không
//   console.log('Order status:', order.status);
//   // 🔒 Chặn người dùng vào thẳng link khi chưa đặt hàng
//   useEffect(() => {
//     const orderConfirmed = localStorage.getItem('orderConfirmed');
//     if (!orderConfirmed) {
//       navigate('/cart', { replace: true });
//       return;
//     }

//     setValidated(true);

//     const clearTimer = setTimeout(() => {
//       localStorage.removeItem('orderConfirmed');
//     }, 5000);

//     // ✅ Tự động chuyển sang /my-orders sau 5s
//     // const redirectTimer = setTimeout(() => {
//     //   navigate(`/track-order/${order.order_id}`, { state: { order, from: 'OrderSuccess' } });
//     // }, 5000);

//     const redirectTimer = setTimeout(() => {
//       if (order?.status === 'DELIVERING') {
//         navigate(`/track-order/${order.order_id}`, { state: { order, from: 'OrderSuccess' } });
//       } else {
//         alert('Đơn hàng chưa được xác nhận, không thể xem chi tiết vận chuyển.');
//         navigate('/my-orders', { state: { activeTab: 'PENDING' } });
//       }
//     }, 5000);

//     return () => {
//       clearTimeout(clearTimer);
//       clearTimeout(redirectTimer);
//     };
//   }, [navigate, orderId]);

//   // ⚠️ Nếu chưa xác thực, tạm không render gì (tránh nháy trắng)
//   if (!validated) return null;

//   const handleReturn = () => navigate('/');

//   const handleCancelOrder = () => {
//     const confirmCancel = window.confirm('❗ Bạn có chắc muốn huỷ đơn hàng này không?');
//     if (confirmCancel) {
//       alert('🚫 Đơn hàng đã được huỷ thành công!');
//       navigate('/'); // Quay về trang chủ sau khi huỷ
//     }
//   };
//   console.log('Order object:', order);
//   console.log('Order ID:', order?.order_id);

//   return (
//     <div className="flex flex-col items-center justify-center h-[500px]  text-center">
//       <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
//       {order?.status === 'CONFIRMED' || order?.status === 'DELIVERING' ? (
//         <p className="mb-6 text-green-600 font-medium">
//           Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao hàng sớm nhất có thể!
//         </p>
//       ) : (
//         <p className="mb-6 text-orange-500 font-medium">
//           Đơn hàng của bạn đang chờ nhà hàng xác nhận. Vui lòng đợi trong giây lát!
//         </p>
//       )}

//       {/* <p>
//         Mã đơn hàng của bạn: <strong>{order.orderId}</strong>
//       </p> */}
//       {/*
//       <div className="flex space-x-10 flex-col gap-3">
//         <span>
//           <Button
//             variant="default"
//             className="w-max bg-orange-600 hover:bg-orange-700 text-white"
//             onClick={handleReturn}
//           >
//             Quay lại trang chủ
//           </Button>
//           {'        '}
//           {'      '}
//           {'     '}
//           <Button
//             variant="destructive"
//             className="w-max bg-red-600 hover:bg-red-700 text-white"
//             onClick={handleCancelOrder}
//           >
//             Huỷ đơn
//           </Button>
//         </span>
//       </div> */}
//     </div>
//   );
// }

import { CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '../../contexts/CartContext';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const location = useLocation();
  const [validated, setValidated] = useState(false);
  const { order } = location.state || {};

  // Query params
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const encodedData = params.get('data');

  // ⚡ Khai báo ref để chặn MOMO callback chạy lại
  const momoHandled = useRef(false);

  // ------------------- ⭐ XỬ LÝ CALLBACK MOMO TRƯỚC -------------------
  useEffect(() => {
    if (status === 'success' && encodedData && !momoHandled.current) {
      momoHandled.current = true;
      try {
        const decodedJson = atob(decodeURIComponent(encodedData));
        const decodedData = JSON.parse(decodedJson);

        setValidated(true);
        clearCart();

        setTimeout(() => {
          if (decodedData?.order_status === 'DELIVERING'){
            navigate(`/track-order/${decodedData.order_id}`, {
              state: { order: decodedData, from: 'OrderSuccess' },
            });
          } else {
            alert('Đơn hàng chưa được xác nhận, không thể xem chi tiết vận chuyển.');
            navigate('/my-orders', { state: { activeTab: 'PENDING' } });
          }
        }, 5000);
      } catch (err) {
        console.error('❌ Decode callback error:', err);
        navigate('/cart/checkout/orderfailed');
      }
      return; // ⛔ Quan trọng: không chạy tiếp logic orderConfirmed nữa
    }
  }, [status, encodedData, navigate, clearCart]);
  // --------------------------------------------------------------------

  // ------------------- ⭐ LOGIC ĐẶT HÀNG BÌNH THƯỜNG -------------------
  useEffect(() => {
    if (status === 'success' && encodedData) return; // tránh chạy trùng logic

    const orderConfirmed = localStorage.getItem('orderConfirmed');
    if (!orderConfirmed) {
      navigate('/cart', { replace: true });
      return;
    }

    setValidated(true);

    const clearTimer = setTimeout(() => {
      localStorage.removeItem('orderConfirmed');
    }, 5000);

    const redirectTimer = setTimeout(() => {
      if (order?.status === 'DELIVERING') {
        navigate(`/track-order/${order.order_id}`, {
          state: { order, from: 'OrderSuccess' },
        });
      } else {
        alert('Đơn hàng chưa được xác nhận, không thể xem chi tiết vận chuyển.');
        navigate('/my-orders', { state: { activeTab: 'PENDING' } });
      }
    }, 5000);

    return () => {
      clearTimeout(clearTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, order]);
  // --------------------------------------------------------------------

  if (!validated) return null;

  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>

      {order?.status === 'CONFIRMED' || order?.status === 'DELIVERING' ? (
        <p className="mb-6 text-green-600 font-medium">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao hàng sớm nhất có thể!
        </p>
      ) : (
        <p className="mb-6 text-orange-500 font-medium">
          Đơn hàng của bạn đang chờ nhà hàng xác nhận. Vui lòng đợi trong giây lát!
        </p>
      )}
    </div>
  );
}
