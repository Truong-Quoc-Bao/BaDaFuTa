// import { createContext, useContext, useReducer, useEffect } from 'react';

// const initialState = {
//   currentLocation: null,
//   availableLocations: [], 
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
//     case 'SET_AVAILABLE_LOCATIONS':
//       return { ...state, availableLocations: action.payload };
//     default:
//       return state;
//   }
// };

// const LocationContext = createContext(undefined);

// // Reverse geocoding từ GPS
// const getDistrictFromGPS = async (lat, lng) => {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//     );
//     const data = await res.json();
//     if (!data.address) throw new Error('Không tìm thấy địa chỉ');

//     const districtName =
//       data.address.city_district || data.address.suburb || data.address.county || null;

//     return districtName;
//   } catch (err) {
//     console.error('Reverse geocode error:', err);
//     return null;
//   }
// };

// // Load dữ liệu Việt Nam
// const fetchVietnamData = async () => {
//   try {
//     const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error('Lỗi fetch dữ liệu Việt Nam:', err);
//     return [];
//   }
// };

// // Tính khoảng cách giữa 2 tọa độ
// const calculateDistance = (lat1, lng1, lat2, lng2) => {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLng = ((lng2 - lng1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// // Tìm xã/phường gần nhất
// const findNearestLocation = (lat, lng, locations) => {
//   if (!locations || locations.length === 0) return null;

//   let nearest = locations[0];
//   let minDistance = calculateDistance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);

//   for (let i = 1; i < locations.length; i++) {
//     const loc = locations[i];
//     const dist = calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
//     if (dist < minDistance) {
//       nearest = loc;
//       minDistance = dist;
//     }
//   }

//   return nearest;
// };

// export const LocationProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(locationReducer, initialState);

//   const setLocation = (location) => {
//     dispatch({ type: 'SET_LOCATION', payload: location });
//     localStorage.setItem('badafuta_location', JSON.stringify(location));
//   };

//   // Load địa phương Việt Nam
//   useEffect(() => {
//     const loadLocations = async () => {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const data = await fetchVietnamData();

//       if (data.length > 0) {
//         // Lấy toàn bộ xã/phường TP.HCM (code 79)
//         // const hcmWards = data
//         //   .find((p) => p.code === 79)
//         //   ?.districts.flatMap((d) =>
//         //     d.wards.map((w) => ({
//         //       id: w.code,
//         //       name: w.name,
//         //       district: d.name,
//         //       city: 'TP. Hồ Chí Minh',
//         //       coordinates: { lat: w.location?.lat || 0, lng: w.location?.lng || 0 },
//         //     }))
//         //   ) || [];

//         // dispatch({ type: 'SET_AVAILABLE_LOCATIONS', payload: hcmWards });
//         const allWards = data.flatMap((province) =>
//         province.districts.flatMap((district) =>
//           district.wards.map((ward) => ({
//             id: ward.code,
//             name: ward.name,
//             district: district.name,
//             city: province.name,
//             coordinates: { lat: ward.location?.lat || 0, lng: ward.location?.lng || 0 },
//           }))
//         )
//         );
//         dispatch({ type: 'SET_AVAILABLE_LOCATIONS', payload: allWards });
//         // Load từ localStorage nếu có
//         const stored = localStorage.getItem('badafuta_location');
//         if (stored) {
//           dispatch({ type: 'SET_LOCATION', payload: JSON.parse(stored) });
//         }
//       } else {
//         dispatch({ type: 'SET_ERROR', payload: 'Không thể load dữ liệu Việt Nam' });
//       }

//       dispatch({ type: 'SET_LOADING', payload: false });
//     };

//     loadLocations();
//   }, []);

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

//           let locationSet = null;

//           if (wardNameRaw) {
//             const normalizedWard = wardNameRaw
//               .toLowerCase()
//               .normalize('NFD')
//               .replace(/[\u0300-\u036f]/g, '')
//               .trim();

//             locationSet = state.availableLocations.find(
//               (loc) =>
//                 loc.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() ===
//                 normalizedWard
//             );
//           }

//           // fallback: xã/phường gần nhất
//           if (!locationSet) {
//             locationSet = findNearestLocation(latitude, longitude, state.availableLocations);
//           }

//           if (locationSet) {
//             setLocation(locationSet);
//           } else {
//             throw new Error('Không tìm thấy vị trí gần nhất');
//           }
//         } catch (error) {
//           dispatch({ type: 'SET_ERROR', payload: error.message });
//         } finally {
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       },
//       (err) => {
//         dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
//         dispatch({ type: 'SET_LOADING', payload: false });
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   return (
//     <LocationContext.Provider
//       value={{ state, setLocation, getCurrentLocation, calculateDistance }}
//     >
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) throw new Error('useLocation must be used within a LocationProvider');
//   return context;
// };


import { createContext, useContext, useReducer, useEffect } from 'react';

// Danh sách tất cả quận/huyện TP. Hồ Chí Minh
const availableLocations = [
  {
    id: 'q1',
    name: 'Quận 1',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
  {
    id: 'q2',
    name: 'Quận 2',
    district: 'Quận 2',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7829, lng: 106.7196 },
  },
  {
    id: 'q3',
    name: 'Quận 3',
    district: 'Quận 3',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7756, lng: 106.6934 },
  },
  {
    id: 'q4',
    name: 'Quận 4',
    district: 'Quận 4',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7605, lng: 106.705 },
  },
  {
    id: 'q5',
    name: 'Quận 5',
    district: 'Quận 5',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7594, lng: 106.6833 },
  },
  {
    id: 'q6',
    name: 'Quận 6',
    district: 'Quận 6',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.748, lng: 106.652 },
  },
  {
    id: 'q7',
    name: 'Quận 7',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7336, lng: 106.7219 },
  },
  {
    id: 'q8',
    name: 'Quận 8',
    district: 'Quận 8',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.737, lng: 106.657 },
  },
  {
    id: 'q9',
    name: 'Quận 9',
    district: 'Quận 9',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8412, lng: 106.845 },
  },
  {
    id: 'q10',
    name: 'Quận 10',
    district: 'Quận 10',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7731, lng: 106.6679 },
  },
  {
    id: 'q11',
    name: 'Quận 11',
    district: 'Quận 11',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7675, lng: 106.6496 },
  },
  {
    id: 'q12',
    name: 'Quận 12',
    district: 'Quận 12',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8576, lng: 106.628 },
  },
  {
    id: 'bt',
    name: 'Bình Thạnh',
    district: 'Quận Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8017, lng: 106.7148 },
  },
  {
    id: 'pn',
    name: 'Phú Nhuận',
    district: 'Quận Phú Nhuận',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7981, lng: 106.6831 },
  },
  {
    id: 'tb',
    name: 'Tân Bình',
    district: 'Quận Tân Bình',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8009, lng: 106.6533 },
  },
  {
    id: 'gv',
    name: 'Gò Vấp',
    district: 'Quận Gò Vấp',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8478, lng: 106.6606 },
  },
  {
    id: 'td',
    name: 'Thủ Đức',
    district: 'TP. Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8708, lng: 106.803 },
  },
  {
    id: 'hm',
    name: 'Hóc Môn',
    district: 'Huyện Hóc Môn',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.8973, lng: 106.6183 },
  },
  {
    id: 'cc',
    name: 'Củ Chi',
    district: 'Huyện Củ Chi',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 11.0, lng: 106.63 },
  },
  {
    id: 'bc',
    name: 'Bình Chánh',
    district: 'Huyện Bình Chánh',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7, lng: 106.6 },
  },
  {
    id: 'nb',
    name: 'Nhà Bè',
    district: 'Huyện Nhà Bè',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7, lng: 106.75 },
  },
  {
    id: 'cg',
    name: 'Cần Giờ',
    district: 'Huyện Cần Giờ',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.46, lng: 106.98 },
  },
];

const initialState = {
  currentLocation: availableLocations[0],
  availableLocations,
  isLoading: false,
  error: null,
};

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const LocationContext = createContext(undefined);

// Hàm reverse geocoding lấy quận/huyện từ GPS
const getDistrictFromGPS = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );
    const data = await res.json();

    if (!data.address) throw new Error('Không tìm thấy địa chỉ');

    // Lấy quận/huyện từ address
    const districtName =
      data.address.city_district || data.address.suburb || data.address.county || null;

    return districtName;
  } catch (err) {
    console.error('Reverse geocode error:', err);
    return null;
  }
};

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  const setLocation = (location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
    localStorage.setItem('badafuta_location', JSON.stringify(location));
  };

  const normalizeDistrict = (name) =>
    name
      ?.toLowerCase()
      .replace('quận', '')
      .replace('huyện', '')
      .replace(',', '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
      .trim();

  const getCurrentLocation = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    if (!('geolocation' in navigator)) {
      dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const wardNameRaw = await getDistrictFromGPS(latitude, longitude);
          if (!wardNameRaw) throw new Error('Không xác định được xã/phường');

          const normalizedWard = wardNameRaw
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
            .trim();

          console.log('Ward from GPS raw:', wardNameRaw);
          console.log('Normalized ward:', normalizedWard);

          // Tạo object location mới chỉ dùng xã/phường
          const newLocation = {
            id: 'gps',
            name: wardNameRaw,
            ward: wardNameRaw,
            city: 'TP. Hồ Chí Minh',
            coordinates: { lat: latitude, lng: longitude },
          };

          setLocation(newLocation);
        } catch (error) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
          setLocation(initialState.availableLocations[0]); // fallback Quận 1
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      },
      (err) => {
        dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
        dispatch({ type: 'SET_LOADING', payload: false });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // ⭐ Hàm tính khoảng cách giữa 2 tọa độ
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
  };

  return (
    <LocationContext.Provider value={{ state, setLocation, getCurrentLocation, calculateDistance }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};