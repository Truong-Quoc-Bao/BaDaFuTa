import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { 
  UtensilsCrossed, 
  Salad, 
  Coffee, 
  ShieldCheck, 
  Star, 
  Truck 
} from 'lucide-react-native';

interface Category {
  id: string;
  name: string;
  icon: React.FC<any>;
  bgColor: string;
  iconColor: string;
}

const categories: Category[] = [
  { id: 'main', name: 'Món chính', icon: UtensilsCrossed, bgColor: '#F3F4F6', iconColor: '#374151' },
  { id: 'appetizer', name: 'Món khai vị', icon: Salad, bgColor: '#ECFDF5', iconColor: '#16A34A' },
  { id: 'drink', name: 'Đồ uống', icon: Coffee, bgColor: '#FFFBEB', iconColor: '#B45309' },
  { id: 'freeship', name: 'Bao hết phí ship', icon: ShieldCheck, bgColor: '#EFF6FF', iconColor: '#2563EB' },
  { id: 'popular', name: 'Quán ăn quốc dân', icon: Star, bgColor: '#FFFBEB', iconColor: '#D97706' },
  { id: 'freeshipping', name: 'Miễn phí ship', icon: Truck, bgColor: '#F5F3FF', iconColor: '#7C3AED' },
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onCategoryChange(category.id)}
              style={[
                styles.button,
                { backgroundColor: isActive ? '#FF6900' : category.bgColor }
              ]}
            >
              <Icon size={24} color={isActive ? '#FFFFFF' : category.iconColor} />
              <Text style={[styles.label, { color: isActive ? '#FFFFFF' : '#374151' }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
