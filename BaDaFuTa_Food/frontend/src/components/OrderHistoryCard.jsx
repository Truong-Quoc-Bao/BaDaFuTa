import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Separator } from "./ui/separator";
import { Star, Calendar, Clock, Package } from "lucide-react";
import { RatingDialog } from "./RatingDialog";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export const OrderHistoryCard = ({ order, onRatingSubmit }) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      case "confirmed":
        return "Đã xác nhận";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReorder = () => {
    // Clear cart first to avoid mixing orders from different restaurants
    dispatch({ type: "CLEAR_CART" });

    // Add all items from this order to cart
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            menuItem: item.menuItem,
            restaurant: item.restaurant,
          },
        });
      }
    });

    // Navigate to cart
    navigate("/cart");
  };

  return (
    <>
      <Card className="bg-white rounded-xl p-4 shadow-sm hover:shadow-sm hover:bg-gray-50 transition-all duration-100">
        {/* <Card className="hover:shadow-xs transition-shadow"> */}
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={order.restaurantImage}
                alt={order.restaurantName}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold">{order.restaurantName}</h3>
                <p className="text-sm text-gray-500">Mã đơn: {order.id}</p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} showIcon={true} />
          </div>

          {/* Order Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {item.menuItem.name} x{item.quantity}
                </span>
                <span>
                  {(item.menuItem.price * item.quantity).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Đặt lúc: {formatDate(order.orderDate)}</span>
            </div>
            {order.deliveryDate && (
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span>Giao lúc: {formatDate(order.deliveryDate)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Tổng: {order.total.toLocaleString("vi-VN")}đ
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Existing Rating Display */}
              {order.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{order.rating}</span>
                </div>
              )}

              {/* Rating Button */}
              {order.canRate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRatingDialog(true)}
                  className="flex items-center space-x-1"
                >
                  <Star className="w-4 h-4" />
                  <span>Đánh giá</span>
                </Button>
              )}

              {/* Reorder Button */}
              {order.status === "shipping" || order.status === "confirmed" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/track-order/${order.id}`, { state: { order } })}
                  className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                >
                  Theo dõi đơn hàng
                </Button>
                
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReorder}
                  className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                >
                  Đặt lại
                </Button>
              )}
            </div>
          </div>

          {/* Review Display */}
          {order.review && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 italic">"{order.review}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        order={order}
        onSubmitRating={onRatingSubmit}
      />
    </>
  );
};
