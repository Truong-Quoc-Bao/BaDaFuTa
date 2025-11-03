import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MapPin, Phone, User } from 'lucide-react-native';

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  note: string;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => void;
  total: number;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ isOpen, onClose, onConfirm, total }) => {
  const [formData, setFormData] = useState<OrderData>({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const handleSubmit = () => {
    if (formData.name && formData.phone && formData.address) {
      onConfirm(formData);
      setFormData({ name: '', phone: '', address: '', note: '' });
      onClose();
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Thông tin đặt hàng</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Name */}
            <View style={styles.field}>
              <View style={styles.label}>
                <User size={16} color="#374151" />
                <Text style={styles.labelText}>Họ và tên</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Phone */}
            <View style={styles.field}>
              <View style={styles.label}>
                <Phone size={16} color="#374151" />
                <Text style={styles.labelText}>Số điện thoại</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />
            </View>

            {/* Address */}
            <View style={styles.field}>
              <View style={styles.label}>
                <MapPin size={16} color="#374151" />
                <Text style={styles.labelText}>Địa chỉ giao hàng</Text>
              </View>
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Nhập địa chỉ giao hàng"
                value={formData.address}
                multiline
                onChangeText={(text) => setFormData({ ...formData, address: text })}
              />
            </View>

            {/* Note */}
            <View style={styles.field}>
              <Text style={styles.labelText}>Ghi chú (không bắt buộc)</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                placeholder="Ghi chú đơn hàng"
                value={formData.note}
                multiline
                onChangeText={(text) => setFormData({ ...formData, note: text })}
              />
            </View>

            {/* Total & Buttons */}
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Tổng thanh toán</Text>
                <Text style={styles.totalPrice}>{total.toLocaleString('vi-VN')}đ</Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSubmit}>
                  <Text style={styles.confirmText}>Xác nhận đặt hàng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
    textAlign: 'center',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  labelText: {
    fontSize: 14,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  footer: {
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 16,
    color: '#374151',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6900',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#FF6900',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
