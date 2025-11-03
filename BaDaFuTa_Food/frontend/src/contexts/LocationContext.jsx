// import { createContext, useContext, useReducer, useEffect } from 'react';

// const initialState = {
//   currentLocation: {
//     id: 'district1',
//     name: 'Quận 1',
//     district: 'Quận 1',
//     city: 'TP. Hồ Chí Minh',
//     coordinates: { lat: 10.7769, lng: 106.7009 }
//   },
//   availableLocations: [
//     {
//       id: 'district1',
//       name: 'Quận 1',
//       district: 'Quận 1',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7769, lng: 106.7009 }
//     },
//     {
//       id: 'district3',
//       name: 'Quận 3',
//       district: 'Quận 3',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7756, lng: 106.6934 }
//     },
//     {
//       id: 'district5',
//       name: 'Quận 5',
//       district: 'Quận 5',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7594, lng: 106.6833 }
//     },
//     {
//       id: 'district7',
//       name: 'Quận 7',
//       district: 'Quận 7',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7336, lng: 106.7219 }
//     },
//     {
//       id: 'district10',
//       name: 'Quận 10',
//       district: 'Quận 10',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7731, lng: 106.6679 }
//     },
//     {
//       id: 'binhthanhdistrict',
//       name: 'Quận Bình Thạnh',
//       district: 'Quận Bình Thạnh',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.8017, lng: 106.7148 }
//     },
//     {
//       id: 'phuongdistrict',
//       name: 'Quận Phú Nhuận',
//       district: 'Quận Phú Nhuận',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7981, lng: 106.6831 }
//     },
//     {
//       id: 'tanthanhdistrict',
//       name: 'Quận Tân Bình',
//       district: 'Quận Tân Bình',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.8009, lng: 106.6533 }
//     },
//     {
//       id: 'district2',
//       name: 'Quận 2 (Thủ Đức)',
//       district: 'Quận 2',
//       city: 'TP. Hồ Chí Minh',
//       coordinates: { lat: 10.7829, lng: 106.7196 }
//     }
//   ],
//   isLoading: false,
//   error: null
// };

// const locationReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_LOCATION':
//       return {
//         ...state,
//         currentLocation: action.payload,
//         error: null
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload
//       };
//     case 'SET_ERROR':
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false
//       };
//     case 'SET_AVAILABLE_LOCATIONS':
//       return {
//         ...state,
//         availableLocations: action.payload
//       };
//     default:
//       return state;
//   }
// };

// const LocationContext = createContext(undefined);

// export const LocationProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(locationReducer, initialState);

//   // Calculate distance between two coordinates using Haversine formula
//   const calculateDistance = (lat1, lng1, lat2, lng2) => {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLng = (lng2 - lng1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLng/2) * Math.sin(dLng/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   };

//   const setLocation = (location) => {
//     dispatch({ type: 'SET_LOCATION', payload: location });
//     // Save to localStorage
//     localStorage.setItem('badafuta_location', JSON.stringify(location));
//   };

//   const getCurrentLocation = async () => {
//     dispatch({ type: 'SET_LOADING', payload: true });
    
//     try {
//       if ('geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
            
//             // Find closest available location
//             const distances = state.availableLocations.map(location => ({
//               location,
//               distance: calculateDistance(latitude, longitude, location.coordinates.lat, location.coordinates.lng)
//             }));
            
//             const closest = distances.reduce((min, current) => 
//               current.distance < min.distance ? current : min
//             );
            
//             setLocation(closest.location);
//             dispatch({ type: 'SET_LOADING', payload: false });
//           },
//           (error) => {
//             dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
//             dispatch({ type: 'SET_LOADING', payload: false });
//           }
//         );
//       } else {
//         dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     } catch (error) {
//       dispatch({ type: 'SET_ERROR', payload: 'Có lỗi xảy ra khi lấy vị trí' });
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   // Load saved location on mount
//   useEffect(() => {
//     const savedLocation = localStorage.getItem('badafuta_location');
//     if (savedLocation) {
//       try {
//         const location = JSON.parse(savedLocation);
//         dispatch({ type: 'SET_LOCATION', payload: location });
//       } catch (error) {
//         console.error('Error loading saved location:', error);
//       }
//     }
//   }, []);

//   const value = {
//     state,
//     setLocation,
//     getCurrentLocation,
//     calculateDistance
//   };

//   return (
//     <LocationContext.Provider value={value}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) {
//     throw new Error('useLocation must be used within a LocationProvider');
//   }
//   return context;
// };

import { createContext, useContext, useReducer, useEffect } from "react";

// Danh sách tất cả quận/huyện TP. Hồ Chí Minh
const availableLocations = [
  {
    id: "q1",
    name: "Quận 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7769, lng: 106.7009 },
  },
  {
    id: "q2",
    name: "Quận 2",
    district: "Quận 2",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7829, lng: 106.7196 },
  },
  {
    id: "q3",
    name: "Quận 3",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7756, lng: 106.6934 },
  },
  {
    id: "q4",
    name: "Quận 4",
    district: "Quận 4",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7605, lng: 106.705 },
  },
  {
    id: "q5",
    name: "Quận 5",
    district: "Quận 5",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7594, lng: 106.6833 },
  },
  {
    id: "q6",
    name: "Quận 6",
    district: "Quận 6",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.748, lng: 106.652 },
  },
  {
    id: "q7",
    name: "Quận 7",
    district: "Quận 7",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7336, lng: 106.7219 },
  },
  {
    id: "q8",
    name: "Quận 8",
    district: "Quận 8",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.737, lng: 106.657 },
  },
  {
    id: "q9",
    name: "Quận 9",
    district: "Quận 9",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8412, lng: 106.845 },
  },
  {
    id: "q10",
    name: "Quận 10",
    district: "Quận 10",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7731, lng: 106.6679 },
  },
  {
    id: "q11",
    name: "Quận 11",
    district: "Quận 11",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7675, lng: 106.6496 },
  },
  {
    id: "q12",
    name: "Quận 12",
    district: "Quận 12",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8576, lng: 106.628 },
  },
  {
    id: "bt",
    name: "Bình Thạnh",
    district: "Quận Bình Thạnh",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8017, lng: 106.7148 },
  },
  {
    id: "pn",
    name: "Phú Nhuận",
    district: "Quận Phú Nhuận",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7981, lng: 106.6831 },
  },
  {
    id: "tb",
    name: "Tân Bình",
    district: "Quận Tân Bình",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8009, lng: 106.6533 },
  },
  {
    id: "gv",
    name: "Gò Vấp",
    district: "Quận Gò Vấp",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8478, lng: 106.6606 },
  },
  {
    id: "td",
    name: "Thủ Đức",
    district: "TP. Thủ Đức",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8708, lng: 106.803 },
  },
  {
    id: "hm",
    name: "Hóc Môn",
    district: "Huyện Hóc Môn",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.8973, lng: 106.6183 },
  },
  {
    id: "cc",
    name: "Củ Chi",
    district: "Huyện Củ Chi",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 11.0, lng: 106.63 },
  },
  {
    id: "bc",
    name: "Bình Chánh",
    district: "Huyện Bình Chánh",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7, lng: 106.6 },
  },
  {
    id: "nb",
    name: "Nhà Bè",
    district: "Huyện Nhà Bè",
    city: "TP. Hồ Chí Minh",
    coordinates: { lat: 10.7, lng: 106.75 },
  },
  {
    id: "cg",
    name: "Cần Giờ",
    district: "Huyện Cần Giờ",
    city: "TP. Hồ Chí Minh",
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
    case "SET_LOCATION":
      return { ...state, currentLocation: action.payload, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const LocationContext = createContext(undefined);

// Hàm reverse geocoding lấy quận/huyện từ GPS
const getDistrictFromGPS = async (lat, lng) => {
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Thay bằng key thật
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  );
  const data = await res.json();
  if (!data.results.length) throw new Error("Không tìm thấy địa chỉ");

  const addressComponents = data.results[0].address_components;
  const districtComponent = addressComponents.find((c) =>
    c.types.includes("administrative_area_level_2")
  );
  return districtComponent ? districtComponent.long_name : null;
};

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  const setLocation = (location) => {
    dispatch({ type: "SET_LOCATION", payload: location });
    localStorage.setItem("badafuta_location", JSON.stringify(location));
  };

  const getCurrentLocation = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      if (!("geolocation" in navigator))
        throw new Error("Trình duyệt không hỗ trợ định vị");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const districtName = await getDistrictFromGPS(latitude, longitude);

            // So khớp với availableLocations
            const matched = state.availableLocations.find(
              (loc) => loc.district === districtName
            );

            if (matched) setLocation(matched);
            else setLocation(state.availableLocations[0]); // fallback Quận 1
          } catch (error) {
            dispatch({
              type: "SET_ERROR",
              payload: "Không xác định được quận/huyện",
            });
          } finally {
            dispatch({ type: "SET_LOADING", payload: false });
          }
        },
        (err) => {
          dispatch({
            type: "SET_ERROR",
            payload: "Không thể lấy vị trí hiện tại",
          });
          dispatch({ type: "SET_LOADING", payload: false });
        }
      );
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("badafuta_location");
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        dispatch({ type: "SET_LOCATION", payload: location });
      } catch (error) {
        console.error("Error loading saved location:", error);
      }
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{ state, setLocation, getCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context)
    throw new Error("useLocation must be used within a LocationProvider");
  return context;
};
