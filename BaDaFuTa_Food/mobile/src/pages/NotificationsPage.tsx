import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Tag, Truck, Star } from 'lucide-react-native';

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng đang được giao',
    message: 'Đơn hàng #DH001 của bạn đang trên đường giao đến. Dự kiến 15 phút nữa.',
    time: '10 phút trước',
    isRead: false,
  },
  {
    id: '2',
    type: 'promotion',
    title: 'Giảm 30% cho đơn hàng tiếp theo',
    message: 'Sử dụng mã HAPPYDAY để được giảm 30% cho đơn hàng từ 100k. Áp dụng đến hết 25/10.',
    time: '2 giờ trước',
    isRead: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Đơn hàng đã hoàn thành',
    message: 'Đơn hàng #DH002 đã được giao thành công. Cảm ơn bạn đã tin tưởng!',
    time: '2 ngày trước',
    isRead: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Đánh giá đơn hàng',
    message: 'Hãy cho chúng tôi biết trải nghiệm của bạn với đơn hàng #DH002 nhé!',
    time: '2 ngày trước',
    isRead: true,
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Miễn phí ship cuối tuần',
    message: 'Tất cả đơn hàng vào Thứ 7 & Chủ nhật được miễn phí giao hàng!',
    time: '5 ngày trước',
    isRead: true,
  },
];

const typeConfig = {
  order: { icon: Truck, bgColor: '#DBEAFE', iconColor: '#2563EB' },
  promotion: { icon: Tag, bgColor: '#FFEDD5', iconColor: '#D97706' },
  system: { icon: Star, bgColor: '#EDE9FE', iconColor: '#7C3AED' },
};

export const NotificationsPage: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {/* Notifications List */}
      {mockNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={64} color="#D1D5DB" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
          <Text style={styles.emptyText}>Các thông báo mới sẽ hiển thị ở đây</Text>
        </View>
      ) : (
        mockNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;
          return (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationCard}
              activeOpacity={0.7}
            >
              <View style={styles.notificationContent}>
                <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
                  <Icon size={20} color={config.iconColor} />
                </View>

                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text style={styles.time}>{notification.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  emptyContainer: { padding: 32, alignItems: 'center' },
  emptyTitle: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  emptyText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  notificationContent: { flexDirection: 'row', gap: 12 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  textContainer: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6900', marginLeft: 6 },
  message: { fontSize: 12, color: '#4B5563', marginBottom: 4 },
  time: { fontSize: 10, color: '#9CA3AF' },
});
