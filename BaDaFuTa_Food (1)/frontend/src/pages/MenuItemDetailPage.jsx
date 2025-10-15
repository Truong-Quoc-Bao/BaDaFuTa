// src/pages/MenuItemDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, Users, Star, Plus, Minus, Leaf } from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { ToppingSelectionDialog } from "../components/ToppingSelectionDialog";

import {
  getOptimizedFoodImage,
  optimizeImageUrl,
  hasDiscount,
  calculateDiscountPercentage,
} from "../utils/imageUtils";

const currencyVN = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

export default function MenuItemDetailPage() {
  const { restaurantId, itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  const stateItem = location.state?.menuItem || null;
  const stateRestaurant = location.state?.restaurant || null;

  const [loading, setLoading] = useState(!(stateItem && stateRestaurant));
  const [err, setErr] = useState(null);
  const [restaurant, setRestaurant] = useState(stateRestaurant || null);
  const [item, setItem] = useState(stateItem ? normalizeItem(stateItem) : null);
  const [qty, setQty] = useState(1);
  const [showToppingDialog, setShowToppingDialog] = useState(false);

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
          if (!r.ok) throw new Error("Không tải được nhà hàng");
          setRestaurant(await r.json());
        }

        if (!item) {
          const r = await fetch(`/api/v1/menu-items/${itemId}`, {
            signal: ac.signal,
          });
          if (!r.ok) throw new Error("Không tải được món");
          setItem(normalizeItem(await r.json()));
        }

        setErr(null);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Lỗi không xác định");
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

  const handleAddToCart = () => {
    if (!item || !restaurant) return;
    if (item.toppings?.length) setShowToppingDialog(true);
    else addItem(item, restaurant, qty);
  };

  const optimizedImg = useMemo(() => {
    if (!item?.image && !item?.name) return null;
    return optimizeImageUrl(
      getOptimizedFoodImage(item?.name, item?.image),
      1200,
      800
    );
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
        <div className="text-red-600">{err || "Không tìm thấy món"}</div>
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

  return (
    <main className="flex-1">
      {/* Nút back nổi */}
      <Button
        onClick={handleBack}
        variant="outline"
        className="fixed top-4 left-4 z-50 bg-white/95 backdrop-blur-sm shadow-lg h-9 px-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Layout responsive */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white overflow-hidden
        max-w-7xl mx-auto my-8 rounded-2xl shadow-sm transition-all duration-500"
      >
        {/* LEFT: Ảnh món ăn */}
        <div
          className="relative group w-full lg:h-auto aspect-[4/3] overflow-hidden 
  rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none flex items-center justify-center bg-white"
        >
          {/* Bọc ảnh trong 1 khung relative riêng */}
          <div className="relative w-full h-full flex items-center justify-center">
            {optimizedImg ? (
              <ImageWithFallback
                src={optimizedImg}
                alt={item.name}
                className="w-full h-full object-cover lg:object-cover sm:object-contain transition-transform duration-700 ease-out 
        group-hover:scale-105 group-hover:brightness-110"
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
                    {restaurant?.merchant_name ||
                      restaurant?.name ||
                      "Nhà hàng"}
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
                      -
                      {calculateDiscountPercentage(
                        item.originalPrice,
                        item.price
                      )}
                      %
                    </span>
                  )}
                </div>
              </div>

              {/* bottom-left */}
              <div className="text-white drop-shadow-lg">
                <Badge className="bg-white/90 text-gray-800 mb-2">
                  {item.categoryName}
                </Badge>
                <h2 className="text-2xl font-bold">{item.name}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Thông tin chi tiết */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-6 overflow-y-auto max-w-2xl mx-auto w-full">
          {/* Thông tin món */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {item.name}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {item.description ||
                "Món ngon chuẩn vị. Nguyên liệu tươi, chế biến mỗi ngày."}
            </p>

            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-orange-600">
                {currencyVN(item.price)}
              </div>
              {discounted && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {currencyVN(item.originalPrice)}
                  </span>
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                    -
                    {calculateDiscountPercentage(
                      item.originalPrice,
                      item.price
                    )}
                    %
                  </span>
                </>
              )}
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
                    <span className="text-gray-700 text-sm font-medium">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500 italic">
                Chưa cập nhật
              </div>
            )}
          </div>

          {/* Số lượng + Thêm vào giỏ */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-gray-900 text-xl">Số lượng:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSub}
                  disabled={qty <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-medium w-8 text-center">{qty}</span>
                <Button variant="outline" size="icon" onClick={handleAdd}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
              <span className="text-gray-700 font-medium text-xl">
                Tổng cộng:
              </span>
              <span className="text-3xl font-bold text-orange-600">
                {currencyVN(item.price * qty)}
              </span>
            </div>

            <Button
              variant="default"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              <Plus className="w-5 h-5 mr-2" />
              {isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
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
      />
    </main>
  );
}

function normalizeItem(raw) {
  const parseIngredients = (src) => {
    if (!src) return [];
    try {
      if (Array.isArray(src)) return src;
      if (typeof src === "string")
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
    description: raw.description ?? "",
    price: Number(raw.price) || 0,
    originalPrice:
      Number(raw.originalPrice ?? raw.original_price ?? raw.price) || 0,
    image: raw.image ?? raw.image_item?.url ?? null,
    toppings: raw.toppings ?? [],
    isAvailable: raw.status !== false && raw.isAvailable !== false,
    ingredients: parseIngredients(raw.ingredients) || [],
    categoryName: raw.category_name ?? "Món",
  };
}
