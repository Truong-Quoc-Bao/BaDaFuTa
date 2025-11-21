import { Star, Clock, Truck, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import OpeningStatus  from "../components/OpeningStatus";
import OpeningStatus, { useOpenState } from "../components/OpeningStatus";
import toast, { Toaster } from "react-hot-toast";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Khởi tạo toast ở root app
// toast.configure();

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { code } = useParams();
  // const handleClick = () => {
  //   navigate(`/restaurant/${restaurant.id}`);
  // };
  // ✅ Lấy trạng thái mở cửa

  const { isOpen } = useOpenState(restaurant?.time_open);

  // const handleClick = () => {
  //   if (!isOpen) {
  //     toast.error("Nhà hàng đã hết giờ mở cửa!");
  //     return; // không chuyển trang
  //   }
  //   navigate(`/restaurant/${restaurant.id}`);
  // };

  const handleClick = () => {
    if (!isOpen) {
      const hour = new Date().getHours();
      let msg = "Nhà hàng đã nghỉ 😅";

      if (hour < 11) msg = "Sáng nay nhà hàng chưa mở nè 🌞🍳";
      else if (hour < 14) msg = "Ôi không! Nhà hàng đang nghỉ trưa 🍕😴";
      else if (hour < 18) msg = "Chiều nay nhà hàng chưa mở lại 😎";
      else msg = "Tối rồi, nhà hàng đã đóng cửa 🌙🍽️";

      toast.error(msg); // ✅ toast sẽ hiển thị
      return;
    }

    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <Card
      // className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      // onClick={handleClick}
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${
        !isOpen ? "opacity-70" : ""
      }`} // mờ khi đóng cửa
      onClick={handleClick}
    >
      <div className="flex flex-col h-80">
        {/* Image - takes up 50% of the card height */}
        <div className="h-1/2 relative">
          <ImageWithFallback
            src={restaurant?.cover_image.url}
            alt={restaurant?.merchant_name}
            className="rounded-tl-xl rounded-tr-xl w-full h-full object-cover"
          />

          {/* ✅ Thêm overlay hiển thị trạng thái + thứ */}
          <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 text-sm">
            <OpeningStatus time_open={restaurant?.time_open}>
              <div className="flex items-center space-x-2">
                <OpeningStatus.Clock />
                <OpeningStatus.Text />
              </div>
            </OpeningStatus>
          </div>

          {/* Cuisine badge */}
          <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg">
            {restaurant.cuisine}
          </Badge>

          {/* Rating badge*/}
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-800">
                {restaurant.rating || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Content - takes up 50% of the card height */}
        <div className="h-1/2 p-4 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {restaurant.merchant_name}
            </h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {restaurant.description || "Không có mô tả nhà hàng!"}
            </p>
          </div>

          <div className="space-y-2">
            {/* Distance and delivery time */}
            <div className="flex  items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime} phút</span>
                
              </div>

              {restaurant.distance !== undefined && (
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.distance} km</span>
              </div>
              )}
            </div>

            {/* Delivery fee */}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-500">Phí giao hàng:</span>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-orange-600">
                  {restaurant.deliveryFee === 0
                    ? "Miễn phí"
                    : `${restaurant.deliveryFee?.toLocaleString("vi-VN")}đ`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
