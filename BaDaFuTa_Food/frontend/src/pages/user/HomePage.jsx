import { Search, TrendingUp, MapPin, Tag } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import RestaurantCard from '../../components/RestaurantCard';
import { FeaturedRestaurant } from '../../components/FeaturedRestaurant';
import { PromotionBanner } from '../../components/PromotionBanner';
import { restaurants, featuredRestaurants, promotions } from '../../../data/mockData';
import { useLocation } from '../../contexts/LocationContext';
//import { useState, useMemo } from "react";
import React, { useEffect, useState, useMemo } from 'react';
export default function HomePage() {
  const [selectedCuisine, setSelectedCuisine] = useState('Tất cả');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');

  const { state: locationState, calculateDistance } = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [restaurantList, setRestaurantList] = useState([]);
  const [maxDistance, setMaxDistance] = useState(2); // km

  // Chuẩn hóa dữ liệu
  const normalizedRestaurants = restaurantList.map((r) => {
    let district = 'Không xác định';
    if (r.location?.address) {
      const parts = r.location.address.split(',');
      if (parts.length >= 2) district = parts[1].trim();
    }
    return {
      ...r,
      coordinates: r.location ? { lat: r.location.lat, lng: r.location.lng } : null,
      district,
    };
  });

  // ⭐ Tính khoảng cách
  const restaurantsWithDistance = useMemo(() => {
    if (!locationState.currentLocation) return normalizedRestaurants;

    return normalizedRestaurants
      .map((r) => {
        if (!r.coordinates) return { ...r, distance: Infinity };
        const distance = calculateDistance(
          locationState.currentLocation.coordinates.lat,
          locationState.currentLocation.coordinates.lng,
          r.coordinates.lat,
          r.coordinates.lng,
        );
        return { ...r, distance: Math.round(distance * 10) / 10 };
      })
      .filter((r) => r.distance <= maxDistance)
      .filter(
        (r) =>
          selectedDistrict === 'Tất cả' ||
          r.district.toLowerCase() === selectedDistrict.toLowerCase(),
      )
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [
    normalizedRestaurants,
    locationState.currentLocation,
    calculateDistance,
    maxDistance,
    selectedDistrict,
  ]);

  // ⭐ Lọc theo search
  const filteredRestaurants = restaurantsWithDistance.filter((restaurant) => {
    const name = restaurant?.name?.toLowerCase() || '';
    const cuisine = restaurant?.cuisine?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return name.includes(query) || cuisine.includes(query);
  });

  const cuisineTypes = ['Tất cả', 'Việt Nam', 'Coffee', 'Philippin', 'Thái Lan', 'Hàn Quốc', 'Mỹ'];

  const finalFilteredRestaurants =
    selectedCuisine === 'Tất cả'
      ? filteredRestaurants
      : filteredRestaurants.filter((restaurant) => restaurant.cuisine === selectedCuisine);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const host = 'https://badafuta-production.up.railway.app/api/restaurants';

      const params = new URLSearchParams();

      // Search param
      if (searchQuery.trim() !== '') {
        params.append('search', searchQuery);
      }

      // Cuisine param
      if (selectedCuisine !== 'Tất cả') {
        params.append('cuisine', selectedCuisine);
      }

      let url = host;

      if (params.toString() !== '') {
        url = `${host}?${params.toString()}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fetch failed');

        const data = await res.json();
        setRestaurantList(data); // ✅ set vào list chuẩn để tính khoảng cách
        setRestaurants(data); // ✅ set vào list để hiển thị "All Restaurants"
        console.log('Fetch:', url);
      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    fetchRestaurants();
  }, [searchQuery, selectedCuisine]);
  console.log(normalizedRestaurants.map((r) => r.district));

  //Voucher
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    async function loadVouchers() {
      try {
        const res = await fetch('https://badafuta-production.up.railway.app/api/voucher/getAll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        const json = await res.json();

        console.log('Voucher API response:', json);

        const list = [
          ...(json.data?.appVouchers || []),
          ...(json.data?.merchantVouchers || []),
          ...(json.data?.userVouchers || []),
        ];

        setVouchers(list);
      } catch (err) {
        console.error('Lỗi load vouchers:', err);
      }
    }

    loadVouchers();
  }, []);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  useEffect(() => {
    async function fetchFeaturedRestaurants() {
      try {
        const res = await fetch(
          'https://badafuta-production.up.railway.app/api/restaurants/future',
        );
        // const res = await fetch(
        //   " http://localhost:3000/api/restaurants/future"
        // );

        if (!res.ok) throw new Error('Lỗi khi gọi API');

        const data = await res.json();

        // Map dữ liệu giống Restaurants list
        const mapped = data.map((m) => {
          const distance =
            m.location && locationState.currentLocation
              ? Math.round(
                  calculateDistance(
                    locationState.currentLocation.coordinates.lat,
                    locationState.currentLocation.coordinates.lng,
                    m.location.lat,
                    m.location.lng,
                  ) * 10,
                ) / 10
              : 0;

          let deliveryFee = 0;
          if (distance <= 3) deliveryFee = 16000;
          else deliveryFee = 16000 + Math.ceil(distance - 3) * 4000; // <-- FIXED

          const deliveryTime = 10 + Math.round(distance * 8);

          return {
            id: m.id,
            merchant_name: m.merchant_name,
            image: m.cover_image?.url || m.profile_image?.url,
            cuisine: m.cuisine,
            rating: m.rating,
            description: m.description,
            distance,
            deliveryFee,
            deliveryTime,
            cover_image: m.cover_image,
            location: m.location,
            time_open: m.time_open || '10:00-22:00', // backend có trả thì dùng, không thì mặc định
            isOpen: true,
          };
        });

        setFeaturedRestaurants(mapped);
      } catch (error) {
        console.error('Lỗi load nhà hàng nổi bật:', error);
      }
    }

    fetchFeaturedRestaurants();
  }, [locationState.currentLocation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Đặt món yêu thích của bạn</h1>
        <p className="text-xl text-gray-600 mb-8">
          Giao hàng nhanh chóng từ các nhà hàng tốt nhất trong khu vực
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhà hàng hoặc món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full"
          />
        </div>
      </div>

      {/* Promotions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ưu đãi hôm nay</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers?.length > 0 ? (
            vouchers.map((voucher) => <PromotionBanner key={voucher.id} promotion={voucher} />)
          ) : (
            <div className="col-span-full py-16">
              <div className="max-w-md mx-auto text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
                  <Tag className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Chưa có ưu đãi nào</h3>
                <p className="text-gray-600 leading-relaxed">
                  Đừng buồn! Ưu đãi siêu hot sẽ được cập nhật hàng ngày. Bạn quay lại sau vài tiếng
                  nữa nhé
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl md:text-2xl font-bold">Nhà hàng nổi bật</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredRestaurants.map((r, index) => {
            const distance = r.distance || 0;
            const deliveryFee = distance <= 3 ? 16000 : 16000 + Math.ceil(distance - 3) * 4000;
            const deliveryTime = Math.max(10, Math.round(distance * 8));

            return (
              <FeaturedRestaurant
                key={r.id}
                restaurant={{
                  ...r,
                  distance,
                  deliveryFee,
                  deliveryTime,
                }}
                promotion={index === 0 ? promotions[0] : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Restaurants Near You */}
      {locationState.currentLocation && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold">
              Nhà hàng gần bạn tại {locationState.currentLocation.name}
            </h2>
          </div>

          {finalFilteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredRestaurants.slice(0, 6).map((r) => {
                const distance = r.distance || 0; // km
                let deliveryFee = 0;

                if (distance <= 3) {
                  deliveryFee = 16000; // 3 km đầu
                } else {
                  deliveryFee = 16000 + Math.ceil(distance - 3) * 4000; // km > 3
                }

                const deliveryTime = Math.max(10, Math.round(distance * 8));

                return (
                  <RestaurantCard
                    key={r.id}
                    restaurant={{
                      ...r,
                      cover_image: { url: r.cover_image?.url },
                      profile_image: { url: r.profile_image?.url },
                      distance,
                      deliveryFee,
                      deliveryTime,
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không có nhà hàng nào ở {locationState.currentLocation.name}
              </p>
            </div>
          )}
        </div>
      )}

      {/* {/* Cuisine Filter */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Lọc theo loại ẩm thực</h2>
        <div className="flex flex-wrap gap-2">
          {cuisineTypes.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'default' : 'outline'}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`rounded-xl w-max px-5 py-2 text-base font-semibold border transition-all duration-200
               ${
                 selectedCuisine === cuisine
                   ? 'bg-orange-500 text-white border-orange-500'
                   : 'bg-white text-black border-gray-300 hover:bg-gray-100'
               }`}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      {/* All Restaurants */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Tất cả nhà hàng</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalizedRestaurants.map((r) => {
              const distance =
                r.coordinates && locationState.currentLocation
                  ? Math.round(
                      calculateDistance(
                        locationState.currentLocation.coordinates.lat,
                        locationState.currentLocation.coordinates.lng,
                        r.coordinates.lat,
                        r.coordinates.lng,
                      ) * 10,
                    ) / 10
                  : 0;

              // Tính phí giao hàng: 3 km đầu 16k, km tiếp theo 4k/km
              let deliveryFee = 0;
              if (distance <= 3) {
                deliveryFee = 16000;
              } else {
                deliveryFee = 16000 + Math.ceil(distance - 3) * 4000;
              }

              // Tính thời gian giao hàng: 10 phút cơ bản + 8 phút mỗi km
              const deliveryTime = 10 + Math.round(distance * 8);

              return (
                <RestaurantCard
                  key={r.id}
                  restaurant={{
                    ...r,
                    cover_image: { url: r.cover_image?.url },
                    profile_image: { url: r.profile_image?.url },
                    distance,
                    deliveryFee,
                    deliveryTime,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không tìm thấy nhà hàng nào phù hợp</p>
          </div>
        )}{' '}
      </div>
    </div>
  );
}
