import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { User, Phone, Mail, Lock, Eye, EyeOff, Target } from 'lucide-react-native';
import { toast } from 'sonner';
import Svg, { Path } from 'react-native-svg';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onLoginClick: () => void;
}

export function SignupPage({ onSignupSuccess, onLoginClick }: SignupPageProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    toast.success('Đăng ký thành công!');
    onSignupSuccess();
  };

  const handleGoogleSignup = () => {
    toast.success('Đăng ký bằng Google thành công!');
    onSignupSuccess();
  };

  const handleFacebookSignup = () => {
    toast.success('Đăng ký bằng Facebook thành công!');
    onSignupSuccess();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Target size={40} color="white" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản BADAFUTA mới</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và tên <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập họ và tên đầy đủ"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập địa chỉ email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, { paddingRight: 40 }]}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupBtnText}>Đăng ký</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          {/* Google Signup */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleSignup}>
            <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </Svg>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          {/* Facebook Signup */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleFacebookSignup}>
            <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
              <Path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </Svg>
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          Bằng việc đăng kí, bạn đã đồng ý với BaDaFuTaFood về{' '}
          <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{' '}
          <Text style={styles.linkText}>Chính sách bảo mật</Text>
        </Text>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={{ color: '#6B7280' }}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={onLoginClick}>
            <Text style={styles.linkText}>Đăng nhập ngay.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 16, backgroundColor: '#F3F4F6' },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logo: { backgroundColor: '#FF6900', padding: 16, borderRadius: 24 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', color: '#111827' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#6B7280', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#111827', marginBottom: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, backgroundColor: '#F9FAFB', paddingHorizontal: 12 },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 14 },
  eyeBtn: { position: 'absolute', right: 12 },
  signupBtn: { backgroundColor: '#FF6900', height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  signupBtnText: { color: 'white', fontWeight: '500' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 8, fontSize: 12, color: '#6B7280' },
  termsText: { fontSize: 10, textAlign: 'center', color: '#6B7280', marginTop: 16 },
  linkText: { color: '#FF6900' },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12, // React Native 0.70+ hỗ trợ gap, hoặc dùng marginRight
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
  },
  socialText: {
    fontSize: 14,
    color: '#374151',
  },
});
