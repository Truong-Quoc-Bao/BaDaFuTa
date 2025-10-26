import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext"; // 👈 thêm dòng này

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { state } = useCart(); // 👈 lấy giỏ hàng từ context
  const [validated, setValidated] = useState(false); // ✅ trạng thái kiểm tra xong chưa

  // 🔒 Chặn người dùng vào thẳng link khi chưa đặt hàng
  useEffect(() => {
    const orderConfirmed = localStorage.getItem("orderConfirmed");
    if (!orderConfirmed) {
      navigate("/cart", { replace: true });
      return;
    }

    setValidated(true);

    const timer = setTimeout(() => {
      localStorage.removeItem("orderConfirmed");
    }, 100000);

    return () => clearTimeout(timer);
  }, [navigate]);


  // ⚠️ Nếu chưa xác thực, tạm không render gì (tránh nháy trắng)
  if (!validated) return null;

  const handleReturn = () => navigate("/");

  const handleCancelOrder = () => {
    const confirmCancel = window.confirm(
      "❗ Bạn có chắc muốn huỷ đơn hàng này không?"
    );
    if (confirmCancel) {
      alert("🚫 Đơn hàng đã được huỷ thành công!");
      navigate("/"); // Quay về trang chủ sau khi huỷ
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[500px]  text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-4 animate-bounce" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Đặt hàng thành công!
      </h1>
      <p className="text-gray-500 mb-6">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ giao hàng sớm nhất có thể!
      </p>

      <div className="flex space-x-10 flex-col gap-3">
        <span >
          <Button
            variant="default"
            className="w-max bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleReturn}
          >
            Quay lại trang chủ
          </Button>{"        "}{"      "}{"     "}
          <Button
            variant="destructive"
            className="w-max bg-red-600 hover:bg-red-700 text-white"
            onClick={handleCancelOrder}
          >
            Huỷ đơn
          </Button>
        </span>
      </div>
    </div>
  );
}
