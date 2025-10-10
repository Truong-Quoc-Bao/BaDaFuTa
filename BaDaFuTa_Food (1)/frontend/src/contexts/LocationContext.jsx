import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  currentLocation: {
    id: 'district1',
    name: 'Quận 1',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    coordinates: { lat: 10.7769, lng: 106.7009 }
  },
  availableLocations: [
    {
      id: 'district1',
      name: 'Quận 1',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    {
      id: 'district3',
      name: 'Quận 3',
      district: 'Quận 3',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7756, lng: 106.6934 }
    },
    {
      id: 'district5',
      name: 'Quận 5',
      district: 'Quận 5',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7594, lng: 106.6833 }
    },
    {
      id: 'district7',
      name: 'Quận 7',
      district: 'Quận 7',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7336, lng: 106.7219 }
    },
    {
      id: 'district10',
      name: 'Quận 10',
      district: 'Quận 10',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7731, lng: 106.6679 }
    },
    {
      id: 'binhthanhdistrict',
      name: 'Quận Bình Thạnh',
      district: 'Quận Bình Thạnh',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.8017, lng: 106.7148 }
    },
    {
      id: 'phuongdistrict',
      name: 'Quận Phú Nhuận',
      district: 'Quận Phú Nhuận',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7981, lng: 106.6831 }
    },
    {
      id: 'tanthanhdistrict',
      name: 'Quận Tân Bình',
      district: 'Quận Tân Bình',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.8009, lng: 106.6533 }
    },
    {
      id: 'district2',
      name: 'Quận 2 (Thủ Đức)',
      district: 'Quận 2',
      city: 'TP. Hồ Chí Minh',
      coordinates: { lat: 10.7829, lng: 106.7196 }
    }
  ],
  isLoading: false,
  error: null
};

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        currentLocation: action.payload,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'SET_AVAILABLE_LOCATIONS':
      return {
        ...state,
        availableLocations: action.payload
      };
    default:
      return state;
  }
};

const LocationContext = createContext(undefined);

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const setLocation = (location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
    // Save to localStorage
    localStorage.setItem('badafuta_location', JSON.stringify(location));
  };

  const getCurrentLocation = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Find closest available location
            const distances = state.availableLocations.map(location => ({
              location,
              distance: calculateDistance(latitude, longitude, location.coordinates.lat, location.coordinates.lng)
            }));
            
            const closest = distances.reduce((min, current) => 
              current.distance < min.distance ? current : min
            );
            
            setLocation(closest.location);
            dispatch({ type: 'SET_LOADING', payload: false });
          },
          (error) => {
            dispatch({ type: 'SET_ERROR', payload: 'Không thể lấy vị trí hiện tại' });
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        );
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Trình duyệt không hỗ trợ định vị' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Có lỗi xảy ra khi lấy vị trí' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('badafuta_location');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        dispatch({ type: 'SET_LOCATION', payload: location });
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    }
  }, []);

  const value = {
    state,
    setLocation,
    getCurrentLocation,
    calculateDistance
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
