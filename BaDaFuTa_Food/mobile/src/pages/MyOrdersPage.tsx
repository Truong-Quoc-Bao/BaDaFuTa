import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Calendar, Package, X, Star } from 'lucide-react-native';

interface MyOrdersPageProps {
  onBack: () => void;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderId: string;
  restaurantName: string;
  restaurantImage: string;
  items: OrderItem[];
  orderTime: string;
  deliveryTime: string;
  total: number;
  status: 'delivered' | 'delivering' | 'cancelled';
  rating?: number;
  review?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD001',
    restaurantName: 'Phở Hà Nội',
    restaurantImage: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGVzJTIwYm93bHxlbnwxfHx8fDE3NjExNDEwMTl8MA&ixlib=rb-4.1.0&q=80&w=400',
    items: [
      { name: 'Phở Bò Đặc Biệt', quantity: 2, price: 170000 },
      { name: 'Bánh Mì Thịt Nướng', quantity: 1, price: 35000 },
    ],
    orderTime: '21:30 15/01/2024',
    deliveryTime: '22:15 15/01/2024',
    total: 205000,
    status: 'delivered',
    rating: 5,
    review: 'Phở rất ngon, nước dùng đậm đà. Bánh mì giòn rum, thịt nướng tham lừng. Sẽ đặt lại!',
  },
  {
    id: '2',
    orderId: 'ORD003',
    restaurantName: 'Sushi Tokyo',
    restaurantImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXRlfGVufDF8fHx8MTc2MTIzMjAwMHww&ixlib=rb-4.1.0&q=80&w=400',
    items: [
      { name: 'Sushi Set A', quantity: 1, price: 350000 },
      { name: 'Sashimi Cá Hồi', quantity: 1, price: 280000 },
    ],
    orderTime: '19:20 18/01/2024',
    deliveryTime: '20:30 18/01/2024',
    total: 655000,
    status: 'delivered',
    rating: 0,
  },
  {
    id: '3',
    orderId: 'ORD005',
    restaurantName: 'Bún Bò Huế Mỹ Tho',
    restaurantImage: 'https://images.unsplash.com/photo-1745817095847-625ab76756a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMGRpc2h8ZW58MXx8fHwxNzYxMTM2OTA5fDA&ixlib=rb-4.1.0&q=80&w=400',
    items: [
      { name: 'Bún Bò Huế', quantity: 2, price: 120000 },
      { name: 'Chả Giò', quantity: 1, price: 45000 },
    ],
    orderTime: '12:10 20/01/2024',
    deliveryTime: '13:05 20/01/2024',
    total: 165000,
    status: 'delivering',
  },
  {
    id: '4',
    orderId: 'ORD006',
    restaurantName: 'Cơm Tấm Sài Gòn',
    restaurantImage: 'https://images.unsplash.com/photo-1600289031464-74d374b64991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZGlzaCUyMGFzaWFufGVufDF8fHx8MTc2MTEwNDc0Mnww&ixlib=rb-4.1.0&q=80&w=400',
    items: [
      { name: 'Cơm Tấm Sườn', quantity: 3, price: 135000 },
    ],
    orderTime: '18:45 21/01/2024',
    deliveryTime: '19:30 21/01/2024',
    total: 135000,
    status: 'delivering',
  },
  {
    id: '5',
    orderId: 'ORD002',
    restaurantName: 'Bánh Mì 362',
    restaurantImage: 'https://images.unsplash.com/photo-1715924298872-9a86b729eb96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5oJTIwbWklMjBzYW5kd2ljaHxlbnwxfHx8fDE3NjEwNDg5MjZ8MA&ixlib=rb-4.1.0&q=80&w=400',
    items: [
      { name: 'Bánh Mì Thịt', quantity: 4, price: 100000 },
    ],
    orderTime: '07:15 16/01/2024',
    deliveryTime: '',
    total: 100000,
    status: 'cancelled',
  },
];


export function MyOrdersPage({ onBack }: MyOrdersPageProps) {
  const [activeTab, setActiveTab] = useState<'delivered' | 'delivering' | 'cancelled'>('delivered');

  const deliveredOrders = mockOrders.filter(order => order.status === 'delivered');
  const deliveringOrders = mockOrders.filter(order => order.status === 'delivering');
  const cancelledOrders = mockOrders.filter(order => order.status === 'cancelled');

  const OrderCard = ({ order }: { order: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderId}>Mã đơn: {order.orderId}</Text>
        </View>
        {order.status === 'delivered' && (
          <View style={styles.badge}>
            <Package size={12} color="#065f46" />
            <Text style={styles.badgeText}>Đã giao hàng</Text>
          </View>
        )}
      </View>

      <View style={{ marginBottom: 8 }}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text>{item.name} x{item.quantity}</Text>
            <Text>{item.price.toLocaleString('vi-VN')}đ</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text>Tổng: <Text style={{ color: '#FF6900' }}>{order.total.toLocaleString('vi-VN')}đ</Text></Text>
        </View>
        {order.status === 'delivered' && (
          <TouchableOpacity style={styles.button}>
            <Text style={{ color: 'white' }}>Đặt lại</Text>
          </TouchableOpacity>
        )}
      </View>

      {order.review && (
        <Text style={styles.review}>"{order.review}"</Text>
      )}
    </View>
  );

  const renderOrders = () => {
    let orders: Order[] = [];
    if (activeTab === 'delivered') orders = deliveredOrders;
    if (activeTab === 'delivering') orders = deliveringOrders;
    if (activeTab === 'cancelled') orders = cancelledOrders;

    if (orders.length === 0) return (
      <View style={styles.emptyContainer}>
        {activeTab === 'delivered' && <Package size={64} color="#d1d5db" />}
        {activeTab === 'delivering' && <Calendar size={64} color="#d1d5db" />}
        {activeTab === 'cancelled' && <X size={64} color="#d1d5db" />}
        <Text style={styles.emptyText}>
          {activeTab === 'delivered' && 'Chưa có đơn hàng nào đã giao'}
          {activeTab === 'delivering' && 'Chưa có đơn hàng nào đang giao'}
          {activeTab === 'cancelled' && 'Chưa có đơn hàng nào bị hủy'}
        </Text>
      </View>
    );

    return orders.map(order => <OrderCard key={order.id} order={order} />);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>

      <View style={styles.tabs}>
        {['delivered', 'delivering', 'cancelled'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text style={{ color: activeTab === tab ? '#111827' : '#6b7280', fontWeight: '500' }}>
              {tab === 'delivered' && `Đã giao (${deliveredOrders.length})`}
              {tab === 'delivering' && `Đang giao (${deliveringOrders.length})`}
              {tab === 'cancelled' && `Đã hủy (${cancelledOrders.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        {renderOrders()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  headerTitle: { marginLeft: 8, fontSize: 18, fontWeight: '600', color: '#111827' },
  tabs: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 8 },
  tabButton: { flex: 1, padding: 8, marginHorizontal: 4, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center' },
  tabButtonActive: { backgroundColor: 'white' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  restaurantImage: { width: 56, height: 56, borderRadius: 8 },
  restaurantName: { fontWeight: '600', fontSize: 16, color: '#111827' },
  orderId: { fontSize: 12, color: '#6b7280' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, backgroundColor: '#d1fae5', marginLeft: 8 },
  badgeText: { color: '#065f46', fontSize: 10, marginLeft: 2 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  button: { backgroundColor: '#FF6900', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  review: { marginTop: 8, fontStyle: 'italic', color: '#6b7280' },
  emptyContainer: { alignItems: 'center', padding: 32 },
  emptyText: { marginTop: 8, color: '#6b7280', textAlign: 'center' },
});
