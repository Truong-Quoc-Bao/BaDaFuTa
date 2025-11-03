import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Star, Clock, MapPin, Heart, Share2, Info, ShoppingBag } from 'lucide-react-native';
import { toast } from 'sonner';
import { FoodItem } from '../components/FoodCard';

interface RestaurantDetailPageProps {
  restaurant: FoodItem;
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
  cartCount?: number;
  cartTotal?: number;
  onViewCart?: () => void;
  onCheckout?: () => void;
}

// Mock menu items for the restaurant

// Mock menu items for the restaurant
const getMenuItems = (restaurantId: string): FoodItem[] => {
  return [
    {
      id: `${restaurantId}-menu-1`,
      name: 'Phở Bò Tái',
      description: 'Phở bò tái truyền thống với nước dùng thơm ngon',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGVzJTIwYm93bHxlbnwxfHx8fDE3NjExNDEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'main',
      cuisine: 'Việt Nam',
      rating: 4.8,
    },
    {
      id: `${restaurantId}-menu-2`,
      name: 'Phở Gà',
      description: 'Phở gà thanh đạm, nước dùng ngọt từ xương gà',
      price: 60000,
      image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGVzJTIwYm93bHxlbnwxfHx8fDE3NjExNDEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'main',
      cuisine: 'Việt Nam',
      rating: 4.7,
    },
    {
      id: `${restaurantId}-menu-3`,
      name: 'Phở Đặc Biệt',
      description: 'Phở đầy đủ các loại thịt bò: tái, nạm, gầu, gân',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGVzJTIwYm93bHxlbnwxfHx8fDE3NjExNDEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'main',
      cuisine: 'Việt Nam',
      rating: 4.9,
    },
    {
      id: `${restaurantId}-menu-4`,
      name: 'Gỏi Cuốn',
      description: 'Gỏi cuốn tôm thịt tươi mát, ăn kèm tương đậm đà',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1595238734477-ae7f8a79ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzYxMDk2NzI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'appetizer',
      cuisine: 'Việt Nam',
      rating: 4.5,
    },
    {
      id: `${restaurantId}-menu-5`,
      name: 'Chả Giò',
      description: 'Chả giò giòn rụm, nhân thịt hải sản thơm phức',
      price: 40000,
      image: 'https://images.unsplash.com/photo-1595238734477-ae7f8a79ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzYxMDk2NzI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'appetizer',
      cuisine: 'Việt Nam',
      rating: 4.6,
    },
    {
      id: `${restaurantId}-menu-6`,
      name: 'Cà Phê Sữa Đá',
      description: 'Cà phê phin truyền thống, đậm đà thơm ngon',
      price: 20000,
      image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NjExMTMwNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'drink',
      cuisine: 'Việt Nam',
      rating: 4.4,
    },
  ];
};

export function RestaurantDetailPage({
  restaurant,
  onBack,
  onAddToCart,
  cartCount = 0,
  cartTotal = 0,
  onViewCart,
  onCheckout,
}: RestaurantDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const menuItems = getMenuItems(restaurant.id);

  const handleShare = () => {
    toast.success('Đã sao chép link chia sẻ!');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Image with Header */}
        <View style={{ position: 'relative', height: 208 }}>
          <Image
            source={{ uri: restaurant.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }} />
          {/* Header Actions */}
          <View style={{ position: 'absolute', top: 16, left: 0, right: 0, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                <ChevronLeft size={20} color="#111" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                  <Share2 size={20} color="#111" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFavorite} style={styles.iconButton}>
                  <Heart size={20} color={isFavorite ? 'red' : '#111'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Cuisine and Rating Badges */}
          <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.badge}>
              <Text style={{ color: '#111' }}>{restaurant.cuisine}</Text>
            </View>
            {restaurant.rating && (
              <View style={{ ...styles.badge, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={14} color="#FBBF24" />
                <Text style={{ color: '#111' }}>{restaurant.rating}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Restaurant Info */}
        <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', padding: 16 }}>
          <Text style={{ fontSize: 20, color: '#111', marginBottom: 8 }}>{restaurant.name}</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{restaurant.description}</Text>

          {/* Delivery Info */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
            {restaurant.deliveryTime && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock size={14} color="#6b7280" />
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{restaurant.deliveryTime}</Text>
              </View>
            )}
            {restaurant.distance && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} color="#6b7280" />
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{restaurant.distance}</Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 12 }}>
            <View>
              <Text style={{ fontSize: 10, color: '#6b7280' }}>Phí giao hàng:</Text>
              <Text style={{ color: '#FF6900' }}>{restaurant.price.toLocaleString('vi-VN')}₫</Text>
            </View>
            <TouchableOpacity style={styles.outlineButton}>
              <Info size={16} color="#FF6900" />
              <Text style={{ color: '#FF6900', marginLeft: 4 }}>Thông tin cửa hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Section */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, color: '#111', marginBottom: 12 }}>Thực đơn</Text>
          {menuItems.map(item => (
            <View key={item.id} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <Image source={{ uri: item.image }} style={{ width: 96, height: 96, borderRadius: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, color: '#111', marginBottom: 4 }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{item.description}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#FF6900' }}>{item.price.toLocaleString('vi-VN')}₫</Text>
                  <TouchableOpacity onPress={() => onAddToCart(item)} style={styles.addButton}>
                    <Text style={{ color: '#fff' }}>Thêm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Cart Buttons */}
      {cartCount > 0 && (
        <View style={styles.cartBottom}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <ShoppingBag size={16} color="#6b7280" />
              <Text style={{ color: '#6b7280' }}>{cartCount} món</Text>
            </View>
            <Text style={{ color: '#FF6900' }}>{cartTotal.toLocaleString('vi-VN')}₫</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {onViewCart && (
              <TouchableOpacity onPress={onViewCart} style={styles.outlineButtonFlex}>
                <Text style={{ color: '#FF6900' }}>Xem giỏ hàng</Text>
              </TouchableOpacity>
            )}
            {onCheckout && (
              <TouchableOpacity onPress={onCheckout} style={styles.addButtonFlex}>
                <Text style={{ color: '#fff' }}>Đặt hàng ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 999,
  },
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6900',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#FF6900',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cartBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    zIndex: 50,
  },
  addButtonFlex: {
    flex: 1,
    backgroundColor: '#FF6900',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  outlineButtonFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF6900',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});
