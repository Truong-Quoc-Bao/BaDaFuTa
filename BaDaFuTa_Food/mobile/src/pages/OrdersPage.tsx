import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react-native';
import { Button } from '../components/ui/button';
import { CartItem } from '../components/Cart';
import { toast } from 'sonner';

interface OrdersPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const SHIPPING_FEE = 15000;

export function OrdersPage({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart,
  onCheckout 
}: OrdersPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_FEE;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearAll = () => {
    if (cartItems.length === 0) return;
    onClearCart();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB', paddingBottom: 20 }}>
      {/* Header */}
      <View style={{ padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Giỏ hàng của bạn</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Trash2 color="#DC2626" size={16} />
            <Text style={{ fontSize: 12, color: '#DC2626' }}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ padding: 12 }}>
        {cartItems.length === 0 ? (
          <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, alignItems: 'center' }}>
            <ShoppingBag color="#D1D5DB" size={64} />
            <Text style={{ color: '#6B7280', marginTop: 12 }}>Giỏ hàng trống</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Hãy thêm món ăn vào giỏ hàng nhé!</Text>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {/* Cart Items */}
            <View style={{ backgroundColor: 'white', borderRadius: 8, overflow: 'hidden' }}>
              {cartItems.map((item) => (
                <View key={item.id} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    {/* Image */}
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 80, height: 80, borderRadius: 8 }}
                    />

                    {/* Info */}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 4 }}>{item.name}</Text>
                      <View style={{ gap: 2 }}>
                        <Text style={{ color: '#FF6900' }}>{item.price.toLocaleString('vi-VN')}đ</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>= {item.price.toLocaleString('vi-VN')}đ/món</Text>
                      </View>
                    </View>
                  </View>

                  {/* Quantity & Total */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{ width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus color="#4B5563" size={16} />
                      </TouchableOpacity>
                      <Text style={{ width: 32, textAlign: 'center' }}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus color="#4B5563" size={16} />
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ color: '#FF6900' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</Text>
                      <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
                        <Trash2 color="#DC2626" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, gap: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>Tóm tắt đơn hàng</Text>

              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>Tạm tính ({totalItems} món)</Text>
                  <Text style={{ color: '#111827' }}>{subtotal.toLocaleString('vi-VN')}đ</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>Phí giao hàng</Text>
                  <Text style={{ color: '#111827' }}>{SHIPPING_FEE.toLocaleString('vi-VN')}đ</Text>
                </View>

                <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 4, paddingTop: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#111827', fontWeight: '500' }}>Tổng cộng</Text>
                  <Text style={{ color: '#FF6900', fontWeight: '500' }}>{total.toLocaleString('vi-VN')}đ</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onCheckout}
                style={{
                  backgroundColor: '#FF6900',
                  height: 48,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>Tiến hành thanh toán</Text>
              </TouchableOpacity>
{/* 
              <Button 
                onPress={onCheckout}
                style={{ backgroundColor: '#FF6900', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>Tiến hành thanh toán</Text>
              </Button> */}

              <Text style={{ fontSize: 10, textAlign: 'center', color: '#6B7280', marginTop: 4 }}>
                * Giá có thể thay đổi tùy theo chính sách của từng nhà hàng
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
