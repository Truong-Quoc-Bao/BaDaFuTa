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
      const hosts = [
        `https://badafuta.onrender.com/api/restaurants/${encodeURIComponent(id)}/menu`,
      ];
      // const hosts = [`https://badafuta-production.up.railway.app/api/restaurants/${encodeURIComponent(id)}/menu`];
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
                <p className="text-gray-500 italic col-span-full">
                  Không tìm thấy món nào trong khoảng giá này.
                </p>
              )}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            Không có món ăn nào trong khoảng giá{' '}
            <strong>{PRICE_RANGES.find((r) => r.id === priceFilter)?.label}</strong>.
          </p>
          <Button
            variant="link"
            onClick={() => setPriceFilter('ALL')}
            className="text-orange-500 mt-2"
          >
            Xem tất cả món
          </Button>
        </div>
      )}

      <Toaster position="top-right" toastOptions={{ duration: 1000 }} />
    </div>
  );
};



















npm install resend
git add .
git commit -m "fix: add resend package"
git push

// Cũ
setTimeout(() => navigate('/register', { state: { email } }), 500);

// Mới — nếu muốn chuyển sang login
setTimeout(() => navigate('/login', { state: { email } }), 500);

const phoneFromVerification = location.state?.phone || '';
const emailFromVerification = location.state?.email || ''; // 👈 thêm dòng này


const [formData, setFormData] = useState({
  full_name: '',
  phone: phoneFromVerification,
  email: emailFromVerification, // 👈 thay '' bằng đây
  password: '',
  confirmPassword: '',
});

<Input
  id="email"
  type="email"
  ...
  disabled={!!emailFromVerification || isLoading} // 👈 lock nếu có email từ OTP
  className={cn(
    'pl-10 pr-10',
    emailFromVerification ? 'bg-gray-100 cursor-not-allowed' : '', // 👈 style giống phone
    ...
  )}
/>

// Cũ
disabled={true}
className={cn('pl-10 pr-10 bg-gray-100 cursor-not-allowed', ...)}

// Mới
disabled={isLoading}
className={cn('pl-10 pr-10', ...)}




const handleSuccessDialogClose = () => {
  setShowSuccessDialog(false);
  navigate('/login', { state: { email: formData.email }, replace: true }); // 👈 truyền email sang login
};

useEffect(() => {
  if (location.state?.email) {
    setIdentifier(location.state.email);
  }
}, []);

const data = await res.json();
console.log('Response status:', res.status);
console.log('Response data:', data); // 👈 thêm dòng này




// Xóa đoạn này
{countdown === 0 && otpSent && (
  <button
    type="button"
    onClick={handleSendOtp}
    className="text-xs text-orange-500 hover:text-orange-600 underline w-full text-center"
    disabled={loading}
  >
    Gửi lại OTP
  </button>
)}

const startCountdown = () => setCountdown(300); // 5 phút


// Thay vì
<p>Gửi lại OTP sau {countdown}s</p>

// Thành
<p>Có thể gửi lại sau {countdown}s · OTP có hiệu lực trong 5 phút</p>



setOtpError('Server đang khởi động, vui lòng thử lại sau 30 giây!');
emailRef.current?.focus();

const handleSendOtp = async (e) => {
  e.preventDefault();
  
  // 👈 thêm check này vào đầu
  if (countdown > 0) {
    setOtpError(`Vui lòng chờ ${countdown}s trước khi gửi lại!`);
    return;
  }
  
  // ... phần còn lại giữ nguyên

  // Sau khi gửi OTP thành công
if (data.success) {
  setOtpSent(true);
  setOtpMessage(`Đã gửi mã OTP thành công đến email ${email}!`);
  startCountdown();
  sessionStorage.setItem('otpEmail', normalizedEmail); // 👈
  sessionStorage.setItem('otpSentAt', Date.now().toString()); // 👈
}

useEffect(() => {
  const otpEmail = sessionStorage.getItem('otpEmail');
  const otpSentAt = sessionStorage.getItem('otpSentAt');
  if (otpEmail && otpSentAt) {
    const elapsed = Math.floor((Date.now() - parseInt(otpSentAt)) / 1000);
    const remaining = 60 - elapsed;
    setEmail(otpEmail);
    setOtpSent(true);
    if (remaining > 0) setCountdown(remaining);
  }
}, []);


if (data.success) {
  setOtpSent(true);
  setOtpMessage(`Đã gửi mã OTP thành công đến email ${email}!`);
  startCountdown();
  sessionStorage.setItem('otpEmail', normalizedEmail); // 👈
  sessionStorage.setItem('otpSentAt', Date.now().toString()); // 👈
}

if (data.success) {
  setOtpError('');
  setOtpMessage('Xác minh thành công!');
  sessionStorage.removeItem('otpEmail'); // 👈
  sessionStorage.removeItem('otpSentAt'); // 👈
  setTimeout(() => navigate('/register', { state: { email } }), 500);
}

if (data.success) {
  setOtpSent(true);
  setOtp(''); // 👈 xóa OTP cũ
  setOtpMessage(`Đã gửi mã OTP thành công đến email ${email}!`);
  startCountdown();
  sessionStorage.setItem('otpEmail', normalizedEmail);
  sessionStorage.setItem('otpSentAt', Date.now().toString());
}

// trong onChange của ô OTP
if (newOtp.length === 6) {
  handleVerifyOtp(); // tự động verify
}

onChange={(e) => {
  const val = e.target.value.replace(/\D/g, '');
  const otpArr = otp.split('');
  otpArr[i] = val;
  const newOtp = otpArr.join('').slice(0, 6);
  setOtp(newOtp);
  setOtpError('');
  // tự động focus ô tiếp theo
  if (val && i < 5) {
    document.getElementById(`otp-${i + 1}`)?.focus();
  }
  // 👈 thêm vào đây
  if (newOtp.length === 6) {
    handleVerifyOtp();
  }
}}




if (newOtp.length === 6 && !loading) {
  setTimeout(() => handleVerifyOtp(), 300); // 👈 chờ 300ms mới verify
}

const handleVerifyOtp = async () => {
  if (!otp.trim() || otp.length < 6) {
    setOtpError('Vui lòng nhập đủ 6 số!');
    return;
  }
  if (loading) return; // 👈 đang gọi API thì không gọi nữa
  // ... phần còn lại giữ nguyên

  // Cũ
if (newOtp.length === 6) {
  handleVerifyOtp();
}

// Mới
if (newOtp.length === 6 && !loading) {
  setTimeout(() => handleVerifyOtp(), 300);
}


const handleVerifyOtp = async () => {
  if (!otp.trim() || otp.length < 6) {
    setOtpError('Vui lòng nhập đủ 6 số!');
    return;
  }
  if (loading) return; // 👈 thêm
  
  setLoading(true);
  setOtpError('');
  setOtpMessage('');
  try {
    const { data } = await tryHosts('/otp/verify', { email, otp });
    if (data.success) {


      <div className="flex justify-between items-center">
  <Label htmlFor="email">Email *</Label>
  {otpSent && (
    <button
      type="button"
      className="text-xs text-orange-500 hover:text-orange-600 underline"
      onClick={() => {
        setOtpSent(false);
        setOtp('');
        setOtpError('');
        setOtpMessage('');
        setCountdown(0);
        sessionStorage.removeItem('otpEmail');
        sessionStorage.removeItem('otpSentAt');
      }}
    >
      Đổi email
    </button>
  )}
</div>

onClick={() => {
  setOtpSent(false);
  setOtp('');
  setOtpError(''); // 👈 cái này có chưa?
  setOtpMessage('');
  setCountdown(0);
  sessionStorage.removeItem('otpEmail');
  sessionStorage.removeItem('otpSentAt');
}}

if (!otp.trim()) {
  setOtpError('Vui lòng nhập mã OTP!');
  return;
}
if (otp.length < 6) {
  setOtpError('Vui lòng nhập đủ 6 số!');
  return;
}

{otpError && !otpSent && <p className="text-xs text-red-500">{otpError}</p>}

const handleSendOtp = async (e) => {
  e.preventDefault();
  
  const normalizedEmail = email.trim(); // 👈 khai báo trước
  const savedEmail = sessionStorage.getItem('otpEmail');
  
  // chỉ chặn nếu cùng email cũ
  if (countdown > 0 && normalizedEmail === savedEmail) {
    setOtpError(`Vui lòng chờ ${countdown}s trước khi gửi lại!`);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!normalizedEmail || emailError || !emailRegex.test(normalizedEmail)) {
    setEmailError('Vui lòng nhập email hợp lệ!');
    emailRef.current?.focus();
    return;
  }

  // ... phần còn lại giữ nguyên

  if (countdown > 0 && normalizedEmail === savedEmail) {
    setOtpError(`Email này vừa được gửi OTP, vui lòng chờ ${countdown}s hoặc dùng email khác!`);
    return;
  }

  {/* Button */}
{!otpSent ? (
  <Button
    onClick={handleSendOtp}
    className="w-full bg-orange-500 hover:bg-orange-600"
    disabled={loading}
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi OTP...
      </>
    ) : (
      'Gửi OTP'
    )}
  </Button>
) : (
  ...
)}

{/* 👈 dán xuống đây, sau button */}
{countdown > 0 && !otpSent && (
  <p className="text-xs text-orange-500 text-center">
    Vui lòng chờ {countdown}s trước khi gửi OTP cho email mới
  </p>
)}
{otpError && !otpSent && (
  <p className="text-xs text-red-500 text-center">{otpError}</p>
)}

onClick={() => {
  setOtpSent(false);
  setOtp('');
  setOtpError('');
  setOtpMessage('');
  // sessionStorage.removeItem('otpEmail'); // 👈 bỏ dòng này
  sessionStorage.removeItem('otpSentAt');
}}

const normalizedEmail = email.trim();
const savedEmail = sessionStorage.getItem('otpEmail');

if (countdown > 0 && normalizedEmail === savedEmail) {
  setOtpError(
    `Email này vừa được gửi OTP, vui lòng chờ ${countdown}s trước khi gửi lại hoặc dùng email khác!`,
  );
  return;
}

setOtpError('');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!normalizedEmail || emailError || !emailRegex.test(normalizedEmail)) {
  setEmailError('Vui lòng nhập email hợp lệ!');
  emailRef.current?.focus();
  return;
}

setLoading(true);
setEmailError('');
setOtpError('');
setOtpMessage('');
try {

} catch (err) {
  console.error('Lỗi fetch:', err);
  if (countdown > 0) {
    setOtpError(`Email này vừa được gửi OTP, vui lòng chờ ${countdown}s trước khi gửi lại!`);
  } else {
    setOtpError('Không thể kết nối server!');
  }
  emailRef.current?.focus();
}

const handleSendOtp = async (e) => {
  e.preventDefault();
  
  const normalizedEmail = email.trim();
  const savedEmail = sessionStorage.getItem('otpEmail');
  const currentCountdown = countdown; // 👈 lưu lại trước khi gọi API

  if (currentCountdown > 0 && normalizedEmail === savedEmail) {
    setOtpError(`Email này vừa được gửi OTP, vui lòng chờ ${currentCountdown}s trước khi gửi lại hoặc dùng email khác!`);
    return;
  }
  // ...
  } catch (err) {
    if (currentCountdown > 0) {
      setOtpError(`Email này vừa được gửi OTP, vui lòng chờ ${currentCountdown}s trước khi gửi lại hoặc dùng email khác!`);
    } else {
      setOtpError('Không thể kết nối server!');
    }
  }



} catch (err) {
  console.error('Lỗi fetch:', err);
  if (currentCountdown === 0) {
    setOtpError('Không thể kết nối server!');
  }
  emailRef.current?.focus();
} finally {





  `Email này vừa được gửi OTP, vui lòng chờ ${currentCountdown}s trước khi gửi lại hoặc dùng email khác!`,




  if (data.error_code === 'AUTH_EMAIL_EXISTS') {
    setShowEmailExists(true); // 👈 thay vì setEmailError
    setIsLoading(false);
    return;
  }


  {showEmailExists && (
    <div className="text-center space-y-4">
      <p className="text-red-600 font-medium">
        ⚠️ Email này đã được đăng ký.
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          type="button"
          variant="default"
          onClick={() => navigate('/login', { state: { email: formData.email } })}
          className="px-4 py-2 w-[115px] h-[40px] rounded transition"
        >
          Đăng nhập
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => navigate('/phone-otp')}
          className="w-[130px] h-[40px] px-4 py-2 rounded transition"
        >
          Dùng email khác
        </Button>
      </div>
    </div>
  )}

  {!showPhoneExists && !showEmailExists && (
    <div className="space-y-4">
      ...
    </div>
  )}



  //
  // BƯỚC 1: Kiểm tra Email
const existingEmail = await userRepo.findByEmail(email);
if (existingEmail)
  throw withCode(new Error("Email đã tồn tại"), "AUTH_EMAIL_EXISTS"); 
  // 🛑 DỪNG LẠI TẠI ĐÂY! Khi lệnh throw chạy, hàm sẽ thoát ngay lập tức.

// BƯỚC 2: Kiểm tra Phone (Code không bao giờ chạy đến đây nếu Bước 1 dính lỗi)
const existingPhone = await userRepo.findByPhone(phone);
if (existingPhone)
  throw withCode(new Error("Số điện thoại đã tồn tại"), "AUTH_PHONE_EXISTS"); 
// 

  export const register = async (data: RegisterInput) => {
    const email = (data.email || "").trim().toLowerCase();
    const phone = (data.phone || "").trim();
  
    // Chạy cả 2 câu lệnh tìm kiếm cùng lúc để tiết kiệm thời gian
    const [existingEmail, existingPhone] = await Promise.all([
      userRepo.findByEmail(email),
      userRepo.findByPhone(phone)
    ]);
  
    // Kiểm tra và throw lỗi theo ưu tiên hoặc gộp lỗi
    if (existingEmail && existingPhone) {
      // Nếu bạn muốn báo cả hai, nhưng thông thường ta vẫn chọn 1 cái để báo trước
      // Hoặc tạo một error_code đặc biệt
      throw withCode(new Error("Email và Số điện thoại đều đã tồn tại"), "AUTH_BOTH_EXISTS");
    }
  
    if (existingEmail)
      throw withCode(new Error("Email đã tồn tại"), "AUTH_EMAIL_EXISTS");
  
    if (existingPhone)
      throw withCode(new Error("Số điện thoại đã tồn tại"), "AUTH_PHONE_EXISTS");
  
    // ... các bước hash pass và create
  };





  // Trong Register.jsx -> handleSubmit
if (!res.ok) {
  if (data.error_code === 'AUTH_BOTH_EXISTS') {
    setShowPhoneExists(true);
    setShowEmailExists(true); // Bật cả 2 để UI hiển thị thông báo gộp
    setIsLoading(false);
    return;
  }
  if (data.error_code === 'AUTH_PHONE_EXISTS') {
    setShowPhoneExists(true);
    setIsLoading(false);
    return;
  }
  if (data.error_code === 'AUTH_EMAIL_EXISTS') {
    setShowEmailExists(true);
    setIsLoading(false);
    return;
  }
  // ...
}

{countdown > 0 ? (
  <p className="text-xs text-gray-500 text-center mt-2">
    Bạn có thể gửi lại mã sau <span className="font-bold text-orange-500">{countdown}s</span>
  </p>
) : (
  <div className="text-center mt-2">
    <button
      type="button"
      onClick={handleSendOtp}
      disabled={loading}
      className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline disabled:opacity-50"
    >
      Tôi chưa nhận được mã? Gửi lại ngay
    </button>
  </div>
)}

{/* Button chính */}
{!otpSent ? (
  // Trường hợp 1: Chưa gửi OTP lần nào
  <Button
    onClick={handleSendOtp}
    className="w-full bg-orange-500 hover:bg-orange-600 h-11 text-base font-bold transition-all shadow-md active:scale-[0.98]"
    disabled={loading}
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi OTP...
      </>
    ) : (
      'Gửi mã xác thực'
    )}
  </Button>
) : (
  // Trường hợp 2: Đã gửi OTP -> Nút này LUÔN LUÔN là "Xác minh"
  <Button
    onClick={handleVerifyOtp}
    className="w-full bg-green-600 hover:bg-green-700 h-11 text-base font-bold transition-all shadow-md active:scale-[0.98]"
    disabled={loading || otp.length < 6}
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xác minh...
      </>
    ) : (
      'Xác minh tài khoản'
    )}
  </Button>
)}


const handleVerifyOtp = async () => {
  if (!otp.trim() || otp.length < 6) {
    setOtpError('Vui lòng nhập đủ 6 số!');
    return;
  }

  if (loading) return;
  setLoading(true);
  setOtpError('');
  setOtpMessage('');

  try {
    const { data } = await tryHosts('/otp/verify', { email, otp });

    if (data.success) {
      setOtpError('');
      setOtpMessage('Xác minh thành công!');
      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('otpSentAt');
      setTimeout(() => navigate('/register', { state: { email } }), 500);
    } else {
      // 🚩 KIỂM TRA LỖI HẾT HẠN Ở ĐÂY
      // Giả sử Backend trả về message có chữ "hết hạn" hoặc một error_code cụ thể
      if (data.message?.toLowerCase().includes('hết hạn') || data.error_code === 'OTP_EXPIRED') {
        setOtpError('⚠️ Mã OTP đã hết hạn. Vui lòng nhấn "Gửi lại" để nhận mã mới.');
      } else {
        setOtpError(data.message || 'Mã OTP không đúng, vui lòng thử lại!');
      }
    }
  } catch (err) {
    console.error('Lỗi fetch:', err);
    setOtpError('Không thể kết nối máy chủ. Vui lòng thử lại!');
  } finally {
    setLoading(false);
  }
};

{otpError && (
  <div className={cn(
    "text-xs text-center p-2 rounded-lg mt-2 animate-in fade-in slide-in-from-top-1",
    otpError.includes('hết hạn') 
      ? "bg-red-50 text-red-600 border border-red-100 font-medium" 
      : "text-red-500"
  )}>
    {otpError}
  </div>
)}

{/* ... phía trên là 6 ô input OTP ... */}
</div> 

{/* DÁN ĐOẠN NÀY VÀO ĐÂY */}
{otpError && (
  <div className={cn(
    "text-xs text-center p-2.5 rounded-xl mt-4 animate-in fade-in slide-in-from-top-1 duration-300",
    otpError.includes('hết hạn') 
      ? "bg-red-50 text-red-600 border border-red-100 font-semibold shadow-sm" 
      : "text-red-500 font-medium"
  )}>
    {otpError}
  </div>
)}

{otpMessage && !otpError && (
  <p className="text-xs text-green-500 text-center mt-4 font-medium animate-in fade-in">
    {otpMessage}
  </p>
)}

{countdown > 0 && (
{/* ... phía dưới là phần countdown và nút bấm ... */}




// Trong file EmailVerification.jsx (Frontend)
if (data.success) {
  // ... xử lý thành công
} else {
  const msg = data.message || '';
  // ✅ Cập nhật điều kiện này để bao quát cả 2 lỗi
  if (msg.includes('hết hạn') || msg.includes('chưa được gửi')) {
      setOtpError('⚠️ Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng nhấn "Gửi lại ngay" để nhận mã mới.');
  } else {
      setOtpError(msg || 'Mã OTP không đúng!');
  }
}

// 
// 
const handleSendOtp = async (e) => {
  e.preventDefault();
  const normalizedEmail = email.trim().toLowerCase();
  const savedEmail = sessionStorage.getItem('otpEmail');
  const currentCountdown = countdown;

  if (currentCountdown > 0 && normalizedEmail === savedEmail) {
    setOtpError(`Vui lòng chờ ${currentCountdown}s trước khi gửi lại!`);
    return;
  }

  setLoading(true);
  setEmailError('');
  setOtpError('');
  setOtpMessage('');

  try {
    const { data } = await tryHosts('/otp/send', { email: normalizedEmail });

    setOtpSent(true);
    setOtp('');
    setOtpMessage(`Đã gửi mã OTP thành công đến email: "${normalizedEmail}"!`);
    startCountdown();
    sessionStorage.setItem('otpEmail', normalizedEmail);
    sessionStorage.setItem('otpSentAt', Date.now().toString());
  } catch (err) {
    console.error('Lỗi gửi OTP:', err);
    // ✅ FIX: Lấy message từ AggregateError hoặc err.message
    const msg = err.errors ? err.errors[0].message : err.message;
    setOtpError(msg || 'Không thể kết nối máy chủ!');
    
    emailRef.current?.focus();
  } finally {
    setLoading(false);
  }
};


const handleVerifyOtp = async () => {
  if (otp.length < 6) {
    setOtpError('Vui lòng nhập đủ 6 số!');
    return;
  }

  if (loading) return;
  setLoading(true);
  setOtpError('');
  setOtpMessage('');

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data } = await tryHosts('/otp/verify', {
      email: normalizedEmail,
      otp,
    });

    // Nếu thành công
    setOtpError('');
    setOtpMessage('Xác minh thành công!');
    sessionStorage.removeItem('otpEmail');
    sessionStorage.removeItem('otpSentAt');
    setTimeout(() => navigate('/register', { state: { email: normalizedEmail } }), 500);

  } catch (err) {
    console.error('Lỗi Verify:', err);
    // Lấy message lỗi từ Server (thông qua AggregateError của Promise.any)
    const msg = err.errors ? err.errors[0].message : err.message;
    
    setOtpError(msg); // Gán nguyên văn lỗi để UI bên dưới xử lý

    // Nếu lỗi là hết hạn, xóa luôn OTP cũ cho người dùng nhập lại cái mới
    if (msg.includes('hết hạn') || msg.includes('chưa được gửi')) {
      setOtp(''); 
    }
  } finally {
    setLoading(false);
  }
};

{/* Phần hiển thị lỗi phân loại UI */}
{otpError && (
  <div className="mt-4">
    {/* Trường hợp 1: Lỗi hết hạn hoặc không tồn tại -> Hiện BOX đỏ nổi bật */}
    {(otpError.includes('hết hạn') || otpError.includes('chưa được gửi')) ? (
      <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 shadow-sm">
        <span className="text-[13px] font-semibold text-center leading-tight">
          ⚠️ {otpError}
        </span>
      </div>
    ) : (
      /* Trường hợp 2: Lỗi nhập sai mã -> Chỉ hiện dòng chữ đỏ đơn giản */
      <p className="text-xs text-red-500 text-center font-bold animate-in fade-in zoom-in duration-300">
        ❌ {otpError}
      </p>
    )}
  </div>
)}


const handleVerifyOtp = async () => {
  if (otp.length < 6) {
    setOtpError('Vui lòng nhập đủ 6 số!');
    return;
  }

  if (loading) return;
  setLoading(true);
  setOtpError('');
  setOtpMessage('');

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data } = await tryHosts('/otp/verify', {
      email: normalizedEmail,
      otp: parseInt(otp), // Đảm bảo gửi số
    });

    // Nếu thành công (data.success là true)
    setOtpError('');
    setOtpMessage('Xác minh thành công!');
    sessionStorage.removeItem('otpEmail');
    sessionStorage.removeItem('otpSentAt');
    setTimeout(() => navigate('/register', { state: { email: normalizedEmail } }), 500);

  } catch (err) {
    console.error('Lỗi Verify:', err);
    // Lấy tin nhắn từ host trả về lỗi
    const msg = err.errors ? err.errors[0].message : err.message;

    // ✅ ƯU TIÊN 1: Kiểm tra lỗi "Không chính xác" trước
    if (msg.includes('không chính xác') || msg.includes('không đúng')) {
      setOtpError('❌ ' + msg); 
      // Không setOtp('') ở đây để người dùng sửa lại số sai
    } 
    // 🚩 ƯU TIÊN 2: Các lỗi hệ thống/hết hạn
    else if (msg.includes('hết hạn') || msg.includes('chưa được gửi') || msg.includes('không tồn tại')) {
      setOtpError('⚠️ ' + msg);
      setOtp(''); // Xóa mã vì mã này coi như hỏng
    } else {
      setOtpError('Có lỗi xảy ra, vui lòng thử lại!');
    }
  } finally {
    setLoading(false);
  }
};



// 
// 
// 
import * as sib from '@getbrevo/brevo';
import { otpStore } from './otp.store';

// Ép kiểu any để fix lỗi TypeScript "Property does not exist" của bạn
const apiInstance = new (sib as any).TransactionalEmailsApi();

// Thiết lập API Key
apiInstance.setApiKey((sib as any).TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);

export const otpService = {
  async sendOtp(email: string) {
    if (!email) throw new Error('Thiếu email!');
    
    // GIỮ NGUYÊN 100% LOGIC RATE LIMIT CŨ
    const normalizedEmail = email.trim().toLowerCase();
    const existing = otpStore[normalizedEmail];
    if (existing && Date.now() < existing.expiry - 4 * 60 * 1000) {
      throw new Error('Vui lòng chờ 1 phút trước khi gửi lại!');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[normalizedEmail] = {
      code: otp,
      expiry: Date.now() + 5 * 60 * 1000, // hết hạn sau 5 phút
    };

    try {
      const sendSmtpEmail = new (sib as any).SendSmtpEmail();
      
      // GIỮ NGUYÊN 100% GIAO DIỆN VÀ THÔNG TIN CŨ
      sendSmtpEmail.subject = "Mã OTP xác nhận";
      sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Xác thực tài khoản của bạn</h2>
            <p style="color: #666;">Sử dụng mã OTP dưới đây để hoàn tất quá trình đăng ký:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px dashed #ddd;">
              <p style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #ff6600; margin: 0;">${otp}</p>
            </div>
          
            <p style="font-size: 14px; color: #888;">Mã có hiệu lực trong <b style="color: #333;">5 phút</b>.</p>
          
            <!-- Khối cảnh báo bảo mật -->
            <div style="background-color: #fff4f4; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4d4d; text-align: left; margin-top: 25px;">
              <p style="margin: 0; font-size: 13px; color: #d93025; line-height: 1.5;">
                <b>⚠️ CẢNH BÁO BẢO MẬT:</b><br>
                • <b>TUYỆT ĐỐI KHÔNG</b> cung cấp mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ khách hàng.<br>
                • Mã này chỉ dành riêng cho bạn để xác thực tài khoản trên hệ thống của chúng tôi.<br>
                • Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ nếu thấy dấu hiệu bất thường.
              </p>
            </div>
          
            <p style="margin-top: 25px; font-size: 12px; color: #aaa;">Đây là email tự động, vui lòng không phản hồi email này.</p>
          </div>
        `;

      sendSmtpEmail.sender = { 
        name: process.env.BREVO_SENDER_NAME || "Badafuta Support", 
        email: process.env.BREVO_SENDER_EMAIL || "baotruong.190404@gmail.com" 
      };
      
      sendSmtpEmail.to = [{ email: normalizedEmail }];

      // Thực hiện gửi qua Brevo
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Gửi mail qua Brevo thành công tới:', email);

    } catch (error: any) {
      console.error('❌ Lỗi Brevo:', error.message);
      throw new Error('Không thể gửi email: ' + error.message);
    }
    
    // GIỮ NGUYÊN RESPONSE FORMAT CŨ
    return { success: true, message: `OTP đã gửi tới ${email}` };
  },

  // GIỮ NGUYÊN 100% LOGIC VERIFY CŨ
  async verifyOtp(email: string, otp: number) {
    if (!email || !otp) throw new Error('Thiếu thông tin!');

    const normalizedEmail = email.trim().toLowerCase();
    const record = otpStore[normalizedEmail]; 

    if (!record) {
      throw new Error('Mã OTP không tồn tại hoặc đã hết hạn!');
    }

    if (Date.now() > record.expiry) {
      delete otpStore[normalizedEmail];
      throw new Error('Mã OTP đã hết hạn!');
    }

    if (Number(otp) !== record.code) {
      return { success: false, message: 'Mã OTP không chính xác!' };
    }

    delete otpStore[normalizedEmail];
    return { success: true, message: 'Xác minh thành công!' };
  },
};