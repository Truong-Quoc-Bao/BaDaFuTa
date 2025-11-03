import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  cuisine: string;
  rating?: number;
  deliveryTime?: string;
  distance?: string;
}

interface FoodCardProps {
  item: FoodItem;
  onAddToCart?: (item: FoodItem) => void;
  onCardClick?: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onCardClick }) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        
        {/* Cuisine Badge */}
        <View style={styles.cuisineBadge}>
          <Text style={styles.badgeText}>{item.cuisine}</Text>
        </View>

        {/* Rating Badge */}
        {item.rating !== undefined && (
          <View style={styles.ratingBadge}>
            <Star size={12} color="#FACC15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        {/* Delivery Info */}
        {(item.deliveryTime || item.distance) && (
          <View style={styles.deliveryInfo}>
            {item.deliveryTime && (
              <View style={styles.deliveryItem}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
              </View>
            )}
            {item.distance && (
              <View style={styles.deliveryItem}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.deliveryText}>{item.distance}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.shippingText}>Phí giao hàng:</Text>
          <Text style={styles.priceText}>{item.price.toLocaleString('vi-VN')}₫</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cuisineBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#111827',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#111827',
    marginLeft: 2,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deliveryText: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shippingText: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceText: {
    fontSize: 12,
    color: '#FF6900',
    fontWeight: '600',
  },
});
