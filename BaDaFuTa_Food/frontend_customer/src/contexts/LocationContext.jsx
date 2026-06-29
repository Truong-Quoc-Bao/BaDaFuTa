// // import { createContext, useContext, useReducer, useEffect } from 'react';

// // const initialState = {
// //   currentLocation: null,
// //   availableLocations: [],
// //   isLoading: false,
// //   error: null,
// // };

// // const locationReducer = (state, action) => {
// //   switch (action.type) {
// //     case 'SET_LOCATION':
// //       return { ...state, currentLocation: action.payload, error: null };
// //     case 'SET_LOADING':
// //       return { ...state, isLoading: action.payload };
// //     case 'SET_ERROR':
// //       return { ...state, error: action.payload, isLoading: false };
// //     case 'SET_AVAILABLE_LOCATIONS':
// //       return { ...state, availableLocations: action.payload };
// //     default:
// //       return state;
// //   }
// // };

// // const LocationContext = createContext(undefined);

// // // Reverse geocoding từ GPS
// // // Tìm lat/lng theo tên xã/phường bằng Nominatim
// // const fetchLatLngFromNominatim = async (wardName, districtName, provinceName) => {
// //   const cacheKey = `latlng_${wardName}_${districtName}_${provinceName}`;
// //   const cached = localStorage.getItem(cacheKey);

// //   if (cached) return JSON.parse(cached);

// //   const query = `${wardName}, ${districtName}, ${provinceName}, Vietnam`;

// //   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
// //     query,
// //   )}`;

// //   try {
// //     const res = await fetch(url, {
// //       headers: { 'User-Agent': 'MyReactApp/2.0' },
// //     });

// //     const json = await res.json();

// //     if (json.length > 0) {
// //       const result = {
// //         lat: parseFloat(json[0].lat),
// //         lng: parseFloat(json[0].lon),
// //       };
// //       localStorage.setItem(cacheKey, JSON.stringify(result));
// //       return result;
// //     }
// //   } catch (err) {
// //     console.error('Lỗi fetch Nominatim:', err);
// //   }

// //   return { lat: 0, lng: 0 };
// // };

// // const getDistrictFromGPS = async (lat, lng) => {
// //   try {
// //     const res = await fetch(
// //       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
// //     );
// //     const data = await res.json();
// //     if (!data.address) throw new Error('Không tìm thấy địa chỉ');

// //     return data.address.city_district || data.address.suburb || data.address.county || null;
// //   } catch (err) {
// //     console.error('Reverse geocode error:', err);
// //     return null;
// //   }
// // };

// // // Load dữ liệu Việt Nam
// // const fetchVietnamData = async () => {
// //   try {
// //     const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
// //     const data = await res.json();
// //     return data;
// //   } catch (err) {
// //     console.error('Lỗi fetch dữ liệu Việt Nam:', err);
// //     return [];
// //   }
// // };

// // // Tính khoảng cách giữa 2 tọa độ
// // const calculateDistance = (lat1, lng1, lat2, lng2) => {
// //   const R = 6371;
// //   const dLat = ((lat2 - lat1) * Math.PI) / 180;
// //   const dLng = ((lng2 - lng1) * Math.PI) / 180;
// //   const a =
// //     Math.sin(dLat / 2) ** 2 +
// //     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   return R * c;
// // };

// // // Tìm xã/phường gần nhất
// // const findNearestLocation = (lat, lng, locations) => {
// //   if (!locations || locations.length === 0) return null;

// //   let nearest = locations[0];
// //   let minDistance = calculateDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);

// //   for (let i = 1; i < locations.length; i++) {
// //     const loc = locations[i];
// //     const dist = calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
// //     if (dist < minDistance) {
// //       nearest = loc;
// //       minDistance = dist;
// //     }
// //   }

// //   return nearest;
// // };

// // export const LocationProvider = ({ children }) => {
// //   const [state, dispatch] = useReducer(locationReducer, initialState);

// //   const setLocation = (location) => {
// //     dispatch({ type: 'SET_LOCATION', payload: location });
// //     localStorage.setItem('badafuta_location', JSON.stringify(location));
// //   };

// //   // Load địa phương Việt Nam
// //   useEffect(() => {
// //     const loadLocations = async () => {
// //       dispatch({ type: 'SET_LOADING', payload: true });

// //       try {
// //         const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
// //         const data = await res.json();

// //         let wardList = [];

// //         for (const province of data) {
// //           for (const district of province.districts) {
// //             for (const ward of district.wards) {
// //               let { lat, lng } = ward.location || { lat: 0, lng: 0 };

// //               // Nếu API không có lat/lng → tự tìm bằng Nominatim
// //               if (!lat || !lng || lat === 0 || lng === 0) {
// //                 const coords = await fetchLatLngFromNominatim(
// //                   ward.name,
// //                   district.name,
// //                   province.name,
// //                 );
// //                 lat = coords.lat;
// //                 lng = coords.lng;
// //               }

// //               wardList.push({
// //                 id: ward.code,
// //                 name: ward.name,
// //                 district: district.name,
// //                 city: province.name,
// //                 coordinates: { lat, lng },
// //               });
// //             }
// //           }
// //         }

// //         dispatch({ type: 'SET_AVAILABLE_LOCATIONS', payload: wardList });

// //         const stored = localStorage.getItem('badafuta_location');
// //         if (stored) {
// //           dispatch({ type: 'SET_LOCATION', payload: JSON.parse(stored) });
// //         }
// //       } catch (err) {
// //         dispatch({ type: 'SET_ERROR', payload: 'Không load được dữ liệu VN' });
// //       }

// //       dispatch({ type: 'SET_LOADING', payload: false });
// //     };

// //     loadLocations();
// //   }, []);

// //   const getCurrentLocation = async () => {
// //     dispatch({ type: 'SET_LOADING', payload: true });

// //     if (!('geolocation' in navigator)) {
// //       dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
// //       dispatch({ type: 'SET_LOADING', payload: false });
// //       return;
// //     }

// //     navigator.geolocation.getCurrentPosition(
// //       async (pos) => {
// //         const { latitude, longitude } = pos.coords;

// //         try {
// //           const wardNameRaw = await getDistrictFromGPS(latitude, longitude);

// //           let locationSet = null;

// //           if (wardNameRaw) {
// //             const normalizedWard = wardNameRaw
// //               .toLowerCase()
// //               .normalize('NFD')
// //               .replace(/[\u0300-\u036f]/g, '')
// //               .trim();

// //             locationSet = state.availableLocations.find(
// //               (loc) =>
// //                 loc.name
// //                   .toLowerCase()
// //                   .normalize('NFD')
// //                   .replace(/[\u0300-\u036f]/g, '')
// //                   .trim() === normalizedWard,
// //             );
// //           }

// //           // fallback: xã/phường gần nhất
// //           if (!locationSet) {
// //             locationSet = findNearestLocation(latitude, longitude, state.availableLocations);
// //           }

// //           if (locationSet) {
// //             setLocation(locationSet);
// //           } else {
// //             throw new Error('Không tìm thấy vị trí gần nhất');
// //           }
// //         } catch (error) {
// //           dispatch({ type: 'SET_ERROR', payload: error.message });
// //         } finally {
// //           dispatch({ type: 'SET_LOADING', payload: false });
// //         }
// //       },
// //       (err) => {
// //         dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
// //         dispatch({ type: 'SET_LOADING', payload: false });
// //       },
// //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
// //     );
// //   };

// //   return (
// //     <LocationContext.Provider value={{ state, setLocation, getCurrentLocation, calculateDistance }}>
// //       {children}
// //     </LocationContext.Provider>
// //   );
// // };

// // export const useLocation = () => {
// //   const context = useContext(LocationContext);
// //   if (!context) throw new Error('useLocation must be used within a LocationProvider');
// //   return context;
// // };

// import { createContext, useContext, useReducer, useEffect } from 'react';

// // Danh sách tất cả quận/huyện TP. Hồ Chí Minh
// const availableLocations = [
//   {
//     id: 'q1',
//     name: 'Quận 1',
//     district: 'Quận 1',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7769, lng: 106.7009 },
//   },
//   {
//     id: 'q2',
//     name: 'Quận 2',
//     district: 'Quận 2',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7829, lng: 106.7196 },
//   },
//   {
//     id: 'q3',
//     name: 'Quận 3',
//     district: 'Quận 3',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7756, lng: 106.6934 },
//   },
//   {
//     id: 'q4',
//     name: 'Quận 4',
//     district: 'Quận 4',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7605, lng: 106.705 },
//   },
//   {
//     id: 'q5',
//     name: 'Quận 5',
//     district: 'Quận 5',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7594, lng: 106.6833 },
//   },
//   {
//     id: 'q6',
//     name: 'Quận 6',
//     district: 'Quận 6',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.748, lng: 106.652 },
//   },
//   {
//     id: 'q7',
//     name: 'Quận 7',
//     district: 'Quận 7',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7336, lng: 106.7219 },
//   },
//   {
//     id: 'q8',
//     name: 'Quận 8',
//     district: 'Quận 8',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.737, lng: 106.657 },
//   },
//   {
//     id: 'q9',
//     name: 'Quận 9',
//     district: 'Quận 9',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8412, lng: 106.845 },
//   },
//   {
//     id: 'q10',
//     name: 'Quận 10',
//     district: 'Quận 10',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7731, lng: 106.6679 },
//   },
//   {
//     id: 'q11',
//     name: 'Quận 11',
//     district: 'Quận 11',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7675, lng: 106.6496 },
//   },
//   {
//     id: 'q12',
//     name: 'Quận 12',
//     district: 'Quận 12',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8576, lng: 106.628 },
//   },
//   {
//     id: 'bt',
//     name: 'Bình Thạnh',
//     district: 'Quận Bình Thạnh',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8017, lng: 106.7148 },
//   },
//   {
//     id: 'pn',
//     name: 'Phú Nhuận',
//     district: 'Quận Phú Nhuận',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7981, lng: 106.6831 },
//   },
//   {
//     id: 'tb',
//     name: 'Tân Bình',
//     district: 'Quận Tân Bình',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8009, lng: 106.6533 },
//   },
//   {
//     id: 'gv',
//     name: 'Gò Vấp',
//     district: 'Quận Gò Vấp',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8478, lng: 106.6606 },
//   },
//   {
//     id: 'td',
//     name: 'Thủ Đức',
//     district: 'TP. Thủ Đức',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8708, lng: 106.803 },
//   },
//   {
//     id: 'hm',
//     name: 'Hóc Môn',
//     district: 'Huyện Hóc Môn',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.8973, lng: 106.6183 },
//   },
//   {
//     id: 'cc',
//     name: 'Củ Chi',
//     district: 'Huyện Củ Chi',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 11.0, lng: 106.63 },
//   },
//   {
//     id: 'bc',
//     name: 'Bình Chánh',
//     district: 'Huyện Bình Chánh',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7, lng: 106.6 },
//   },
//   {
//     id: 'nb',
//     name: 'Nhà Bè',
//     district: 'Huyện Nhà Bè',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7, lng: 106.75 },
//   },
//   {
//     id: 'cg',
//     name: 'Cần Giờ',
//     district: 'Huyện Cần Giờ',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.46, lng: 106.98 },
//   },
// ];

// const initialState = {
//   currentLocation: availableLocations[0],
//   availableLocations,
//   isLoading: false,
//   error: null,
// };

// const locationReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_LOCATION':
//       return { ...state, currentLocation: action.payload, error: null };
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload, isLoading: false };
//     default:
//       return state;
//   }
// };

// const LocationContext = createContext(undefined);

// // Hàm reverse geocoding lấy quận/huyện từ GPS
// const getDistrictFromGPS = async (lat, lng) => {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
//     );
//     const data = await res.json();

//     if (!data.address) throw new Error('Không tìm thấy địa chỉ');

//     // Lấy quận/huyện từ address
//     const districtName =
//       data.address.city_district || data.address.suburb || data.address.county || null;

//     return districtName;
//   } catch (err) {
//     console.error('Reverse geocode error:', err);
//     return null;
//   }
// };

// export const LocationProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(locationReducer, initialState);

//   const setLocation = (location) => {
//     dispatch({ type: 'SET_LOCATION', payload: location });
//     localStorage.setItem('badafuta_location', JSON.stringify(location));
//   };

//   const normalizeDistrict = (name) =>
//     name
//       ?.toLowerCase()
//       .replace('quận', '')
//       .replace('huyện', '')
//       .replace(',', '')
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
//       .trim();

//   const getCurrentLocation = async () => {
//     dispatch({ type: 'SET_LOADING', payload: true });

//     if (!('geolocation' in navigator)) {
//       dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
//       dispatch({ type: 'SET_LOADING', payload: false });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;

//         try {
//           const wardNameRaw = await getDistrictFromGPS(latitude, longitude);
//           if (!wardNameRaw) throw new Error('Không xác định được xã/phường');

//           const normalizedWard = wardNameRaw
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
//             .trim();

//           console.log('Ward from GPS raw:', wardNameRaw);
//           console.log('Normalized ward:', normalizedWard);

//           // Tạo object location mới chỉ dùng xã/phường
//           const newLocation = {
//             id: 'gps',
//             name: wardNameRaw,
//             ward: wardNameRaw,
//             city: 'TP. Hồ Chí Minh',
//             coordinates: { lat: latitude, lng: longitude },
//           };

//           setLocation(newLocation);
//         } catch (error) {
//           dispatch({ type: 'SET_ERROR', payload: error.message });
//           setLocation(initialState.availableLocations[0]); // fallback Quận 1
//         } finally {
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       },
//       (err) => {
//         dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
//         dispatch({ type: 'SET_LOADING', payload: false });
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
//     );
//   };

//   // ⭐ Hàm tính khoảng cách giữa 2 tọa độ
//   const calculateDistance = (lat1, lng1, lat2, lng2) => {
//     const R = 6371; // km
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLng = ((lng2 - lng1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // km
//   };

//   return (
//     <LocationContext.Provider value={{ state, setLocation, getCurrentLocation, calculateDistance }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) throw new Error('useLocation must be used within a LocationProvider');
//   return context;
// };

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// API BASE — 34tinhthanh.com (cập nhật 01/07/2025, miễn phí)
// Docs: https://34tinhthanh.com/api-docs.html
// ─────────────────────────────────────────────────────────────
const API_BASE = 'https://34tinhthanh.com';

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
const initialState = {
  currentLocation: null,
  gpsCoordinates: null, // { lat, lng } tọa độ GPS thực của thiết bị
  isLoading: false,
  error: null,

  // Tỉnh/thành
  provinces: [], // [{ province_code, name }]
  isLoadingProvinces: false,
  provincesError: null,

  // Phường/xã của tỉnh đang chọn
  wards: [], // [{ ward_code, ward_name, province_code, ... }]
  isLoadingWards: false,
  wardsError: null,

  // Nhà hàng / địa điểm OSM
  restaurants: [],
  isLoadingRestaurants: false,
  restaurantError: null,
};

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload, error: null };
    case 'SET_GPS_COORDINATES':
      return { ...state, gpsCoordinates: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    // Tỉnh/thành
    case 'SET_LOADING_PROVINCES':
      return { ...state, isLoadingProvinces: action.payload };
    case 'SET_PROVINCES':
      return {
        ...state,
        provinces: action.payload,
        isLoadingProvinces: false,
        provincesError: null,
      };
    case 'SET_PROVINCES_ERROR':
      return { ...state, provincesError: action.payload, isLoadingProvinces: false };

    // Phường/xã
    case 'SET_LOADING_WARDS':
      return { ...state, isLoadingWards: action.payload };
    case 'SET_WARDS':
      return { ...state, wards: action.payload, isLoadingWards: false, wardsError: null };
    case 'SET_WARDS_ERROR':
      return { ...state, wardsError: action.payload, isLoadingWards: false };

    // Nhà hàng
    case 'SET_RESTAURANTS':
      return {
        ...state,
        restaurants: action.payload,
        isLoadingRestaurants: false,
        restaurantError: null,
      };
    case 'SET_LOADING_RESTAURANTS':
      return { ...state, isLoadingRestaurants: action.payload };
    case 'SET_RESTAURANT_ERROR':
      return { ...state, restaurantError: action.payload, isLoadingRestaurants: false };

    default:
      return state;
  }
};

const LocationContext = createContext(undefined);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Haversine distance (km) */
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Reverse geocode tọa độ → địa chỉ (Nominatim) */
const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`,
    { headers: { 'User-Agent': 'MyApp/1.0' } },
  );
  const data = await res.json();
  if (!data.address) throw new Error('Không tìm thấy địa chỉ');
  const addr = data.address;
  return {
    city: addr.city || addr.province || addr.state || null,
    district: addr.city_district || addr.district || addr.county || null,
    ward: addr.suburb || addr.neighbourhood || addr.village || addr.town || null,
    displayName: data.display_name,
  };
};

// ─────────────────────────────────────────────────────────────
// API CALLS — 34tinhthanh.com
// ─────────────────────────────────────────────────────────────

/**
 * Lấy toàn bộ 34 tỉnh/thành từ API
 * GET /api/provinces → [{ province_code, name }]
 */
export const fetchProvinces = async () => {
  const res = await fetch(`${API_BASE}/api/provinces`);
  if (!res.ok) throw new Error(`Lỗi lấy danh sách tỉnh/thành: ${res.status}`);
  return res.json(); // [{ province_code, name }]
};

/**
 * Lấy danh sách phường/xã của 1 tỉnh
 * GET /api/wards?province_code=01 → [{ ward_code, ward_name, province_code, ... }]
 */
export const fetchWards = async (provinceCode) => {
  if (!provinceCode) throw new Error('Thiếu province_code');
  const res = await fetch(
    `${API_BASE}/api/wards?province_code=${encodeURIComponent(provinceCode)}`,
  );
  if (!res.ok) throw new Error(`Lỗi lấy phường/xã: ${res.status}`);
  return res.json(); // [{ ward_code, ward_name, province_code, ... }]
};

/**
 * Tìm kiếm tỉnh/phường theo tên (hỗ trợ tên cũ trước sáp nhập)
 * GET /api/search?q=... → [{ type, province_code?, ward_code?, name?, ward_name?, is_merger_match, matched_old_unit? }]
 */
export const searchAdminUnits = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error(`Lỗi tìm kiếm: ${res.status}`);
  return res.json();
};

/**
 * Tìm tỉnh/thành khớp với tên (kể cả tên cũ) — dùng /api/search
 * Trả về province object đầu tiên match hoặc null
 */
export const findProvinceByName = async (name) => {
  if (!name) return null;
  try {
    const results = await searchAdminUnits(name);
    const match = results.find((r) => r.type === 'province');
    return match || null; // { type, province_code, name, is_merger_match, matched_old_unit? }
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// OSM — Tìm nhà hàng
// ─────────────────────────────────────────────────────────────
const fetchRestaurantsNearby = async (lat, lng, radius = 2000) => {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"~"restaurant|cafe|fast_food|food_court|bar"](around:${radius},${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food|food_court|bar"](around:${radius},${lat},${lng});
    );
    out center tags 30;
  `;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });
  const data = await res.json();
  return (data.elements || [])
    .map((el) => {
      const tags = el.tags || {};
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      return {
        id: el.id,
        name: tags.name || tags['name:vi'] || 'Không có tên',
        type: tags.amenity,
        cuisine: tags.cuisine || null,
        address:
          [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
            .filter(Boolean)
            .join(', ') ||
          tags['addr:full'] ||
          null,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        coordinates: { lat: elLat, lng: elLng },
      };
    })
    .filter((r) => r.name !== 'Không có tên' || r.address);
};

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────
export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Cache phường/xã đã fetch — tránh gọi lại API khi đổi tỉnh qua lại
  const wardsCache = useRef({}); // { [provinceCode]: [wards] }

  // ── Khôi phục location khi mount ──────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('app_location');
    if (stored) {
      try {
        dispatch({ type: 'SET_LOCATION', payload: JSON.parse(stored) });
      } catch {}
    }
  }, []);

  // ── Load 34 tỉnh/thành khi mount ──────────────────────────
  useEffect(() => {
    dispatch({ type: 'SET_LOADING_PROVINCES', payload: true });
    fetchProvinces()
      .then((data) => dispatch({ type: 'SET_PROVINCES', payload: data }))
      .catch((err) => dispatch({ type: 'SET_PROVINCES_ERROR', payload: err.message }));
  }, []);

  // ── Auto-load phường/xã khi currentLocation thay đổi ──────
  useEffect(() => {
    const code = state.currentLocation?.provinceCode;
    if (!code) return;

    if (wardsCache.current[code]) {
      dispatch({ type: 'SET_WARDS', payload: wardsCache.current[code] });
      return;
    }

    dispatch({ type: 'SET_LOADING_WARDS', payload: true });
    fetchWards(code)
      .then((data) => {
        wardsCache.current[code] = data;
        dispatch({ type: 'SET_WARDS', payload: data });
      })
      .catch((err) => dispatch({ type: 'SET_WARDS_ERROR', payload: err.message }));
  }, [state.currentLocation?.provinceCode]);

  // ─────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────
  const setLocation = useCallback((location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
    localStorage.setItem('app_location', JSON.stringify(location));
  }, []);

  /**
   * Đặt location theo tên tỉnh/thành — dùng /api/search để tìm
   * (hỗ trợ tên cũ, ví dụ "Vũng Tàu" → tỉnh Hồ Chí Minh mới)
   */
  const setLocationByCity = useCallback(
    async (provinceName) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Tìm trong danh sách đã load trước (fast path)
        const normalize = (s = '') =>
          s
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/^(tỉnh|thành phố|tp\.?)\s*/i, '')
            .trim();
        const key = normalize(provinceName);

        let province =
          state.provinces.find(
            (p) =>
              normalize(p.name) === key ||
              normalize(p.name).includes(key) ||
              key.includes(normalize(p.name)),
          ) || null;

        // Fallback: search API (hỗ trợ tên cũ)
        if (!province) {
          const results = await searchAdminUnits(provinceName);
          province = results.find((r) => r.type === 'province') || null;
        }

        if (!province) throw new Error(`Không tìm thấy tỉnh/thành: "${provinceName}"`);

        setLocation({
          id: `manual_${province.province_code}`,
          name: province.name.replace(/^(Tỉnh|Thành phố)\s*/i, ''),
          city: province.name,
          provinceCode: province.province_code,
          isMergerMatch: province.is_merger_match || false,
          matchedOldUnit: province.matched_old_unit || null,
          fromGPS: false,
        });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.provinces, setLocation],
  );

  /**
   * Lấy vị trí GPS → reverse geocode → match tỉnh mới 2025
   */
  const getCurrentLocation = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    if (!('geolocation' in navigator)) {
      dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        dispatch({ type: 'SET_GPS_COORDINATES', payload: { lat: latitude, lng: longitude } });
        try {
          const geo = await reverseGeocode(latitude, longitude);

          // Tìm tỉnh theo địa chỉ reverse-geocoded (qua search API hỗ trợ tên cũ)
          let province = null;
          for (const candidate of [geo.city, geo.district]) {
            if (!candidate) continue;
            const results = await searchAdminUnits(candidate);
            province = results.find((r) => r.type === 'province') || null;
            if (province) break;
          }

          // Fallback: tỉnh gần nhất theo tọa độ trong danh sách đã load
          if (!province && state.provinces.length > 0) {
            // provinces không có tọa độ từ API → dùng Nominatim geocode từng tỉnh không cần thiết
            // Chọn tỉnh khớp tên Nominatim nhất là đủ; để tránh 34 requests, skip fallback GPS
          }

          const newLocation = {
            id: `gps_${Date.now()}`,
            name:
              geo.ward ||
              geo.district ||
              (province ? province.name.replace(/^(Tỉnh|Thành phố)\s*/i, '') : 'Vị trí của bạn'),
            ward: geo.ward,
            district: geo.district,
            city: province?.name || geo.city,
            provinceCode: province?.province_code || null,
            isMergerMatch: province?.is_merger_match || false,
            matchedOldUnit: province?.matched_old_unit || null,
            coordinates: { lat: latitude, lng: longitude },
            fromGPS: true,
          };
          setLocation(newLocation);
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: `Lỗi xác định vị trí: ${error.message}` });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      },
      () => {
        dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
        dispatch({ type: 'SET_LOADING', payload: false });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [state.provinces, setLocation]);

  /**
   * Load phường/xã của 1 tỉnh bất kỳ (on-demand, có cache)
   */
  const loadWards = useCallback(async (provinceCode) => {
    if (!provinceCode) return;
    if (wardsCache.current[provinceCode]) {
      dispatch({ type: 'SET_WARDS', payload: wardsCache.current[provinceCode] });
      return;
    }
    dispatch({ type: 'SET_LOADING_WARDS', payload: true });
    try {
      const data = await fetchWards(provinceCode);
      wardsCache.current[provinceCode] = data;
      dispatch({ type: 'SET_WARDS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_WARDS_ERROR', payload: err.message });
    }
  }, []);

  /**
   * Tìm nhà hàng gần vị trí hiện tại
   */
  const searchRestaurants = useCallback(
    async (options = {}) => {
      const {
        lat = state.currentLocation?.coordinates?.lat,
        lng = state.currentLocation?.coordinates?.lng,
        radius = 2000,
      } = options;
      if (!lat || !lng) {
        dispatch({ type: 'SET_RESTAURANT_ERROR', payload: 'Chưa có vị trí để tìm nhà hàng' });
        return;
      }
      dispatch({ type: 'SET_LOADING_RESTAURANTS', payload: true });
      try {
        const results = await fetchRestaurantsNearby(lat, lng, radius);
        const withDistance = results
          .map((r) => ({
            ...r,
            distance:
              r.coordinates.lat && r.coordinates.lng
                ? haversine(lat, lng, r.coordinates.lat, r.coordinates.lng)
                : null,
          }))
          .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        dispatch({ type: 'SET_RESTAURANTS', payload: withDistance });
      } catch (err) {
        dispatch({ type: 'SET_RESTAURANT_ERROR', payload: `Lỗi tìm nhà hàng: ${err.message}` });
      }
    },
    [state.currentLocation],
  );

  const calculateDistance = (lat1, lng1, lat2, lng2) => haversine(lat1, lng1, lat2, lng2);

  return (
    <LocationContext.Provider
      value={{
        state,
        setLocation,
        getCurrentLocation,
        setLocationByCity,
        loadWards,
        searchRestaurants,
        calculateDistance,
        // Shortcuts tiện dùng trong component
        provinces: state.provinces,
        wards: state.wards,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
