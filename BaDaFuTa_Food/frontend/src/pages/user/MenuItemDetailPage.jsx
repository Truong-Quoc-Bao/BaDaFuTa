// src/pages/MenuItemDetailPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, Plus, Minus, Leaf } from 'lucide-react';
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useCart } from '../../contexts/CartContext';
import { ToppingSelectionDialog } from '../../components/ToppingSelectionDialog';

import {
  getOptimizedFoodImage,
  optimizeImageUrl,
  hasDiscount,
  calculateDiscountPercentage,
} from '../../utils/imageUtils';
import { useAuth } from '../../contexts/AuthContext';
const currencyVN = (n) => (Number(n) || 0).toLocaleString('vi-VN') + 'đ';

export default function MenuItemDetailPage() {
  const { restaurantId, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const { addItem } = useCart();
  // 🧩 Lấy user từ AuthContext
  const { state: authState } = useAuth();
  const user = authState.user;
  //animaotion
  const imgRef = useRef(null); // ref cho ảnh món ăn
  const cartIconRef = useRef(null); // ref cho icon giỏ hàng (nếu có)
  const flyToCart = () => {
    if (!imgRef.current || !cartIconRef.current) return;

    const imgRect = imgRef.current.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    const flyImg = imgRef.current.cloneNode(true);
    flyImg.style.position = 'fixed';
    flyImg.style.left = imgRect.left + 'px';
    flyImg.style.top = imgRect.top + 'px';
    flyImg.style.width = imgRect.width + 'px';
    flyImg.style.height = imgRect.height + 'px';
    flyImg.style.transition = 'all 0.7s cubic-bezier(0.65, 0, 0.35, 1), transform 0.7s';
    flyImg.style.zIndex = 1000;
    flyImg.style.pointerEvents = 'none';

    document.body.appendChild(flyImg);

    requestAnimationFrame(() => {
      flyImg.style.left = cartRect.left + 'px';
      flyImg.style.top = cartRect.top + 'px';
      flyImg.style.width = '20px';
      flyImg.style.height = '20px';
      flyImg.style.opacity = '0.5';
      flyImg.style.transform = 'rotate(20deg)';
    });

    flyImg.addEventListener(
      'transitionend',
      () => {
        flyImg.remove();
      },
      { once: true },
    );
  };

  const stateItem = location.state?.menuItem || null;
  const stateRestaurant = location.state?.restaurant || null;

  const [loading, setLoading] = useState(!(stateItem && stateRestaurant));
  const [err, setErr] = useState(null);
  const [restaurant, setRestaurant] = useState(stateRestaurant || null);
  const [item, setItem] = useState(stateItem ? normalizeItem(stateItem) : null);
  const [qty, setQty] = useState(1);
  const [showToppingDialog, setShowToppingDialog] = useState(false);
  const [toppingSelected, setToppingSelected] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ac = new AbortController();

    async function fetchMissing() {
      try {
        if (!(restaurant && item)) setLoading(true);

        if (!restaurant) {
          const r = await fetch(`/api/v1/restaurants/${restaurantId}`, {
            signal: ac.signal,
          });
          if (!r.ok) throw new Error('Không tải được nhà hàng');
          setRestaurant(await r.json());
        }

        if (!item) {
          const r = await fetch(`/api/v1/menu-items/${itemId}`, {
            signal: ac.signal,
          });
          const data = await r.json();
          console.log('Fetched item:', data); // 🔍 kiểm tra key options/toppings
          if (!r.ok) throw new Error('Không tải được món');
          setItem(normalizeItem(await r.json()));
        }

        setErr(null);
      } catch (e) {
        if (e.name !== 'AbortError') setErr(e.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    }

    fetchMissing();
    return () => ac.abort();
  }, [restaurantId, itemId]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/restaurant/${restaurant?.slug || restaurantId}`);
  };

  const handleAdd = () => setQty((v) => v + 1);
  const handleSub = () => setQty((v) => Math.max(1, v - 1));
  // thêm món

  const { state: cartState, addItem, clearCart } = useCart(); // lấy state giỏ hàng
  const hasToppings = item?.options && item.options.length > 0;

  const handleAddToCart = () => {
    if (!item || !restaurant) return;

    // kiểm tra nếu giỏ đang có món từ nhà hàng khác
    if (cartState.items.length > 0 && cartState.items[0].restaurant.id !== restaurant.id) {
      if (window.confirm('Bạn đang chuyển sang nhà hàng khác, giỏ hàng cũ sẽ bị xóa. Tiếp tục?')) {
        clearCart();
      } else {
        return; // hủy thêm món
      }
    }

    //hết món
    if (!isAvailable) {
      toast.error(`${qty} phần ${item.name} đã hết hàng, thử món khác nhé!`);
      return;
    }

    // Nếu món có topping chưa chọn, mở dialog
    if (item.options?.length && !toppingSelected) {
      setShowToppingDialog(true);
      return; // dừng ở đây, không addItem ngay
    } else {
      addItem(item, restaurant, qty);

      // chỉ chạy animation khi cả 2 ref có giá trị
      if (imgRef.current && cartIconRef.current) {
        flyToCart(); // chạy animation
      }

      /// hiện toast sau animation (hoặc cùng lúc, tuỳ ý)
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } flex items-center gap-2 bg-white border border-gray-200 w-[50vw] sm:w-[380px] p-3 rounded-lg`}
        >
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-green-500 rounded-full text-white font-bold">
            ✓
          </div>
          <img
            src={item.image}
            alt={item.name}
            className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded"
          />
          <span className="text-xs sm:text-sm font-medium leading-snug break-words">
            Đã thêm <span className="font-bold text-black">{qty} </span> cái{' '}
            <span className="font-bold text-black">{item.name}</span> vào giỏ hàng!
          </span>
        </div>
      ));
    }
  };

  // const handleAddToCart = () => {
  //   if (!item || !restaurant) return;
  //   if (item.toppings?.length) {
  //     setShowToppingDialog(true);
  //   } else {
  //     addItemWithToppings(item, restaurant, [], "", qty); // truyền quantity
  //   }
  // };

  const optimizedImg = useMemo(() => {
    if (!item?.image && !item?.name) return null;
    return optimizeImageUrl(getOptimizedFoodImage(item?.name, item?.image), 1200, 800);
  }, [item]);

  if (loading)
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-gray-500">Đang tải món ăn…</div>
      </main>
    );

  if (err || !item)
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="text-red-600">{err || 'Không tìm thấy món'}</div>
        <Button className="mt-4" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      </main>
    );

  const discounted = hasDiscount({
    price: item.price,
    originalPrice: item.originalPrice,
  });

  const isAvailable = item?.isAvailable !== false;
  console.log(item?.options);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Nút back  */}
      <Button onClick={handleBack} variant="outline" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại Menu
      </Button>
      {/* Layout responsive */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2  bg-white overflow-hidden
        max-w-7xl mx-auto my-8 rounded-2xl transition-all duration-500"
      >
        {/* LEFT: Ảnh món ăn */}
        <div
          className="relative group w-full lg:h-auto aspect-[4/3] overflow-hidden 
        rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none flex items-center justify-center bg-white"
        >
          {/* Bọc ảnh trong 1 khung relative riêng */}
          <div className="border border-gray-200 relative w-full h-full flex items-center justify-center">
            {optimizedImg ? (
              <ImageWithFallback
                ref={imgRef}
                src={optimizedImg}
                alt={item.name}
                //         className="w-full h-full object-cover lg:object-cover sm:object-contain transition-transform duration-700 ease-out
                // group-hover:scale-105 group-hover:brightness-110"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 italic text-sm">
                Chưa có ảnh món ăn
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* --- Thông tin nhà hàng, giá, tên món --- */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              {/* top-left */}
              <div className="flex justify-between">
                {/* Tên quán */}
                <div className="bg-white/95 px-3 py-2 rounded-lg shadow-lg max-w-[70%]">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {restaurant?.merchant_name || restaurant?.name || 'Nhà hàng'}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>4.8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>25-35 phút</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>1000+ đánh giá</span>
                    </div>
                  </div>
                </div>

                {/* Giá */}
                <div className="bg-orange-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <p className="font-bold text-lg">{currencyVN(item.price)}</p>
                  {discounted && (
                    <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                      -{calculateDiscountPercentage(item.originalPrice, item.price)}%
                    </span>
                  )}
                </div>
                {/* Status Badges Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-white/95 backdrop-blur-sm border-white text-gray-800 shadow-lg"
                    >
                      {item.categoryName}
                    </Badge>
                    {!isAvailable && (
                      <Badge variant="destructive" className="shadow-lg">
                        Hết hàng
                      </Badge>
                    )}
                    {hasToppings && (
                      <Badge variant="secondary" className="bg-blue-500 text-white shadow-lg">
                        Có tùy chọn thêm
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* bottom-left */}
              <div className="flex justify-end">
                <div className="text-white drop-shadow-lg text-right">
                  <Badge className="bg-white/90 text-gray-800 mb-2">{item.categoryName}</Badge>
                  <h2 className="text-2xl font-bold">{item.name}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Thông tin chi tiết */}
        {/* <div className="p-6 sm:p-8 lg:p-10 space-y-6 overflow-y-auto max-w-2xl mx-auto w-full"> */}
        <div className="p-6 sm:p-6 lg:p-4 space-y-6 overflow-y-auto max-w-2xl mx-auto w-full">
          {/* Thông tin món */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold text-gray-900 -mt-4 mb-1 leading-snug">
              {item.name}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {item.description || 'Món ngon chuẩn vị. Nguyên liệu tươi, chế biến mỗi ngày.'}
            </p>

            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-orange-600">{currencyVN(item.price)}</div>
              {discounted && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {currencyVN(item.originalPrice)}
                  </span>
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                    -{calculateDiscountPercentage(item.originalPrice, item.price)}%
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm">
                {item.categoryName}
              </Badge>
              {hasDiscount(item) && (
                <Badge variant="secondary" className="bg-red-500 text-white text-sm">
                  Giảm giá {calculateDiscountPercentage(item.originalPrice, item.price)}%
                </Badge>
              )}
              {!isAvailable && (
                <Badge variant="destructive" className="text-sm">
                  Hết hàng
                </Badge>
              )}
              {hasToppings && (
                <Badge variant="secondary" className="bg-blue-500 text-white text-sm">
                  Có tùy chọn thêm
                </Badge>
              )}
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Nhà hàng</h3>
            <h4 className="font-semibold text-base text-orange-600 mb-2">{restaurant.merchant_name}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{restaurant.rating}  5 sao</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime} 25 - 30 phút</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>1000+ đánh giá</span>
              </div>
            </div>
          </div>

          {/* Nguyên vật liệu */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Leaf className="w-5 h-5 text-green-600 mr-2" /> Nguyên vật liệu
            </h3>
            {item.ingredients?.length ? (
              <div className="grid grid-cols-1 gap-2">
                {item.ingredients.map((ing, idx) => (
                  <div
                    key={`${ing}-${idx}`}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{ing}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-dashed border-gray-200 text-gray-500 italic">
                Chưa cập nhật
              </div>
            )}
          </div>

          {/* Số lượng + Thêm vào giỏ */}
          <Card className="p-6 hover:scale-100">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-gray-900 text-xl">Số lượng:</span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handleSub} disabled={qty <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-medium w-8 text-center">{qty}</span>
                <Button variant="outline" size="icon" onClick={handleAdd}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
              <span className="text-gray-700 font-medium text-xl">Tổng cộng:</span>
              <span className="text-2xl font-bold text-orange-600">
                {currencyVN(item.price * qty)}
              </span>
            </div>

            <Button variant="default" onClick={handleAddToCart} disabled={!isAvailable}>
              <Plus className="w-5 h-5 mr-2" />
              {/* {isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"} */}
              {isAvailable
                ? hasToppings && !toppingSelected
                  ? 'Chọn tùy chọn thêm'
                  : 'Thêm vào giỏ hàng'
                : 'Hết hàng'}
            </Button>
          </Card>
        </div>
      </div>
      {/* Dialog topping */}
      <ToppingSelectionDialog
        isOpen={showToppingDialog}
        onClose={() => setShowToppingDialog(false)}
        menuItem={item}
        restaurant={restaurant}
        quantity={qty}
        onConfirm={() => {
          setToppingSelected(true);
          setShowToppingDialog(false);
          addItem(item, restaurant, qty); // thêm luôn sau khi chọn topping
        }}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000, // 1 giây tự tắt
          style: { pointerEvents: 'none' }, // tránh bị touch giữ
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }}
      />
    </main>
  );
}

function normalizeItem(raw) {
  const parseIngredients = (src) => {
    if (!src) return [];
    try {
      if (Array.isArray(src)) return src;
      if (typeof src === 'string')
        return src
          .split(/,|;|\n/g)
          .map((s) => s.trim())
          .filter(Boolean);
      return [];
    } catch {
      return [];
    }
  };

  return {
    id: raw.id ?? raw.item_id,
    name: raw.name ?? raw.name_item,
    description: raw.description ?? '',
    price: Number(raw.price) || 0,
    originalPrice: Number(raw.originalPrice ?? raw.original_price ?? raw.price) || 0,
    image: raw.image ?? raw.image_item?.url ?? null,
    // toppings: raw.toppings ?? [],
    options: raw.options ?? [],
    isAvailable: raw.status !== false && raw.isAvailable !== false,
    ingredients: parseIngredients(raw.ingredients) || [],
    categoryName: raw.category_name ?? 'Món',
  };
}
