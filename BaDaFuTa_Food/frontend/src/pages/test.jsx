import { Star, Clock, Truck, Tag, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import OpeningStatus, { useOpenState } from './OpeningStatus';
import toast from 'react-hot-toast';

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

      toast.error(msg);
      return;
    }

    localStorage.setItem(
      'selectedRestaurant',
      JSON.stringify({ ...restaurant })
    );

    navigate(`/restaurant/${restaurant.id}`, {
      state: { restaurant },
    });
  };

  return (
    <Card
      className={`group relative flex flex-col h-full overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-white ${
        !isOpen ? 'opacity-80 grayscale-[0.3]' : ''
      }`}
      onClick={handleClick}
    >
      {/* === IMAGE SECTION === */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* --- BADGES TOP --- */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            {/* Rating Badge */}
            <Badge className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-2 py-1 shadow-sm border border-white/20 flex items-center gap-1 w-fit rounded-lg">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {restaurant.rating}
            </Badge>
            
            {/* Promotion Badge (Mobile optimized) */}
            {promotion && (
              <Badge className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 shadow-md border-none animate-pulse">
                <Tag className="w-3 h-3 mr-1" />
                Ưu đãi
              </Badge>
            )}
          </div>

          {/* Cuisine Badge */}
          <Badge className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 border border-white/10 rounded-full">
            {restaurant.cuisine}
          </Badge>
        </div>

        {/* --- OPENING STATUS (Bottom Right of Image) --- */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-medium text-slate-700">
            <OpeningStatus time_open={restaurant?.time_open}>
              <div className="flex items-center gap-1.5">
                {/* Giả sử component Clock và Text bên trong OpeningStatus đã được style, 
                    nếu không bạn có thể bọc thêm class ở đây */}
                <OpeningStatus.Clock className="w-3.5 h-3.5" />
                <OpeningStatus.Text />
              </div>
            </OpeningStatus>
          </div>
        </div>
      </div>

      {/* === CONTENT SECTION === */}
      <CardContent className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Title */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {restaurant.merchant_name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">
          {restaurant.description}
        </p>

        {/* Meta Info Row */}
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{restaurant.deliveryTime}p</span>
          </div>
          <div className="w-px h-4 bg-slate-300"></div> {/* Divider */}
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-orange-500" />
            <span className="font-medium">
              {restaurant.deliveryFee === 0 
                ? 'Free' 
                : `${restaurant.deliveryFee.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        </div>

        {/* Spacer để đẩy các phần dưới xuống đáy nếu card dài */}
        <div className="mt-auto">
          {/* Promotion Box */}
          {promotion ? (
            <div className="relative bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-full border border-orange-100"></div>
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full border border-orange-100"></div>
              <p className="font-bold text-orange-700 text-xs sm:text-sm line-clamp-1">
                {promotion.title}
              </p>
              <p className="text-orange-600/80 text-[10px] sm:text-xs line-clamp-1">
                {promotion.description}
              </p>
            </div>
          ) : (
            // Placeholder để giữ chiều cao card ổn định nếu không có promo (tuỳ chọn)
            <div className="h-2 mb-3"></div>
          )}

          {/* Button */}
          <Button 
            onClick={(e) => {
              e.stopPropagation(); // Ngăn click button kích hoạt card click (nếu muốn logic riêng)
              handleClick();
            }} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-orange-200 shadow-md group-hover:shadow-orange-300 transition-all"
          >
            <span>Đặt hàng ngay</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};