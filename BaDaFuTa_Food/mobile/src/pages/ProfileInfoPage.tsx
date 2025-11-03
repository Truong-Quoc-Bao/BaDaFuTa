import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, User, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectItem } from '../components/ui/select';

interface ProfileInfoPageProps {
  onBack: () => void;
}

export function ProfileInfoPage({ onBack }: ProfileInfoPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0123456789',
    birthDate: '1/1/1990',
    address: 'Chưa cập nhật',
    gender: 'Nam',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Đã cập nhật thông tin cá nhân');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBack}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quay lại</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.gridContainer}>
          {/* Left Card */}
          <View style={styles.leftCard}>
            <View style={styles.profileCenter}>
              <Avatar style={styles.avatar}>
                <AvatarImage
                  // source={{ uri: 'https://example.com/avatar.jpg' }}
                  style={styles.avatar}
                />
                <AvatarFallback style={styles.avatarFallback}>
                  <User size={32} color="#FF6900" />
                </AvatarFallback>
              </Avatar>

              <Text style={styles.name}>Nguyễn Văn A</Text>
              <Text style={styles.email}>user@example.com</Text>

              <Badge style={styles.badge}>Khách hàng</Badge>

              <View style={styles.separator} />

              <Text style={styles.unfid}>UNFID: user001</Text>
            </View>
          </View>

          {/* Right Card */}
          <View style={styles.rightCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              {!isEditing ? (
                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  <Edit size={16} color="#000" />
                  <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={{ color: 'white' }}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {!isEditing ? (
              <View style={styles.infoGrid}>
                {/* Full Name */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <User size={16} />
                    <Text style={styles.infoLabelText}>Họ và tên</Text>
                  </View>
                  <Text style={styles.infoValue}>{formData.fullName}</Text>
                </View>

                {/* Email */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Mail size={16} />
                    <Text style={styles.infoLabelText}>Email</Text>
                  </View>
                  <Text style={styles.infoValue}>{formData.email}</Text>
                </View>

                {/* Phone */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Phone size={16} />
                    <Text style={styles.infoLabelText}>Số điện thoại</Text>
                  </View>
                  <Text style={styles.infoValue}>{formData.phone}</Text>
                </View>

                {/* Birth Date */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Calendar size={16} />
                    <Text style={styles.infoLabelText}>Ngày sinh</Text>
                  </View>
                  <Text style={styles.infoValue}>{formData.birthDate}</Text>
                </View>

                {/* Address */}
                <View style={[styles.infoItem, { flex: 1 }]}>
                  <View style={styles.infoLabel}>
                    <MapPin size={16} />
                    <Text style={styles.infoLabelText}>Địa chỉ</Text>
                  </View>
                  <Text style={styles.infoValue}>{formData.address}</Text>
                </View>

                {/* Gender */}
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabelText}>Giới tính</Text>
                  <Text style={styles.infoValue}>{formData.gender}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.infoGrid}>
                {/* Full Name */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <User size={16} />
                    <Text>Họ và tên</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  />
                </View>

                {/* Email */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Mail size={16} />
                    <Text>Email</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>

                {/* Phone */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Phone size={16} />
                    <Text>Số điện thoại</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  />
                </View>

                {/* Birth Date */}
                <View style={styles.infoItem}>
                  <View style={styles.infoLabel}>
                    <Calendar size={16} />
                    <Text>Ngày sinh</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.birthDate}
                    onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                    placeholder="dd/mm/yyyy"
                  />
                </View>

                {/* Address */}
                <View style={[styles.infoItem, { flex: 1 }]}>
                  <View style={styles.infoLabel}>
                    <MapPin size={16} />
                    <Text>Địa chỉ</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </View>

                {/* Gender */}
                <View style={styles.infoItem}>
                  <Text>Giới tính</Text>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </Select>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerBack: { padding: 8 },
  headerTitle: { fontSize: 18, marginLeft: 8 },
  content: { padding: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  leftCard: { flexBasis: 320, backgroundColor: 'white', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  profileCenter: { alignItems: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 16 },
  avatarFallback: { backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center', width: 96, height: 96, borderRadius: 48 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  badge: { backgroundColor: '#F3F4F6', color: '#374151', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 16 },
  separator: { height: 1, backgroundColor: '#E5E7EB', width: '100%', marginVertical: 16 },
  unfid: { fontSize: 12, color: '#6B7280' },
  rightCard: { flex: 1, backgroundColor: 'white', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editButtonText: { color: '#FF6900' },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6 },
  saveButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FF6900', borderRadius: 6 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { flexBasis: '48%', marginBottom: 16 },
  infoLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  infoLabelText: { fontSize: 12, color: '#6B7280' },
  infoValue: { paddingLeft: 24, fontSize: 14, color: '#111827' },
  input: { backgroundColor: '#F9FAFB', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#D1D5DB' },
});
