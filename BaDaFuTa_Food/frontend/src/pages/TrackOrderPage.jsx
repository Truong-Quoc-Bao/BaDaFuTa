import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { MapPin, Package, Truck, Check } from "lucide-react";

const timelineSteps = [
  { id: 1, label: "Đã đặt đơn", icon: Check },
  { id: 2, label: "Tài xế nhận đơn", icon: Truck },
  { id: 3, label: "Tới quán", icon: MapPin },
  { id: 4, label: "Đã lấy đơn", icon: Package },
  { id: 5, label: "Giao thành công", icon: Check },
];

export const TrackOrderPage = () => {
  const location = useLocation();
  const params = useParams(); // để lấy :id nếu cần fetch từ API
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Đơn hàng không tồn tại</h2>
        <p className="text-gray-500">
          Không tìm thấy thông tin đơn hàng. Vui lòng quay lại trang lịch sử đơn hàng.
        </p>
      </div>
    );
  }

  const currentStep = order.currentStep || 1;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Theo dõi đơn hàng #{order.id}
      </h2>
      
      <div className="relative border-l-2 border-gray-300 ml-4">
        {timelineSteps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={step.id} className="mb-8 ml-6 relative">
              <span
                className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isActive
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              />
              <div className="flex items-center space-x-2">
                <StepIcon
                  className={`w-5 h-5 ${
                    isCompleted
                      ? "text-green-500"
                      : isActive
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-green-600"
                      : isActive
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                  {step.id === 2 && isActive && order.driver && (
                    <span className="block text-sm font-normal text-gray-400 mt-1">
                      Tài xế: {order.driver.name} - {order.driver.phone}
                    </span>
                  )}
                </span>
              </div>
              {order.timestamps?.[step.id] && (
                <span className="text-xs text-gray-400 ml-7">
                  {new Date(order.timestamps[step.id]).toLocaleTimeString("vi-VN")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
