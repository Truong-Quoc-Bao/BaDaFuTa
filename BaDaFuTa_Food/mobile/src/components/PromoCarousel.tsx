import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Gift, Copy, ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';

const { width } = Dimensions.get('window');

interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  gradient: string[];
}

const promos: Promo[] = [
  {
    id: '1',
    title: 'Giảm 50% đơn đầu tiên',
    description: 'Áp dụng cho khách hàng mới, tối đa 100,000đ',
    code: 'WELCOME50',
    gradient: ['#FF6900', '#FF4444'],
  },
  {
    id: '2',
    title: 'Miễn phí giao hàng',
    description: 'Đơn từ 200,000đ trở lên',
    code: 'FREESHIP',
    gradient: ['#FF6900', '#FF4444'],
  },
  {
    id: '3',
    title: 'Combo ưu đãi cuối tuần',
    description: 'Giảm 30% các combo, chỉ áp dụng T7-CN',
    code: 'WEEKEND30',
    gradient: ['#FF6900', '#FF4444'],
  },
  {
    id: '4',
    title: 'Happy Hour Coffee',
    description: 'Giảm 25% đồ uống từ 14h-16h',
    code: 'COFFEE25',
    gradient: ['#FF6900', '#FF4444'],
  },
];

export const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    ToastAndroid.show(`Đã sao chép mã ${code}`, ToastAndroid.SHORT);
  };

  const handleNext = () => {
    if (currentIndex < promos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  return (
    <View style={{ paddingVertical: 8 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ưu đãi hôm nay</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              styles.navButton,
              currentIndex === 0 && styles.navButtonDisabled,
            ]}
          >
            <ChevronLeft size={18} color={currentIndex === 0 ? '#9CA3AF' : '#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex >= promos.length - 1}
            style={[
              styles.navButton,
              currentIndex >= promos.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <ChevronRight size={18} color={currentIndex >= promos.length - 1 ? '#9CA3AF' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={promos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.8, backgroundColor: item.gradient[0] }]}>
            <View style={styles.cardContent}>
              <View style={styles.iconWrapper}>
                <Gift size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.codeRow}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{item.code}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleCopyCode(item.code)} style={styles.copyButton}>
                    <Copy size={16} color="#FF6900" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 16 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  navButtons: { flexDirection: 'row', gap: 8 },
  navButton: { backgroundColor: '#FF6900', padding: 6, borderRadius: 12 },
  navButtonDisabled: { backgroundColor: '#E5E7EB' },
  card: { borderRadius: 16, padding: 16, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrapper: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  title: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  description: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  codeBox: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  codeText: { fontSize: 12, color: '#FF6900', fontWeight: 'bold' },
  copyButton: { padding: 4, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8 },
});
