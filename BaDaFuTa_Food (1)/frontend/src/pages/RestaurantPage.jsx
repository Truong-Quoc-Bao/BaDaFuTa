import { useNavigate, useParams, Link } from "react-router-dom"; // ✅
import { useEffect, useState } from "react";
import OpeningStatus from "../components/OpeningStatus";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner"; // ✅ nếu muốn hiện thông báo đẹp
import { useMemo } from "react";
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
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export const RestaurantPage = () => {
  const navigate = useNavigate();


  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

 
  //Lấy menu
  useEffect(() => {
    if (!id) return;

    const ac = new AbortController();
    async function fetchMenu() {
      try {
        setLoading(true);
        setErrMsg("");

        const res = await fetch(
          `http://localhost:3000/api/restaurants/${encodeURIComponent(
            id
          )}/menu`,
          { signal: ac.signal }
        );
        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || "Không tìm thấy quán");
        }
        const data = await res.json();

        setRestaurant(data.merchant ?? null);
        setMenu(Array.isArray(data.menu) ? data.menu : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("fetchMenu error:", e);
          setErrMsg("Không tải được dữ liệu nhà hàng. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
    return () => ac.abort();
  }, [id]);

  //Thêm vào giỏ hàng
  const handleAddToCart = () => {
    addItem(menuItem, restaurant, selectedToppings, specialInstructions);
    toast.success(`Đã thêm ${menuItem.name} vào giỏ hàng`);
    onClose(); // đóng dialog
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Restaurant Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 rounded-2xl overflow-hidden bg-gray-900 my-8 shadow-lg max-w-7xl mx-auto">
        {/* LEFT: 4/10 - Restaurant Cover Image */}
        <div className="relative lg:col-span-4 h-[28vh] lg:h-[300px] overflow-hidden w-full flex items-center justify-center">
          <ImageWithFallback
            src={restaurant?.cover_image?.url}
            alt={restaurant?.merchant_name || "Restaurant cover"}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient (nhẹ) để ảnh hòa với nền đen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* RIGHT: 6/10 - Black Banner (căn top) */}
        <div className="relative lg:col-span-6 bg-gray-800 px-6 md:px-8 lg:px-10 py-6 md:py-8">
          {/* Floating Action Button (góc phải trên) */}
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

          {/* Restaurant Name & Cuisine (căn top) */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {restaurant?.merchant_name}
              </h1>
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
                Việt Nam
              </Badge>
              <Badge
                variant="outline"
                className="bg-gray-600 border-gray-500 text-white px-3 py-1"
              >
                Cao cấp
              </Badge>
            </div>
          </div>

          {/* Stats Grid - giữ gọn */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500 rounded-full p-1.5">
                  <Star className="w-3 h-3 text-white fill-current" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {restaurant?.rating ?? "4.8"}
                  </div>
                  <div className="text-xs text-gray-300">Đánh giá</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 rounded-full p-1.5">
                  <Clock className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {restaurant?.delivery_time ?? "25-35 phút"}
                  </div>
                  <div className="text-xs text-gray-300">Giao hàng</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 rounded-full p-1.5">
                  <Truck className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {restaurant?.delivery_fee
                      ? `${restaurant.delivery_fee.toLocaleString("vi-VN")}đ`
                      : "Miễn phí"}
                  </div>
                  <div className="text-xs text-gray-300">Phí ship</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg px-3 py-2.5 border border-gray-600/50">
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 rounded-full p-1.5">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {restaurant?.customers ?? "1000+"}
                  </div>
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
              <span className="text-sm">{restaurant?.location.address}</span>
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
              <OpeningStatus time_open={restaurant?.time_open}>
                <div className="flex items-center space-x-2">
                  <OpeningStatus.Clock />
                  <OpeningStatus.Text />
                </div>
              </OpeningStatus>
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

      {/* Menu */}
      {Array.isArray(menu) && menu.length > 0 ? (
        menu.map((category) => (
          <section key={category.category_id ?? category.id} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {category.category_name}
            </h2>

            {/* 1 cột (mobile) → 2 (sm) → 3 (md) → 4 (lg) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(category.items) && category.items.length > 0 ? (
                category.items.map((rawItem) => {
                  const item = {
                    id: rawItem.id ?? rawItem.item_id,
                    name: rawItem.name ?? rawItem.name_item,
                    description: rawItem.description ?? "",
                    price: Number(rawItem.price) || 0,
                    image: rawItem.image ?? rawItem.image_item?.url ?? null,
                    toppings: rawItem.toppings ?? [],
                    isAvailable: rawItem.isAvailable !== false,
                    originalPrice: rawItem.originalPrice ?? rawItem.price,
                  };

                  return (
                    <div key={item.id} className="h-full">
                      <MenuItemCard
                        menuItem={item}
                        restaurant={restaurant}
                        layout="vertical"
                        className="h-full"
                        onAddToCart={() => handleAddToCart(item)} // ✅ thêm dòng này
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic">
                  Chưa có món nào trong mục này.
                </p>
              )}
            </div>
          </section>
        ))
      ) : (
        <p className="text-gray-500 italic">Chưa có dữ liệu menu.</p>
      )}
    </div>
  );
};
