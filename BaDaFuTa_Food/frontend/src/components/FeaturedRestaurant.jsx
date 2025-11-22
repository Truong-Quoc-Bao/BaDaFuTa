import { Star, Clock, Truck, Tag } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";

export const FeaturedRestaurant = ({ restaurant, promotion }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`restaurant/${restaurant.id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {promotion && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
            <Tag className="w-3 h-3 mr-1" />
            Ưu đãi đặc biệt
          </Badge>
        )}

        <Badge className="absolute top-4 right-4 bg-white text-gray-800">
          {restaurant.cuisine}
        </Badge>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>{restaurant.deliveryFee.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">{restaurant.description}</p>

        {promotion && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="font-semibold text-orange-800 text-sm">
              {promotion.title}
            </p>
            <p className="text-orange-600 text-xs">{promotion.description}</p>
          </div>
        )}

        <Button
          onClick={handleClick}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Xem menu & đặt hàng
        </Button>
      </CardContent>
    </Card>
  );
};
