import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch as RNSwitch } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  // Notification settings
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);

  // Display settings
  const [language, setLanguage] = useState('vi');
  const [currency, setCurrency] = useState('vnd');
  const [theme, setTheme] = useState('light');

  // Security settings
  const [savePayment, setSavePayment] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.headerTitle}>Cài đặt</Text>
          <Text style={styles.headerSubtitle}>Tùy chỉnh trải nghiệm sử dụng ứng dụng</Text>
        </View>
      </View>

      <View style={styles.section}>
        {/* Notifications Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <Ionicons name="notifications-outline" size={20} color="#FF6900" />
            </View>
            <Text style={styles.sectionTitle}>Thông báo</Text>
          </View>

          {/* Order Updates */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Cập nhật đơn hàng</Text>
              <Text style={styles.subText}>Nhận thông báo về trạng thái đơn hàng</Text>
            </View>
            <RNSwitch value={orderUpdates} onValueChange={setOrderUpdates} />
          </View>

          <View style={styles.separator} />

          {/* Promotions */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Khuyến mại & Ưu đãi</Text>
              <Text style={styles.subText}>Nhận thông báo về các chương trình khuyến mại</Text>
            </View>
            <RNSwitch value={promotions} onValueChange={setPromotions} />
          </View>

          <View style={styles.separator} />

          {/* Email Notifications */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Thông báo Email</Text>
              <Text style={styles.subText}>Nhận thông báo qua email</Text>
            </View>
            <RNSwitch value={emailNotifications} onValueChange={setEmailNotifications} />
          </View>

          <View style={styles.separator} />

          {/* SMS Notifications */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Thông báo SMS</Text>
              <Text style={styles.subText}>Nhận thông báo qua tin nhắn</Text>
            </View>
            <RNSwitch value={smsNotifications} onValueChange={setSmsNotifications} />
          </View>
        </View>

        {/* Display Options Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <FontAwesome5 name="globe" size={16} color="#FF6900" />
            </View>
            <Text style={styles.sectionTitle}>Tùy chọn hiển thị</Text>
          </View>

          {/* Language */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Ngôn ngữ</Text>
              <Text style={styles.subText}>Chọn ngôn ngữ hiển thị</Text>
            </View>
            <TouchableOpacity onPress={() => setLanguage(language === 'vi' ? 'en' : 'vi')} style={styles.selectBox}>
              <Text>{language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {/* Currency */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Tiền tệ</Text>
              <Text style={styles.subText}>Đơn vị tiền tệ hiển thị</Text>
            </View>
            <TouchableOpacity onPress={() => setCurrency(currency === 'vnd' ? 'usd' : 'vnd')} style={styles.selectBox}>
              <Text>{currency === 'vnd' ? 'VND (₫)' : 'USD ($)'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {/* Theme */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Giao diện</Text>
              <Text style={styles.subText}>Chọn chế độ hiển thị</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light')
              }
              style={styles.selectBox}
            >
              <Text>{theme === 'light' ? 'Sáng' : theme === 'dark' ? 'Tối' : 'Tự động'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Privacy Section */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBg}>
              <MaterialIcons name="security" size={20} color="#FF6900" />
            </View>
            <Text style={styles.sectionTitle}>Bảo mật & Quyền riêng tư</Text>
          </View>

          {/* Save Payment */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Lưu phương thức thanh toán</Text>
              <Text style={styles.subText}>Lưu thẻ và ví điện tử để thanh toán nhanh</Text>
            </View>
            <RNSwitch value={savePayment} onValueChange={setSavePayment} />
          </View>

          <View style={styles.separator} />

          {/* Share Location */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Chia sẻ vị trí</Text>
              <Text style={styles.subText}>Cho phép ứng dụng truy cập vị trí để giao hàng</Text>
            </View>
            <RNSwitch value={shareLocation} onValueChange={setShareLocation} />
          </View>

          <View style={styles.separator} />

          {/* Biometric */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.label}>Xác thức sinh trắc</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Sắp có</Text>
                </View>
              </View>
              <Text style={styles.subText}>Sử dụng vân tay hoặc Face ID để đăng nhập</Text>
            </View>
            <RNSwitch value={biometric} onValueChange={setBiometric} disabled />
          </View>

          <View style={styles.separator} />

          {/* Two-Factor */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.label}>Xác thực 2 bước</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Sắp có</Text>
                </View>
              </View>
              <Text style={styles.subText}>Thêm lớp bảo mật bằng mã OTP</Text>
            </View>
            <RNSwitch value={twoFactor} onValueChange={setTwoFactor} disabled />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280' },
  section: { padding: 16 },
  sectionBox: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBg: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFE8D6', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  subText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  selectBox: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  badge: { backgroundColor: '#F3F4F6', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  badgeText: { fontSize: 10, color: '#6B7280' },
});
