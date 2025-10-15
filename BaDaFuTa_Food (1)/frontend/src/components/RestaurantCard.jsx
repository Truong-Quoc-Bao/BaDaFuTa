import { Star, Clock, Truck, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export default function RestaurantCard ({ restaurant }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
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

          {/* Cuisine badge */}
          <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg">
            {/* {restaurant.cuisine} */}
            <p> Việt Nam</p>
          </Badge>

          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-800">
                {/* {restaurant.rating} */}
                <p>4 sao</p>
              </span>
            </div>
          </div>
        </div>

        {/* Content - takes up 50% of the card height */}
        <div className="h-1/2 p-4 flex flex-col justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {restaurant.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {/* {restaurant.description} */}
              đây là nhà hàng
            </p>
          </div>

          <div className="space-y-2">
            {/* Distance and delivery time */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>

              {restaurant.distance !== undefined && (
                <div className="flex items-center space-x-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.distance}km</span>
                </div>
              )}
            </div>

            {/* Delivery fee */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Phí giao hàng:</span>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-orange-600">
                  {restaurant.deliveryFee === 0
                    ? "Miễn phí"
                    : `${restaurant.deliveryFee.toLocaleString("vi-VN")}đ`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
