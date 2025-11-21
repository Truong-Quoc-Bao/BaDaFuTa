import { MapPin, Navigation, Search, Clock } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useLocation } from '../contexts/LocationContext';
import { useState } from 'react';

export const LocationSelector = () => {
  const { state, setLocation, getCurrentLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = state.availableLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.district.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLocationSelect = (location) => {
    setLocation(location);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleGetCurrentLocation = async () => {
    await getCurrentLocation();
    setIsOpen(false);
  };

  // Mock recent locations (could come from localStorage in real app)
  const recentLocations = state.availableLocations.slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
        >
          <MapPin className="w-5 h-5 md:w-4 md:h-4" />
          <div className="text-left hidden md:block">
            <div className="text-sm font-medium">
              {state.currentLocation?.name || 'Chọn vị trí'}
            </div>
            <div className="text-xs text-gray-500">{state.currentLocation?.city}</div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[500px] max-w-full 
              max-h-[650px] h-auto sm:h-auto
             overflow-y-auto border border-gray-300"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Chọn địa điểm giao hàng</span>
          </DialogTitle>
          <DialogDescription>Chọn khu vực để tìm các nhà hàng gần bạn nhất</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm quận, huyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Location */}
          <div>
            <Button
              onClick={handleGetCurrentLocation}
              disabled={state.isLoading}
              className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {state.isLoading ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
            </Button>
          </div>

          {/* Current Selected */}
          {state.currentLocation && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3">Vị trí hiện tại</h4>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{state.currentLocation.name}</div>
                      <div className="text-sm text-gray-600">{state.currentLocation.city}</div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">Đang chọn</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Recent Locations */}
          {recentLocations.length > 0 && searchQuery === '' && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Vị trí gần đây
              </h4>
              <div className="space-y-2">
                {recentLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.city}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Locations */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">
              {searchQuery ? `Kết quả tìm kiếm (${filteredLocations.length})` : 'Tất cả khu vực'}
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      state.currentLocation?.id === location.id
                        ? 'bg-orange-50 border-orange-200'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            state.currentLocation?.id === location.id
                              ? 'bg-orange-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          <MapPin
                            className={`w-4 h-4 ${
                              state.currentLocation?.id === location.id
                                ? 'text-orange-600'
                                : 'text-gray-600'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-600">{location.city}</div>
                        </div>
                      </div>
                      {state.currentLocation?.id === location.id && (
                        <Badge className="bg-orange-100 text-orange-700 text-xs">Đang chọn</Badge>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <div className="font-medium">Không tìm thấy khu vực</div>
                  <div className="text-sm">Thử tìm kiếm với từ khóa khác</div>
                </div>
              )}
            </div>
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-600">{state.error}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
