import { Loader2, Clock, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrderPendingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Clock className="w-14 h-14 text-yellow-500 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Đơn hàng đang được xử lý...
        </h1>
        <p className="text-gray-600 mb-6">
          Chúng tôi đang chờ xác nhận từ VNPay. Vui lòng đừng đóng trình duyệt
          hoặc quay lại trong khi thanh toán đang được xử lý.
        </p>
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-6" />
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-4 h-4" />
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
