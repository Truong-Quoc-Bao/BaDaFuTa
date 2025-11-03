import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert as RNAlert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutPageProps {
  onBack: () => void;
  cartItems: CartItem[];
  onOrderComplete?: () => void;
}

export function CheckoutPage({ onBack, cartItems, onOrderComplete }: CheckoutPageProps) {
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'ewallet'>('cash');

  // Load saved delivery info
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('deliveryInfo');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDeliveryInfo({
            fullName: parsed.fullName || '',
            phone: parsed.phone || '',
            address: parsed.address || '',
            note: '',
          });
        } catch {}
      }
    })();
  }, []);

  // Totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'cash', label: 'Tiền mặt', icon: 'cash' },
    { id: 'card', label: 'Thẻ tín dụng/ghi nợ', icon: 'credit-card' },
    { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: 'bank' },
    { id: 'ewallet', label: 'Ví điện tử', icon: 'wallet' },
  ];
  
 
  
  
  const handleCheckout = () => {
    if (!deliveryInfo.fullName) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập họ và tên' });
      return;
    }
    if (!deliveryInfo.phone) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập số điện thoại' });
      return;
    }
    if (!deliveryInfo.address) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập địa chỉ giao hàng' });
      return;
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(deliveryInfo.phone.replace(/\s/g, ''))) {
      Toast.show({ type: 'error', text1: 'Số điện thoại không hợp lệ' });
      return;
    }

    RNAlert.alert(
      'Xác nhận đơn hàng',
      'Bạn có chắc chắn muốn đặt hàng với thông tin này không?',
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Đặt hàng ngay',
          onPress: async () => {
            await AsyncStorage.setItem(
              'deliveryInfo',
              JSON.stringify({
                fullName: deliveryInfo.fullName,
                phone: deliveryInfo.phone,
                address: deliveryInfo.address,
              })
            );
            Toast.show({ type: 'success', text1: 'Đặt hàng thành công!' });
            onOrderComplete?.();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (deliveryInfo.fullName || deliveryInfo.phone || deliveryInfo.address) {
      RNAlert.alert(
        'Hủy đơn hàng?',
        'Thông tin bạn đã nhập sẽ không được lưu. Bạn có chắc chắn muốn hủy đơn hàng này không?',
        [
          { text: 'Tiếp tục đặt hàng', style: 'cancel' },
          { text: 'Hủy đơn hàng', style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      onBack();
    }
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Icon name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thanh toán</Text>
        </View>
        <View style={styles.emptyCart}>
          <Text style={{ fontSize: 60 }}>🛒</Text>
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubText}>Thêm món ăn để tiếp tục đặt hàng</Text>
          <TouchableOpacity style={styles.button} onPress={onBack}>
            <Text style={styles.buttonText}>Quay lại trang chủ</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <Icon name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thanh toán</Text>
          </View>

          {/* Delivery Time Alert */}
          <View style={styles.alert}>
            <Icon name="clock-outline" size={16} color="#FF6900" />
            <Text style={styles.alertText}>
              Thời gian giao hàng dự kiến: <Text style={{ color: '#FF6900' }}>30-45 phút</Text>
            </Text>
          </View>

          {/* Order Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Đơn hàng của bạn</Text>
            {cartItems.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text style={styles.cartItemSub}>
                    {item.quantity} x {item.price.toLocaleString('vi-VN')}₫
                  </Text>
                </View>
                <Text>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</Text>
              </View>
            ))}
            <View style={styles.separator} />
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text>Tạm tính</Text>
                <Text>{subtotal.toLocaleString('vi-VN')}₫</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>Phí giao hàng</Text>
                <Text>{deliveryFee.toLocaleString('vi-VN')}₫</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.totalRow}>
                <Text style={{ fontWeight: 'bold' }}>Tổng cộng</Text>
                <Text style={{ color: '#FF6900', fontWeight: 'bold' }}>{total.toLocaleString('vi-VN')}₫</Text>
              </View>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
            <TextInput
              placeholder="Họ và tên"
              value={deliveryInfo.fullName}
              onChangeText={text => setDeliveryInfo({ ...deliveryInfo, fullName: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Số điện thoại"
              value={deliveryInfo.phone}
              keyboardType="phone-pad"
              onChangeText={text => setDeliveryInfo({ ...deliveryInfo, phone: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Địa chỉ chi tiết"
              value={deliveryInfo.address}
              onChangeText={text => setDeliveryInfo({ ...deliveryInfo, address: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Ghi chú thêm cho đơn hàng"
              value={deliveryInfo.note}
              onChangeText={text => setDeliveryInfo({ ...deliveryInfo, note: text })}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </View>

          {/* Payment Method */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phương thức thanh toán</Text>
            {paymentMethods.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    isSelected && { borderColor: '#FF6900', backgroundColor: '#FFF5EF' },
                  ]}
                  // onPress={() => setPaymentMethod(method.id)}
                >
                  <Icon
                    // name={method.icon as string} // ép kiểu cho TypeScript
                    size={24}
                    color={isSelected ? '#FF6900' : '#555'}
                    style={{ width: 30 }}
                  />
                  <Text style={{ flex: 1, fontSize: 16 }}>{method.label}</Text>
                  {isSelected && <Icon name="check-circle" size={20} color="#FF6900" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#fff', borderWidth: 1 }]}
            onPress={handleCancel}
          >
            <Text style={{ color: '#555' }}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCheckout}>
            <Text style={styles.buttonText}>Xác nhận đặt hàng</Text>
          </TouchableOpacity>
        </View>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  emptyCart: { justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  emptySubText: { color: '#888', marginBottom: 16 },
  button: { flex: 1, backgroundColor: '#FF6900', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 4, marginHorizontal: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  alert: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5EF', padding: 8, margin: 16, borderRadius: 6 },
  alertText: { marginLeft: 6, color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 16, marginVertical: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  cartItemSub: { color: '#555', fontSize: 12 },
  separator: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginVertical: 8 },
  totals: { paddingVertical: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 8, marginVertical: 4, backgroundColor: '#F3F4F6' },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 6, marginVertical: 4 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
});
