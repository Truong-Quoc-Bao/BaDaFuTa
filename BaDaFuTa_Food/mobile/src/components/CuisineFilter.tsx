import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CuisineFilterProps {
  activeCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

const cuisines = [
  { id: 'all', label: 'Tất cả' },
  { id: 'vietnam', label: 'Việt Nam' },
  { id: 'italy', label: 'Ý' },
  { id: 'japan', label: 'Nhật Bản' },
  { id: 'thailand', label: 'Thái Lan' },
  { id: 'korea', label: 'Hàn Quốc' },
  { id: 'usa', label: 'Mỹ' },
  { id: 'healthy', label: 'Healthy' },
];

export const CuisineFilter: React.FC<CuisineFilterProps> = ({ activeCuisine, onCuisineChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lọc theo loại ẩm thực</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {cuisines.map((cuisine) => {
          const isActive = activeCuisine === cuisine.id;
          return (
            <TouchableOpacity
              key={cuisine.id}
              style={[styles.badge, isActive ? styles.activeBadge : styles.inactiveBadge]}
              onPress={() => onCuisineChange(cuisine.id)}
            >
              <Text style={[styles.badgeText, isActive ? styles.activeText : styles.inactiveText]}>
                {cuisine.label}
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
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  activeBadge: {
    backgroundColor: '#FF6900',
    borderColor: '#FF6900',
  },
  inactiveBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  badgeText: {
    fontSize: 14,
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#374151',
  },
});
