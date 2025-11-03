// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import Svg, { Path } from "react-native-svg";
// import { useNavigation } from "@react-navigation/native";
// import {
//   Loader2,
//   Phone,
//   ArrowLeft,
//   Check,
//   XCircle,
//   ShieldCheck,
// } from "lucide-react-native"; // lucide-react-native cho RN
// // import { Logo } from "../components/Logo";
// // import { useAuth } from "../contexts/AuthContext";

// export default function PhoneVerification() {
//   const navigation = useNavigation();
// //   const { state } = useAuth();

//   const [phone, setPhone] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [otpError, setOtpError] = useState("");
//   const [otpMessage, setOtpMessage] = useState("");

//   const phoneRef = useRef<TextInput>(null);

// //   useEffect(() => {
// //     if (state.isAuthenticated) {
// //       const redirectPath = "/"; // Expo: navigation.navigate('ScreenName')
// //       navigation.reset({ index: 0, routes: [{ name: redirectPath }] });
// //     }
// //   }, [state.isAuthenticated]);

//   const hosts = ["/apiLocal"];

//   const fetchWithTimeout = (url: string, options: any, timeout = 5000) => {
//     return Promise.race([
//       fetch(url, options),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error("Timeout")), timeout)
//       ),
//     ]);
//   };

// //   const tryHosts = async (path: string, payload: any) => {
// //     const promises = hosts.map((host) =>
// //       fetchWithTimeout(`${host}${path}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       })
// //         .then((res) => {
// //           if (!res.ok) throw new Error(`Server ${host} trả lỗi`);
// //           return res.json().then((data) => ({ data, host }));
// //         })
// //         .catch((err) => {
// //           console.warn(err.message);
// //           return Promise.reject();
// //         })
// //     );

// //     return Promise.any(promises);
// //   };

//   const handleChange = (value: string) => {
//     setPhone(value);
//     const phoneRegex = /^0\d{9}$/;

//     if (!value) setPhoneError("");
//     else if (!value.startsWith("0"))
//       setPhoneError("Số điện thoại phải bắt đầu bằng 0");
//     else if (value.length > 10)
//       setPhoneError("Số điện thoại không được quá 10 số");
//     else if (!phoneRegex.test(value))
//       setPhoneError("Số điện thoại phải có đúng 10 chữ số");
//     else setPhoneError("");
//   };

//   const startCountdown = () => setCountdown(60);

//   useEffect(() => {
//     if (countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const handleSendOtp = async () => {
//     const normalizedPhone = phone.trim();
//     if (!normalizedPhone || phoneError || normalizedPhone.length !== 10) {
//       setPhoneError("Vui lòng nhập số điện thoại hợp lệ!");
//       phoneRef.current?.focus();
//       return;
//     }

//     setLoading(true);
//     setPhoneError("");
//     setOtpError("");
//     setOtpMessage("");

//     try {
//       const { data, host } = await tryHosts("/otp/send", {
//         phone: normalizedPhone,
//       });

//       if (data.success) {
//         setOtpSent(true);
//         setOtpMessage(`Đã gửi mã OTP thành công đến số điện thoại ${phone}!`);
//         startCountdown();
//       } else {
//         setOtpError(data.message || "Không thể gửi OTP!");
//       }
//     } catch (err) {
//       console.error("Lỗi fetch:", err);
//       setOtpError("Không thể kết nối server!");
//       phoneRef.current?.focus();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp.trim()) {
//       setOtpError("Vui lòng nhập mã OTP!");
//       return;
//     }

//     setLoading(true);
//     setOtpError("");
//     setOtpMessage("");

//     try {
//       const { data } = await tryHosts("/otp/verify", { phone, otp });

//       if (data.success) {
//         setOtpError("");
//         setOtpMessage("Xác minh thành công!");
//         setTimeout(() => navigation.navigate("Register", { phone }), 500);
//       } else {
//         setOtpError(data.message || "OTP không đúng!");
//       }
//     } catch (err) {
//       console.error("Lỗi fetch:", err);
//       setOtpError("Không thể kết nối server!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       <TouchableOpacity
//         style={styles.backBtn}
//         onPress={() => navigation.navigate("Login")}
//       >
//         <ArrowLeft size={16} color="#4B5563" />
//         <Text style={styles.backText}>Quay lại đăng nhập</Text>
//       </TouchableOpacity>

//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.logoWrapper}>
//             <Logo size="lg" />
//           </View>
//           <Text style={styles.title}>Xác minh số điện thoại</Text>
//           <Text style={styles.description}>
//             Vui lòng xác nhận số điện thoại để tiếp tục đăng ký tài khoản
//           </Text>
//         </View>

//         <View style={styles.cardContent}>
//           {/* Phone input */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Số điện thoại *</Text>
//             <View style={styles.inputWrapper}>
//               <Phone size={16} color="#9CA3AF" style={styles.icon} />
//               <TextInput
//                 ref={phoneRef}
//                 style={[
//                   styles.input,
//                   phoneError
//                     ? styles.errorBorder
//                     : phone.length === 10
//                     ? styles.successBorder
//                     : styles.defaultBorder,
//                 ]}
//                 placeholder="Nhập số điện thoại (VD: 0987...)"
//                 keyboardType="phone-pad"
//                 value={phone}
//                 onChangeText={handleChange}
//                 editable={!otpSent}
//               />
//               {phoneError ? (
//                 <XCircle size={16} color="red" style={styles.rightIcon} />
//               ) : (
//                 phone.length === 10 && (
//                   <Check size={16} color="green" style={styles.rightIcon} />
//                 )
//               )}
//             </View>
//             {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
//           </View>

//           {/* OTP input */}
//           {otpSent && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Mã OTP</Text>
//               <View style={styles.inputWrapper}>
//                 <ShieldCheck size={16} color="#9CA3AF" style={styles.icon} />
//                 <TextInput
//                   style={[
//                     styles.input,
//                     otpError
//                       ? styles.errorBorder
//                       : otp.length > 0
//                       ? styles.successBorder
//                       : styles.defaultBorder,
//                   ]}
//                   placeholder="Nhập mã OTP"
//                   value={otp}
//                   onChangeText={(text) => {
//                     setOtp(text);
//                     setOtpError("");
//                   }}
//                 />
//                 {otpError && <XCircle size={16} color="red" style={styles.rightIcon} />}
//               </View>
//               {otpError && <Text style={styles.errorText}>{otpError}</Text>}
//               {otpMessage && !otpError && <Text style={styles.successText}>{otpMessage}</Text>}
//               {countdown > 0 && (
//                 <Text style={styles.countdownText}>
//                   Bạn có thể gửi lại OTP sau {countdown}s
//                 </Text>
//               )}
//             </View>
//           )}

//           {/* Buttons */}
//           {!otpSent ? (
//             <TouchableOpacity
//               style={[styles.button, styles.orangeBtn]}
//               onPress={handleSendOtp}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <ActivityIndicator color="white" style={{ marginRight: 8 }} />
//                   <Text style={styles.buttonText}>Đang gửi OTP...</Text>
//                 </>
//               ) : (
//                 <Text style={styles.buttonText}>Gửi OTP</Text>
//               )}
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 countdown === 0 ? styles.orangeBtn : styles.greenBtn,
//               ]}
//               onPress={countdown === 0 ? handleSendOtp : handleVerifyOtp}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <ActivityIndicator color="white" style={{ marginRight: 8 }} />
//                   <Text style={styles.buttonText}>
//                     {countdown === 0 ? "Đang gửi OTP..." : "Đang xác minh..."}
//                   </Text>
//                 </>
//               ) : (
//                 <Text style={styles.buttonText}>
//                   {countdown === 0 ? "Gửi lại OTP" : "Xác minh OTP"}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Footer */}
//         <View style={styles.cardFooter}>
//           <Text style={styles.footerText}>Đã có tài khoản? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//             <Text style={styles.loginLink}>Đăng nhập ngay</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFF7ED",
//     padding: 16,
//   },
//   backBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   backText: { marginLeft: 4, color: "#4B5563" },
//   card: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "white",
//     borderRadius: 24,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   cardHeader: { alignItems: "center", marginBottom: 16 },
//   logoWrapper: {
//     width: 80,
//     height: 80,
//     borderRadius: 24,
//     backgroundColor: "#FDBA74",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
//   description: { fontSize: 14, color: "#6B7280", textAlign: "center" },
//   cardContent: {},
//   inputGroup: { marginBottom: 12 },
//   label: { marginBottom: 4, color: "#111827" },
//   inputWrapper: { flexDirection: "row", alignItems: "center", position: "relative" },
//   icon: { position: "absolute", left: 8 },
//   rightIcon: { position: "absolute", right: 8 },
//   input: {
//     flex: 1,
//     height: 48,
//     paddingLeft: 32,
//     paddingRight: 32,
//     borderWidth: 1,
//     borderRadius: 16,
//     backgroundColor: "#F9FAFB",
//   },
//   defaultBorder: { borderColor: "#D1D5DB" },
//   errorBorder: { borderColor: "red" },
//   successBorder: { borderColor: "green" },
//   errorText: { fontSize: 12, color: "red", marginTop: 2 },
//   successText: { fontSize: 12, color: "green", marginTop: 2 },
//   countdownText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//   button: {
//     height: 48,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//     marginTop: 8,
//   },
//   orangeBtn: { backgroundColor: "#F97316" },
//   greenBtn: { backgroundColor: "#16A34A" },
//   buttonText: { color: "white", fontWeight: "bold" },
//   cardFooter: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
//   footerText: { color: "#6B7280" },
//   loginLink: { color: "#F97316", fontWeight: "bold", marginLeft: 2 },
// });
