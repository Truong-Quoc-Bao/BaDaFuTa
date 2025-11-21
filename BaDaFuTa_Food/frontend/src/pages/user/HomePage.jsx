import { Search, TrendingUp, MapPin } from 'lucide-react';
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
  // const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState('Tất cả');
  const { state: locationState, calculateDistance } = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ⭐ Chuẩn hóa dữ liệu backend -> format FE dùng được
  const normalizedRestaurants = restaurants.map((r) => ({
    id: r.id,
    name: r.merchant_name || '',
    cuisine: r.cuisine || '',
    coordinates: r.location ? { lat: r.location.lat, lng: r.location.lng } : null,
    profile_image: r.profile_image?.url,
    cover_image: r.cover_image?.url,
  }));

  // ⭐ Tính khoảng cách
  const restaurantsWithDistance = useMemo(() => {
    if (!locationState.currentLocation) return restaurants;

    return restaurants
      .map((restaurant) => {
        if (!restaurant.coordinates) return { ...restaurant, distance: 0 };

        const distance = calculateDistance(
          locationState.currentLocation.coordinates.lat,
          locationState.currentLocation.coordinates.lng,
          restaurant.coordinates.lat,
          restaurant.coordinates.lng,
        );

        return { ...restaurant, distance: Math.round(distance * 10) / 10 };
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [locationState.currentLocation, calculateDistance]);

  // ⭐ Lọc theo search
  const filteredRestaurants = restaurantsWithDistance.filter((restaurant) => {
    const name = restaurant?.name?.toLowerCase() || '';
    const cuisine = restaurant?.cuisine?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return name.includes(query) || cuisine.includes(query);
  });

  const cuisineTypes = ['Tất cả', 'Việt Nam', 'Ý', 'Nhật Bản', 'Thái Lan', 'Hàn Quốc', 'Mỹ'];

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
        setRestaurants(data);
        console.log('Fetch:', url);
      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    fetchRestaurants();
  }, [searchQuery, selectedCuisine]);

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
          {promotions.map((promotion) => (
            <PromotionBanner key={promotion.id} promotion={promotion} />
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold">Nhà hàng nổi bật</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featuredRestaurants.map((restaurant, index) => (
            <FeaturedRestaurant
              key={restaurant.id}
              restaurant={restaurant}
              promotion={
                index === 0
                  ? {
                      title: promotions[0].title,
                      description: promotions[0].description,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Restaurants Near You */}
      {locationState.currentLocation && finalFilteredRestaurants.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">
              Nhà hàng gần bạn tại {locationState.currentLocation.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalFilteredRestaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}

      {/* {/* Cuisine Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Lọc theo loại ẩm thực</h2>
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
        <h2 className="text-2xl font-bold mb-6">Tất cả nhà hàng</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {' '}
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}{' '}
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
