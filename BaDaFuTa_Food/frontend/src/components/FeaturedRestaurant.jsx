import { Star, Clock, Truck, Tag } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import OpeningStatus, { useOpenState } from './OpeningStatus';
import toast from 'react-hot-toast'; // THÊM DÒNG NÀY LÀ XONG!

export const FeaturedRestaurant = ({ restaurant, promotion }) => {
  const navigate = useNavigate();
  const { isOpen } = useOpenState(restaurant?.time_open);
  const handleClick = () => {
    if (!isOpen) {
      const hour = new Date().getHours();
      let msg = 'Nhà hàng đã nghỉ 😅';

      if (hour < 11) msg = 'Sáng nay nhà hàng chưa mở nè 🌞🍳';
      else if (hour < 14) msg = 'Ôi không! Nhà hàng đang nghỉ trưa 🍕😴';
      else if (hour < 18) msg = 'Chiều nay nhà hàng chưa mở lại 😎';
      else msg = 'Tối rồi, nhà hàng đã đóng cửa 🌙🍽️';

      toast.error(msg); // ✅ toast sẽ hiển thị
      return;
    }

    localStorage.setItem(
      'selectedRestaurant',
      JSON.stringify({
        ...restaurant, // restaurant đã có deliveryFee thực
      }),
    );

    // ✅ truyền restaurant đầy đủ sang trang chi tiết
    navigate(`/restaurant/${restaurant.id}`, {
      state: { restaurant },
    });
  };
  console.log('Restaurant fee:', restaurant.deliveryFee);

  return (
    <Card
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${
        !isOpen ? 'opacity-70' : ''
      }`} // mờ khi đóng cửa
      onClick={handleClick}
    >
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* === BADGES – GÓC TRÊN CARD (không bị đè nhau nữa) === */}
        <div className="absolute inset-x-3 top-3 flex flex-wrap justify-between items-start gap-2 pointer-events-none z-10">
          {/* Bên TRÁI: Ưu đãi + Đánh giá */}
          <div className="flex flex-wrap gap-2">
            {/* Ưu đãi đặc biệt – chỉ hiện khi có promotion */}
            {promotion && (
              <Badge className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 shadow-lg">
                <Tag className="w-3 h-3 mr-1" />
                Ưu đãi đặc biệt
              </Badge>
            )}

            {/* Đánh giá – luôn hiện */}
            <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 shadow-md border border-white/30">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1" />
              {restaurant.rating}
            </Badge>
          </div>

          {/* Bên PHẢI: Loại ẩm thực */}
          <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 shadow-md border border-white/30 ml-auto">
            {restaurant.cuisine}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold mb-2">{restaurant.merchant_name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime} Phút</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>{restaurant.deliveryFee.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 text-sm">
              <OpeningStatus time_open={restaurant?.time_open}>
                <div className="flex items-center space-x-2">
                  <OpeningStatus.Clock />
                  <OpeningStatus.Text />
                </div>
              </OpeningStatus>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">{restaurant.description}</p>

        {promotion && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="font-semibold text-orange-800 text-sm">{promotion.title}</p>
            <p className="text-orange-600 text-xs">{promotion.description}</p>
          </div>
        )}

        <Button onClick={handleClick} className="w-full bg-orange-500 hover:bg-orange-600">
          Xem menu & đặt hàng
        </Button>
      </CardContent>
    </Card>
  );
};
