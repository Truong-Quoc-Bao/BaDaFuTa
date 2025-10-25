import { Search, TrendingUp, MapPin } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import RestaurantCard from "../components/RestaurantCard";
import { FeaturedRestaurant } from "../components/FeaturedRestaurant";
import { PromotionBanner } from "../components/PromotionBanner";
import { restaurants, featuredRestaurants, promotions } from "../../data/mockData";
import { useLocation } from "../contexts/LocationContext";
//import { useState, useMemo } from "react";
import React, { useEffect, useState } from "react";
export default function HomePage () {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCuisine, setSelectedCuisine] = useState("Tất cả");
  // // const { state: locationState, calculateDistance } = useLocation();

  // // Calculate distance for each restaurant and sort by distance
  // const restaurantsWithDistance = useMemo(() => {
  //   if (!locationState.currentLocation) return restaurants;

  //   return restaurants
  //     .map((restaurant) => {
  //       if (!restaurant.coordinates) return { ...restaurant, distance: 0 };

  //       const distance = calculateDistance(
  //         locationState.currentLocation.coordinates.lat,
  //         locationState.currentLocation.coordinates.lng,
  //         restaurant.coordinates.lat,
  //         restaurant.coordinates.lng
  //       );

  //       return { ...restaurant, distance: Math.round(distance * 10) / 10 };
  //     })
  //     .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  // }, [locationState.currentLocation, calculateDistance]);

  // const filteredRestaurants = restaurantsWithDistance.filter(
  //   (restaurant) =>
  //     restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const cuisineTypes = [
  //   "Tất cả",
  //   "Việt Nam",
  //   "Ý",
  //   "Nhật Bản",
  //   "Thái Lan",
  //   "Hàn Quốc",
  //   "Mỹ",
  // ];

  // const finalFilteredRestaurants =
  //   selectedCuisine === "Tất cả"
  //     ? filteredRestaurants
  //     : filteredRestaurants.filter(
  //         (restaurant) => restaurant.cuisine === selectedCuisine
  //       );

const [restaurants, setRestaurants] = useState([]);
// useEffect(() => {
//   const fetchRestaurants = async () => {
//     try {
//       // const res = await fetch("http://localhost:3000/api/restaurants"); // localhost:3000/api/merchant/restaurants
//       const res = await fetch("/api/restaurants");
//       // const res = await fetch("http://192.168.100.124:3000/api/restaurants"); // localhost:3000/api/merchant/restaurants
//       // const res = await fetch("http://172.20.10.3:3000/api/restaurants"); // localhost:3000/api/merchant/restaurants
//       const data = await res.json();
//       setRestaurants(data);
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách nhà hàng:", error);
//     }
//   };
//   fetchRestaurants();
// }, []);
  
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      const hosts = [
        "/api/restaurants",
        "/api192/restaurants",
        "/apiLocal/restaurants",
        "/api172/restaurants",
      ];

      for (const url of hosts) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed at ${url}`);
          const data = await res.json();
          setRestaurants(data);
          console.log("Lấy dữ liệu từ:", url);
          return; // nếu thành công thì thoát loop
        } catch (err) {
          console.warn(err.message);
        }
      }

      console.error("Không thể lấy dữ liệu từ bất kỳ host nào");
    };

    fetchRestaurants();
  }, []);



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Đặt món yêu thích của bạn
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Giao hàng nhanh chóng từ các nhà hàng tốt nhất trong khu vực
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhà hàng hoặc món ăn..."
            // value={searchQuery}
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
      {/* {locationState.currentLocation && finalFilteredRestaurants.length > 0 && ( */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold">
            {/* Nhà hàng gần bạn tại {locationState.currentLocation.name} */}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {finalFilteredRestaurants.slice(0, 6).map((restaurant) => ( */}
          {/* <RestaurantCard key={restaurant.id} restaurant={restaurant} /> */}
          {/* ))} */}
        </div>
      </div>
      {/* )} */}

      {/* Cuisine Filter
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Lọc theo loại ẩm thực</h2>
        <div className="flex flex-wrap gap-2">
          {cuisineTypes.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? "default" : "outline"}
              onClick={() => setSelectedCuisine(cuisine)}
              className={
                selectedCuisine === cuisine
                  ? "bg-orange-500 hover:bg-orange-600"
                  : ""
              }
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div> */}

      <div className="mb-8 ">
        <h2 className="text-2xl font-bold mb-4">Lọc theo loại ẩm thực</h2>
        <div className="flex flex-wrap gap-3">
          {/* {cuisineTypes.map((cuisine) => {
            const isSelected = selectedCuisine === cuisine;
            return (
              <button
                key={cuisine}
                variant={selectedCuisine === cuisine ? "default" : "outline"}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`rounded-xl px-5 py-2 text-base font-semibold border transition-all duration-200
            ${
              isSelected
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
              >
                {cuisine}
              </button>
            );
          })} */}
        </div>
      </div>

      {/* All Restaurants */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Tất cả nhà hàng</h2>
        {/* {finalFilteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy nhà hàng nào phù hợp
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finalFilteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )} */}
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}{" "}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy nhà hàng nào phù hợp
            </p>
          </div>
        )}{" "}
      </div>
    </div>
  );
};
