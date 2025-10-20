// 🌍 Tự động lấy địa chỉ theo vị trí hiện tại
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;

//           try {
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//             );
//             const data = await res.json();
//             const fullAddress = data.display_name || "Không xác định";
//             setFormData((prev) => ({ ...prev, address: fullAddress }));
//           } catch (err) {
//             setError("Không thể lấy địa chỉ tự động.");
//           }
//         },
//         (err) => {
//           setError("Không thể lấy vị trí: " + err.message);
//         }
//       );
//     } else {
//       setError("Trình duyệt không hỗ trợ định vị.");
//     }
//   }, []);

// 👤 Khi user có dữ liệu → tự set địa chỉ mặc định
//   useEffect(() => {
//     if (user) {
//       const defaultAddress = {
//         id: 1,
//         full_name: user.full_name,
//         phone: user.phone,
//         address: user.address,
//         note: user.note,
//       };
//       setAddressList([defaultAddress]);
//       setSelectedAddress(defaultAddress);
//     }
//   }, [user]);
