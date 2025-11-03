import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CategoryNav } from '../components/CategoryNav';
import { PromoCarousel } from '../components/PromoCarousel';
import { CuisineFilter } from '../components/CuisineFilter';
import { FoodCard, FoodItem } from '../components/FoodCard';

interface HomePageProps {
  foodItems: FoodItem[];
  onAddToCart: (item: FoodItem) => void;
  onRestaurantClick?: (item: FoodItem) => void;
}

export function HomePage({ foodItems, onAddToCart, onRestaurantClick }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCuisine, setActiveCuisine] = useState('all');

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesCuisine =
        activeCuisine === 'all' ||
        item.cuisine.toLowerCase() === activeCuisine.toLowerCase() ||
        (activeCuisine === 'vietnam' && item.cuisine === 'Việt Nam') ||
        (activeCuisine === 'italy' && item.cuisine === 'Ý') ||
        (activeCuisine === 'japan' && item.cuisine === 'Nhật Bản') ||
        (activeCuisine === 'thailand' && item.cuisine === 'Thái Lan') ||
        (activeCuisine === 'korea' && item.cuisine === 'Hàn Quốc') ||
        (activeCuisine === 'usa' && item.cuisine === 'Mỹ') ||
        (activeCuisine === 'healthy' && item.cuisine === 'Healthy');
      return matchesCategory && matchesCuisine;
    });
  }, [activeCategory, activeCuisine, foodItems]);

  const getCategoryTitle = () => {
    if (activeCuisine !== 'all') return 'Tất cả nhà hàng';
    if (activeCategory === 'all') return 'Tất cả món ăn';
    if (activeCategory === 'main') return 'Món chính';
    if (activeCategory === 'appetizer') return 'Món khai vị';
    if (activeCategory === 'drink') return 'Đồ uống';
    return 'Tráng miệng';
  };

  return (
    <ScrollView style={styles.container}>
      <CategoryNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <PromoCarousel />
      <CuisineFilter activeCuisine={activeCuisine} onCuisineChange={setActiveCuisine} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{getCategoryTitle()}</Text>
          <Text style={styles.count}>{filteredItems.length} món</Text>
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Không tìm thấy món ăn</Text>
          </View>
        ) : (
          <View style={styles.foodList}>
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onCardClick={onRestaurantClick}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignSelf: 'center',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  count: {
    color: '#6B7280',
    fontSize: 14,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
  foodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
