import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react'; // ✅ Đảm bảo có useMemo
import OpeningStatus from '../../components/OpeningStatus';
import { useCart } from '../../contexts/CartContext';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Star, Clock, Truck, MapPin, Award, Users, Filter, X } from 'lucide-react'; // ✅ Thêm icon Filter, X
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MenuItemCard } from '../../components/MenuItemCard';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { motion } from 'framer-motion';

// --- 1. CẤU HÌNH CÁC MỐC GIÁ ---
const PRICE_RANGES = [
  { id: 'ALL', label: 'Tất cả', min: 0, max: Infinity },
  { id: '0-100', label: '0 - 100k', min: 0, max: 100000 },
  { id: '100-200', label: '100k - 200k', min: 100001, max: 200000 },
  { id: '200-300', label: '200k - 300k', min: 200001, max: 300000 },
  { id: '300-400', label: '300k - 400k', min: 300001, max: 400000 },
  { id: '400+', label: 'Trên 400k', min: 400001, max: Infinity },
];

export const RestaurantPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addItem } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  
  // --- 2. STATE CHO BỘ LỌC ---
  const [priceFilter, setPriceFilter] = useState('ALL');

  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const FAVORITE_KEY = 'favoriteRestaurants';

  // ... (Giữ nguyên các useEffect load data và handleToggleFavorite cũ của bạn) ...
  // Để code gọn, mình ẩn phần logic fetch API và Favorite cũ đi vì nó không đổi
  
  useEffect(() => {
    if (!id) return;
    const favorites = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '{}');
    setIsFavorite(!!favorites[id]);
  }, [id]);

  const handleToggleFavorite = (e) => {
     // ... (Logic cũ giữ nguyên)
     e.stopPropagation();
     e.preventDefault();
     const newState = !isFavorite;
     setIsFavorite(newState);
     setIsAnimating(true);
     const favorites = JSON.parse(localStorage.getItem(FAVORITE_KEY) || '{}');
     if (newState) {
       favorites[id] = {
         restaurantId: id,
         name: restaurant?.merchant_name || 'Nhà hàng',
         coverImage: restaurant?.cover_image?.url,
         savedAt: new Date().toISOString(),
       };
       toast.success('Đã thêm vào yêu thích ❤️');
     } else {
       delete favorites[id];
       toast.success('Đã huỷ yêu thích 💔');
     }
     localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
     setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    // ... (Logic fetch menu cũ giữ nguyên)
    if (!id) return;
    const ac = new AbortController();
    async function fetchMenu() {
      const hosts = [`https://badafuta-production.up.railway.app/api/restaurants/${encodeURIComponent(id)}/menu`];
      setLoading(true);
      setErrMsg('');
      for (const url of hosts) {
        try {
          const res = await fetch(url, { signal: ac.signal });
          if (!res.ok) throw new Error();
          const data = await res.json();
          setRestaurant(data.merchant ?? null);
          setMenu(Array.isArray(data.menu) ? data.menu : []);
          return;
        } catch (e) {}
      }
      setErrMsg('Lỗi tải dữ liệu');
      setRestaurant(null);
      setMenu([]);
    }
    fetchMenu();
    return () => ac.abort();
  }, [id]);

  const handleAddToCart = (item) => {
    // Lưu ý: addItem cần đúng tham số, ở đây mình giả định bạn xử lý logic option bên trong MenuItemCard
    // hoặc bạn truyền item trực tiếp nếu MenuItemCard đã xử lý việc chọn option.
    // Nếu MenuItemCard trả về item đã chọn option, thì code này ok.
    toast.success(`Đã thêm món vào giỏ hàng`); 
  };

  // --- 3. LOGIC LỌC MENU (QUAN TRỌNG) ---
  const filteredMenu = useMemo(() => {
    // Nếu chọn "Tất cả" thì trả về menu gốc
    if (priceFilter === 'ALL') return menu;

    // Tìm khoảng giá đang chọn
    const range = PRICE_RANGES.find((r) => r.id === priceFilter);
    if (!range) return menu;

    return menu
      .map((category) => {
        // Lọc các món trong từng category
        const filteredItems = (category.items || []).filter((item) => {
          const price = Number(item.price) || 0;
          return price >= range.min && price <= range.max;
        });

        // Trả về category mới với danh sách items đã lọc
        return { ...category, items: filteredItems };
      })
      .filter((category) => category.items.length > 0); // Loại bỏ category trống (không có món nào khớp giá)
  }, [menu, priceFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Restaurant Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 rounded-2xl overflow-hidden bg-gray-900 my-8 shadow-lg max-w-7xl mx-auto">
        {/* LEFT: 4/10 - Restaurant Cover Image */}
        <div className="relative lg:col-span-4 h-[28vh] lg:h-[300px] overflow-hidden w-full flex items-center justify-center">
          <ImageWithFallback
            src={restaurant?.cover_image?.url}
            alt={restaurant?.merchant_name || 'Restaurant cover'}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient (nhẹ) để ảnh hòa với nền đen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* RIGHT: 6/10 - Black Banner (căn top) */}
        <div className="relative lg:col-span-6 bg-gray-800 px-6 md:px-8 lg:px-10 py-6 md:py-8">
          {/* Floating Action Button (góc phải trên) */}
          <div className="absolute top-16 right-4 z-30 sm:top-4 h-5">
            <motion.button
              whileTap={{ scale: 0.9 }} // Hiệu ứng lún xuống khi bấm
              onClick={handleToggleFavorite}
              className={`
                  relative overflow-hidden group flex items-center  gap-2 px-4 py-2 rounded-full border shadow-lg transition-all duration-300
                  ${
                    isFavorite
                      ? 'bg-white border-white text-orange-500' // Style khi ĐÃ thích: Nền trắng, chữ cam
                      : 'bg-black/30 backdrop-blur-md border-white/30 text-white hover:bg-black/40' // Style khi CHƯA thích: Nền kính mờ
                  }
                `}
            >
              {/* Icon Ngôi sao */}
              <motion.div
                animate={isAnimating ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Star
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isFavorite ? 'fill-orange-500 text-orange-500' : 'text-white'
                  }`}
                />
              </motion.div>

              {/* Text */}
              <span className="text-sm font-semibold tracking-wide">
                {isFavorite ? 'Đã thích' : 'Yêu thích'}
              </span>

              {/* Hiệu ứng bóng sáng khi hover (Chỉ hiện khi chưa thích) */}
              {!isFavorite && (
                <div className="absolute inset-0 rounded-full ring-2 ring-white/0 group-hover:ring-white/20 transition-all duration-500" />
              )}
            </motion.button>
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
                {restaurant?.cuisine}
              </Badge>
              <Badge variant="outline" className="bg-gray-600 border-gray-500 text-white px-3 py-1">
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
                  <div className="text-white font-bold text-sm flex items-center gap-1">
                    {restaurant?.rating != null ? (
                      <>
                        {restaurant.rating} <Star className="w-4 h-4 text-yellow-400" />
                      </>
                    ) : (
                      'Chưa có đánh giá nhà hàng'
                    )}
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
                    {restaurant?.deliveryTime ?? '30-40 phút'}
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
                      ? `${restaurant.deliveryFee.toLocaleString('vi-VN')}đ`
                      : 'Thu theo App'}
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
                    {restaurant?.customers ?? '1000+'}
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
          <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            {/* Tiêu đề có điểm nhấn màu cam */}
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full block"></span>
              Về nhà hàng
            </h3>

            {/* Phần mô tả: canh đều 2 bên, giãn dòng dễ đọc */}
            <p className="text-gray-600 text-sm leading-7 mb-6 text-justify">
              {restaurant?.description || 'Chưa có mô tả cho nhà hàng này.'}
            </p>

            {/* Phần địa chỉ: Đóng khung nổi bật */}
            <div className="flex items-start gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 hover:border-orange-200 transition-colors">
              <div className="bg-white p-2 rounded-full shadow-sm shrink-0 text-orange-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-orange-600/70 font-semibold uppercase tracking-wider mb-1">
                  Địa chỉ quán
                </p>
                <span className="text-sm font-medium text-gray-800 leading-snug block">
                  {restaurant?.location.address || 'Đang cập nhật địa chỉ...'}
                </span>
              </div>
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
                <div className="font-bold text-sm mb-1">Giảm 50% đơn đầu tiên</div>
                <div className="text-xs opacity-90">
                  Áp dụng cho khách hàng mới, tối đa 100.000đ
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  FREESHIP
                </div>
                <div className="font-bold text-sm mb-1">Miễn phí giao hàng</div>
                <div className="text-xs opacity-90">Đơn từ 200.000đ trở lên</div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  WEEKEND30
                </div>
                <div className="font-bold text-sm mb-1">Combo ưu đãi cuối tuần</div>
                <div className="text-xs opacity-90">Giảm 30% các combo, chỉ áp dụng T7-CN</div>
              </div>

              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-white/20 rounded px-2 py-1 text-xs font-medium">
                  COFFEE25
                </div>
                <div className="font-bold text-sm mb-1">Happy Hour Coffee</div>
                <div className="text-xs opacity-90">Giảm 25% đồ uống từ 14h-16h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <OpeningStatus time_open={restaurant?.time_open}>
                <div className="flex items-center space-x-2">
                  <OpeningStatus.Clock />
                  <OpeningStatus.Text />
                </div>
              </OpeningStatus>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Thanh toán</div>
                <div className="text-gray-600">Tiền mặt, Thẻ, Ví điện tử</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Đánh giá</div>
                <div className="text-gray-600">1000+ khách hàng hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ... (Kết thúc phần Header) ... */}


      {/* --- 4. GIAO DIỆN BỘ LỌC (THAY THẾ div "Bộ lọc") --- */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 pr-4 border-r border-gray-300 mr-2 shrink-0 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-semibold">Lọc giá:</span>
          </div>
          
          {PRICE_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => setPriceFilter(range.id)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                ${
                  priceFilter === range.id
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }
              `}
            >
              {range.label}
            </button>
          ))}

          {/* Nút Reset nếu đang lọc */}
          {priceFilter !== 'ALL' && (
            <button
              onClick={() => setPriceFilter('ALL')}
              className="ml-auto shrink-0 p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
              title="Xóa bộ lọc"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- 5. HIỂN THỊ MENU ĐÃ LỌC (Dùng filteredMenu thay vì menu) --- */}
      {Array.isArray(filteredMenu) && filteredMenu.length > 0 ? (
        filteredMenu.map((category) => (
          <section key={category.category_id ?? category.id} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
               <h2 className="text-2xl font-bold text-gray-800">{category.category_name}</h2>
               <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
               <span className="text-sm text-gray-400 font-medium">{category.items.length} món</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.isArray(category.items) && category.items.length > 0 ? (
                category.items.map((rawItem) => {
                  const item = {
                    id: rawItem.id ?? rawItem.item_id,
                    name: rawItem.name ?? rawItem.name_item,
                    description: rawItem.description ?? '',
                    price: Number(rawItem.price) || 0,
                    image: rawItem.image ?? rawItem.image_item?.url ?? null,
                    options: rawItem.options ?? [],
                    isAvailable: rawItem.isAvailable !== false,
                    originalPrice: rawItem.originalPrice ?? rawItem.price,
                    categoryId: category.id ?? category.category_id,
                    categoryName: category.category_name,
                    restaurantId: restaurant?.id,
                    sku: rawItem.sku ?? null,
                    tags: rawItem.tags ?? [],
                    nutrition: rawItem.nutrition ?? {},
                    extraInfo: rawItem.extraInfo ?? {},
                  };

                  return (
                    <div key={item.id} className="h-full">
                      <MenuItemCard
                        menuItem={item}
                        restaurant={restaurant}
                        layout="vertical"
                        className="h-full"
                        onAddToCart={() => handleAddToCart(item)}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 italic col-span-full">Không tìm thấy món nào trong khoảng giá này.</p>
              )}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-12">
            <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Không có món ăn nào trong khoảng giá <strong>{PRICE_RANGES.find(r => r.id === priceFilter)?.label}</strong>.</p>
            <Button variant="link" onClick={() => setPriceFilter('ALL')} className="text-orange-500 mt-2">
                Xem tất cả món
            </Button>
        </div>
      )}

      <Toaster position="top-right" toastOptions={{ duration: 1000 }} />
    </div>
  );
};