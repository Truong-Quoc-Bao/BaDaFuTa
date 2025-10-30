import { Badge } from "./ui/badge";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

export const OrderStatusBadge = ({ status, showIcon = false }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "delivered":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          text: "Đã giao hàng",
          icon: CheckCircle,
        };
      case "shipping":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Đang giao hàng",
          icon: Truck,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          text: "Đã hủy",
          icon: XCircle,
        };
      case "confirmed":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          text: "Đã xác nhận",
          icon: Package,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Chờ xử lý",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.color} ${
        showIcon ? "flex items-center space-x-1" : ""
      }`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.text}</span>
    </Badge>
  );
};
