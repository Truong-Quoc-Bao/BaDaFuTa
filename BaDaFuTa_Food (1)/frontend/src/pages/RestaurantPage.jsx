import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Truck,
  MapPin,
  Award,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { MenuItemCard } from "../components/MenuItemCard";
import {
  getRestaurantById,
  getMenuItemsByRestaurant,
} from "../../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useMemo } from "react";
//import bannerImage from "figma:asset/94fc7368247a1361a8b25c0131cec9c2b57a8a5b.png";

export const RestaurantPage = () => {
  // const { id } = useParams();
  // const navigate = useNavigate();

  // const restaurant = useMemo(() => {
  //   return id ? getRestaurantById(id) : undefined;
  // }, [id]);

  // const menuItems = useMemo(() => {
  //   return id ? getMenuItemsByRestaurant(id) : [];
  // }, [id]);

  // if (!restaurant) {
  //   return (
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <div className="text-center">
  //         <p className="text-gray-500 text-lg">Không tìm thấy nhà hàng</p>
  //         <Button onClick={() => navigate("/")} className="mt-4">
  //           Về trang chủ
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // // Group menu items by category
  // const groupedMenuItems = menuItems.reduce((acc, item) => {
  //   if (!acc[item.category]) {
  //     acc[item.category] = [];
  //   }
  //   acc[item.category].push(item);
  //   return acc;
  // }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Restaurant Header - Black Banner */}
      <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
        <div className="relative px-6 py-8">
          {/* Floating Action Button */}
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/30 text-white shadow-lg"
              variant="outline"
            >
              <Star className="w-4 h-4 mr-2" />
              Yêu thích
            </Button>
          </div>

          {/* Restaurant Name & Cuisine */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {/* {restaurant.name} */}
              </h1>
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
                {/* {restaurant.cuisine} */}
              </Badge>
              <Badge
                variant="outline"
                className="bg-gray-600 border-gray-500 text-white px-3 py-1"
              >
                Cao cấp
              </Badge>
            </div>
          </div>

          {/* Stats Grid - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-500 rounded-full p-1.5">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {/* {restaurant.rating} */}
                  </div>
                  <div className="text-xs text-gray-300">Đánh giá</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 rounded-full p-1.5">
                  <Clock className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {/* {restaurant.deliveryTime} */}
                  </div>
                  <div className="text-xs text-gray-300">Giao hàng</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center space-x-2">
                <div className="bg-green-500 rounded-full p-1.5">
                  <Truck className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {/* {restaurant.deliveryFee.toLocaleString("vi-VN")}đ */}
                  </div>
                  <div className="text-xs text-gray-300">Phí ship</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-500 rounded-full p-1.5">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">1000+</div>
                  <div className="text-xs text-gray-300">Khách hàng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="p-6">
          {/* Restaurant Description */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Về nhà hàng</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {/* {restaurant.description} */}
            </p>
            <div className="flex items-center space-x-2 text-gray-500">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{/* {restaurant.location} */}</span>
            </div>
          </div>

          {/* Ưu đãi hôm nay - 4 cards nằm ngang */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="font-bold text-gray-900 mb-4">Ưu đãi hôm nay</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  WELCOME50
                </div>
                <div className="font-bold text-sm mb-1">
                  Giảm 50% đơn đầu tiên
                </div>
                <div className="text-xs opacity-90">
                  Áp dụng cho khách hàng mới, tối đa 100.000đ
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  FREESHIP
                </div>
                <div className="font-bold text-sm mb-1">Miễn phí giao hàng</div>
                <div className="text-xs opacity-90">
                  Đơn từ 200.000đ trở lên
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  WEEKEND30
                </div>
                <div className="font-bold text-sm mb-1">
                  Combo ưu đãi cuối tuần
                </div>
                <div className="text-xs opacity-90">
                  Giảm 30% các combo, chỉ áp dụng T7-CN
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  COFFEE25
                </div>
                <div className="font-bold text-sm mb-1">Happy Hour Coffee</div>
                <div className="text-xs opacity-90">
                  Giảm 25% đồ uống từ 14h-16h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Giờ mở cửa</div>
                <div className="text-gray-600">Thứ 2 - CN: 07:00 - 22:00</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Thanh toán</div>
                <div className="text-gray-600">Tiền mặt, Thẻ, Ví điện tử</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Đánh giá</div>
                <div className="text-gray-600">1000+ khách hàng hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu
      <div className="space-y-8">
        {Object.entries(groupedMenuItems).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-6">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((menuItem) => (
                <MenuItemCard
                  key={menuItem.id}
                  menuItem={menuItem}
                  restaurant={restaurant}
                  layout="vertical"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nhà hàng này chưa có menu</p>
        </div>
      )} */}
    </div>
  );
};
