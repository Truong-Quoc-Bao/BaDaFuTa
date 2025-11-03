import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { User, Lock, Eye, EyeOff, Target } from 'lucide-react-native';
import { toast } from 'sonner';
import Svg, { Path } from 'react-native-svg';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSignupClick: () => void;
}

export function LoginPage({ onLoginSuccess, onSignupClick }: LoginPageProps) {
  const [unfid, setUnfid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!unfid || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    toast.success('Đăng nhập thành công!');
    onLoginSuccess();
  };

  const handleForgotPassword = () => {
    toast.info('Chức năng quên mật khẩu đang được phát triển');
  };

  const handleGoogleLogin = () => {
    toast.success('Đăng nhập bằng Google thành công!');
    onLoginSuccess();
  };

  const handleFacebookLogin = () => {
    toast.success('Đăng nhập bằng Facebook thành công!');
    onLoginSuccess();
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
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Đăng nhập vào tài khoản BADAFUTA của bạn</Text>

        {/* UNFID Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>UNFID</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập UNFID của bạn"
              placeholderTextColor="#9CA3AF" // thêm dòng này
              value={unfid}
              onChangeText={setUnfid}
              style={styles.input}
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9CA3AF" style={styles.icon} />
            <TextInput
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#9CA3AF" // thêm dòng này
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordBtn}
            >
              {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 8 }}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Login */}
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </Svg>
          <Text style={styles.socialBtnText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        {/* Facebook Login */}
        <TouchableOpacity onPress={handleFacebookLogin} style={styles.socialBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <Path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </Svg>
          <Text style={styles.socialBtnText}>Đăng nhập bằng Facebook</Text>
        </TouchableOpacity>

        {/* Signup */}
        <View style={styles.signupContainer}>
          <Text style={{ color: '#6B7280' }}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={onSignupClick}>
            <Text style={{ color: '#FF6900', fontWeight: '500' }}>Đăng ký ngay</Text>
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
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, backgroundColor: '#F9FAFB' },
  icon: { marginLeft: 12, marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 14 },
  showPasswordBtn: { position: 'absolute', right: 12 },
  loginBtn: { backgroundColor: '#FF6900', height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: 'white', fontWeight: '500' },
  forgotPassword: { color: '#FF6900', textAlign: 'center', fontSize: 12 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 8, fontSize: 12, color: '#6B7280' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 16, marginBottom: 12 },
  socialBtnText: { fontSize: 14, color: '#374151' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
});
