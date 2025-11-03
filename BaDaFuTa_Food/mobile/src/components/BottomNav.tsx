import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, ShoppingBag, Bell, User } from 'lucide-react-native';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount?: number;
  notificationCount?: number;
}

const tabs = [
  { id: 'home', name: 'Trang chủ', icon: Home },
  { id: 'orders', name: 'Đơn hàng', icon: ShoppingBag },
  { id: 'notifications', name: 'Thông báo', icon: Bell },
  { id: 'profile', name: 'Cá nhân', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, cartCount = 0, notificationCount = 0 }) => {
  const getBadgeCount = (tabId: string) => {
    if (tabId === 'orders' && cartCount > 0) return cartCount;
    if (tabId === 'notifications' && notificationCount > 0) return notificationCount;
    return 0;
  };

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badgeCount = getBadgeCount(tab.id);

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={styles.tabButton}
          >
            <View style={styles.iconWrapper}>
              <Icon size={24} color={isActive ? '#FF6900' : '#6B7280'} />
              {badgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, { color: isActive ? '#FF6900' : '#6B7280' }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#FF6900',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
