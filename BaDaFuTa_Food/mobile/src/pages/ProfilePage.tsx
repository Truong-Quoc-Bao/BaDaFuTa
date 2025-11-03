import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { User, MapPin, Phone, Mail, Heart, Settings, HelpCircle, LogOut, ChevronRight, Package } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';

interface ProfilePageProps {
  onLogout?: () => void;
  onMyOrdersClick?: () => void;
  onSettingsClick?: () => void;
  onEditProfileClick?: () => void;
}

export function ProfilePage({ onLogout, onMyOrdersClick, onSettingsClick, onEditProfileClick }: ProfilePageProps) {
  const menuItems = [
    {
      id: 'orders',
      label: 'Đơn hàng của tôi',
      icon: Package,
      onClick: onMyOrdersClick || (() => console.log('Navigate to my orders')),
    },
    {
      id: 'address',
      label: 'Địa chỉ giao hàng',
      icon: MapPin,
      onClick: () => console.log('Navigate to addresses'),
    },
    {
      id: 'favorites',
      label: 'Món ăn yêu thích',
      icon: Heart,
      onClick: () => console.log('Navigate to favorites'),
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      onClick: onSettingsClick || (() => console.log('Navigate to settings')),
    },
    {
      id: 'help',
      label: 'Trợ giúp & Hỗ trợ',
      icon: HelpCircle,
      onClick: () => console.log('Navigate to help'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Header */}
      <View style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 20, color: '#111' }}>Tài khoản</Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Profile Header */}
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Avatar style={{ width: 64, height: 64, borderRadius: 32 }}>
              {/* <AvatarImage source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbnKh0J_lvzOoGZa18FS_B_8GD07ZVLKupYg&s' }} /> */}
              <AvatarImage/>
              <AvatarFallback style={{ backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center', width: 64, height: 64, borderRadius: 32 }}>
                <User size={32} color="#FF6900" />
              </AvatarFallback>
            </Avatar>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 16, color: '#111', marginBottom: 4 }}>Khách hàng</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Thành viên mới</Text>
            </View>

            <TouchableOpacity onPress={onEditProfileClick}>
              <Text style={{ fontSize: 14, color: '#FF6900' }}>Sửa</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 }} />


          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Phone size={16} color="#9CA3AF" />
              <Text style={{ color: '#4B5563', fontSize: 14 }}>0123 456 789</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Mail size={16} color="#9CA3AF" />
              <Text style={{ color: '#4B5563', fontSize: 14 }}>customer@example.com</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={{ color: '#FF6900', marginBottom: 4 }}>12</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Đơn hàng</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={{ color: '#FF6900', marginBottom: 4 }}>8</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Yêu thích</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
            <Text style={{ color: '#FF6900', marginBottom: 4 }}>50K</Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Điểm thưởng</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <View key={item.id}>
                <TouchableOpacity onPress={item.onClick} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'space-between' }}>
                  <Icon size={20} color="#9CA3AF" />
                  <Text style={{ flex: 1, marginLeft: 12, color: '#374151', fontSize: 14 }}>{item.label}</Text>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
                {index < menuItems.length - 1 && <Separator />}
              </View>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={onLogout} style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center' }}>
          <LogOut size={20} color="#FF6900" />
          <Text style={{ color: '#FF6900', marginLeft: 8 }}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Phiên bản 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
