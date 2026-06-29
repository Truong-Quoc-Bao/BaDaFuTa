// import { MapPin, Navigation, Search, Clock } from 'lucide-react';
// import { Button } from './ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from './ui/dialog';
// import { Input } from './ui/input';
// import { Badge } from './ui/badge';
// import { useLocation } from '../contexts/LocationContext';
// import { useState } from 'react';

// export const LocationSelector = () => {
//   const { state, setLocation, getCurrentLocation } = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredLocations = state.availableLocations
//     .filter((location) => location && (location.name || location.district))
//     .filter(
//       (location) =>
//         location.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         location.district?.toLowerCase().includes(searchQuery.toLowerCase()),
//     );

//   const handleLocationSelect = (location) => {
//     setLocation(location);
//     setIsOpen(false);
//     setSearchQuery('');
//   };

//   const handleGetCurrentLocation = async () => {
//     await getCurrentLocation();
//     setIsOpen(false);
//   };

//   // Mock recent locations (could come from localStorage in real app)
//   const recentLocations = state.availableLocations.slice(0, 3);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="ghost"
//           className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
//         >
//           <MapPin className="w-5 h-5 md:w-4 md:h-4" />
//           <div className="text-left hidden md:block">
//             <div className="text-sm font-medium">
//               {state.currentLocation?.name || 'Chọn vị trí'}
//             </div>
//             <div className="text-xs text-gray-500">{state.currentLocation?.city}</div>
//           </div>
//         </Button>
//       </DialogTrigger>

//       <DialogContent
//         className="sm:max-w-[500px] max-w-full 
//               max-h-[650px] h-auto sm:h-auto
//              overflow-y-auto border border-gray-300"
//       >
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2">
//             <MapPin className="w-5 h-5 text-orange-600" />
//             <span>Chọn địa điểm giao hàng</span>
//           </DialogTitle>
//           <DialogDescription>Chọn khu vực để tìm các nhà hàng gần bạn nhất</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               type="text"
//               placeholder="Tìm kiếm phường, xã..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           {/* Current Location */}
//           <div>
//             <Button
//               onClick={handleGetCurrentLocation}
//               disabled={state.isLoading}
//               className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
//               variant="outline"
//             >
//               <Navigation className="w-4 h-4 mr-2" />
//               {state.isLoading ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
//             </Button>
//           </div>

//           {/* Current Selected */}
//           {state.currentLocation && (
//             <div>
//               <h4 className="font-medium text-sm text-gray-700 mb-3">Vị trí hiện tại</h4>
//               <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//                       <MapPin className="w-5 h-5 text-orange-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-900">{state.currentLocation.name}</div>
//                       <div className="text-sm text-gray-600">{state.currentLocation.city}</div>
//                     </div>
//                   </div>
//                   <Badge className="bg-orange-100 text-orange-700">Đang chọn</Badge>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Recent Locations */}
//           {recentLocations.length > 0 && searchQuery === '' && (
//             <div>
//               <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center">
//                 <Clock className="w-4 h-4 mr-2" />
//                 Vị trí gần đây
//               </h4>
//               <div className="space-y-2">
//                 {recentLocations.map((location) => (
//                   <button
//                     key={location.id}
//                     onClick={() => handleLocationSelect(location)}
//                     className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
//                         <MapPin className="w-4 h-4 text-gray-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">{location.name}</div>
//                         <div className="text-sm text-gray-600">{location.city}</div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* All Locations */}
//           <div>
//             <h4 className="font-medium text-sm text-gray-700 mb-3">
//               {searchQuery ? `Kết quả tìm kiếm (${filteredLocations.length})` : 'Tất cả khu vực'}
//             </h4>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {filteredLocations.length > 0 ? (
//                 filteredLocations.map((location) => (
//                   <button
//                     key={location.id}
//                     onClick={() => handleLocationSelect(location)}
//                     className={`w-full text-left p-3 rounded-lg border transition-colors ${
//                       state.currentLocation?.id === location.id
//                         ? 'bg-orange-50 border-orange-200'
//                         : 'hover:bg-gray-50 border-gray-200'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                             state.currentLocation?.id === location.id
//                               ? 'bg-orange-100'
//                               : 'bg-gray-100'
//                           }`}
//                         >
//                           <MapPin
//                             className={`w-4 h-4 ${
//                               state.currentLocation?.id === location.id
//                                 ? 'text-orange-600'
//                                 : 'text-gray-600'
//                             }`}
//                           />
//                         </div>
//                         <div>
//                           <div className="font-medium text-gray-900">{location.name}</div>
//                           <div className="text-sm text-gray-600">{location.city}</div>
//                         </div>
//                       </div>
//                       {state.currentLocation?.id === location.id && (
//                         <Badge className="bg-orange-100 text-orange-700 text-xs">Đang chọn</Badge>
//                       )}
//                     </div>
//                   </button>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                   <div className="font-medium">Không tìm thấy khu vực</div>
//                   <div className="text-sm">Thử tìm kiếm với từ khóa khác</div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {state.error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//               <div className="text-sm text-red-600">{state.error}</div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
import { MapPin, Navigation, Search, Clock, Locate } from 'lucide-react';
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
import { searchAdminUnits } from '../contexts/LocationContext';
import { useState, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
const shortName = (s = '') => s.replace(/^(Tỉnh|Thành phố)\s*/i, '');

// ─────────────────────────────────────────────────────────────
export const LocationSelector = () => {
  const { state, provinces, wards, setLocation, setLocationByCity, getCurrentLocation, loadWards } =
    useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef(null);

  // ── Reset khi đóng ────────────────────────────────────────
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // ── Load phường/xã của tỉnh hiện tại khi mở dialog ───────
  useEffect(() => {
    if (isOpen && state.currentLocation?.provinceCode) {
      loadWards(state.currentLocation.provinceCode);
    }
  }, [isOpen, state.currentLocation?.provinceCode, loadWards]);

  // ── Debounced search ──────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) { setSearchResults([]); setIsSearching(false); return; }
    clearTimeout(searchTimer.current);
    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchAdminUnits(q);
        setSearchResults(results);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  // ── Chọn tỉnh ─────────────────────────────────────────────
  const handleSelectProvince = useCallback((province) => {
    setLocationByCity(province.name || province.province_code);
    // Load phường/xã ngay để "vị trí gần đây" cập nhật
    loadWards(province.province_code);
    setSearchQuery('');
    setSearchResults([]);
    // Không đóng dialog → user tiếp tục chọn phường nếu muốn
  }, [setLocationByCity, loadWards]);

  // ── Chọn phường/xã ────────────────────────────────────────
  const handleSelectWard = useCallback((ward) => {
    setLocation({
      id: `ward_${ward.ward_code}`,
      name: ward.ward_name,
      ward: ward.ward_name,
      wardCode: ward.ward_code,
      city: ward.province_name || state.currentLocation?.city || '',
      provinceCode: ward.province_code,
      fromGPS: false,
    });
    handleOpenChange(false);
  }, [setLocation, state.currentLocation]);

  // ── GPS ───────────────────────────────────────────────────
  const handleGetCurrentLocation = async () => {
    await getCurrentLocation();
    handleOpenChange(false);
  };

  // ─────────────────────────────────────────────────────────
  const showSearch = searchQuery.trim().length >= 2;
  const provinceResults = showSearch ? searchResults.filter((r) => r.type === 'province') : [];
  const wardResults    = showSearch ? searchResults.filter((r) => r.type === 'ward')     : [];

  // Phường/xã của tỉnh đang chọn (hiện ở "Vị trí gần đây")
  const currentProvinceCode = state.currentLocation?.provinceCode;
  const nearbyWards = wards.filter((w) => w.province_code === currentProvinceCode);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* ── Trigger ────────────────────────────────────────── */}
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

      <DialogContent className="sm:max-w-[500px] max-w-full max-h-[650px] h-auto overflow-y-auto border border-gray-300">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>Chọn địa điểm giao hàng</span>
          </DialogTitle>
          <DialogDescription>Chọn khu vực để tìm các nhà hàng gần bạn nhất</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">

          {/* ── Search ───────────────────────────────────────── */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm tỉnh/thành hoặc phường, xã..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
                Đang tìm...
              </span>
            )}
          </div>

          {/* ── Sử dụng vị trí hiện tại ──────────────────────── */}
          <Button
            onClick={handleGetCurrentLocation}
            disabled={state.isLoading}
            className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            variant="outline"
          >
            <Locate className="w-4 h-4 mr-2" />
            {state.isLoading ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
          </Button>

          {/* ════════════════════════════════════════════════════
              KẾT QUẢ SEARCH
          ════════════════════════════════════════════════════ */}
          {showSearch && (
            <>
              {/* Tỉnh/thành */}
              {provinceResults.length > 0 && (
                <div>
                  <SectionTitle label={`Tỉnh/Thành phố (${provinceResults.length})`} />
                  <div className="space-y-2">
                    {provinceResults.map((p) => (
                      <ProvinceRow
                        key={p.province_code}
                        name={shortName(p.name || p.province_code)}
                        sub={p.is_merger_match && p.matched_old_unit ? `trước đây: ${p.matched_old_unit}` : (p.name || '').startsWith('Thành phố') ? 'TP trực thuộc TW' : 'Tỉnh'}
                        isSelected={currentProvinceCode === p.province_code && !state.currentLocation?.wardCode}
                        onClick={() => handleSelectProvince(p)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Phường/xã */}
              {wardResults.length > 0 && (
                <div>
                  <SectionTitle label={`Phường/Xã (${wardResults.length})`} />
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {wardResults.map((w) => (
                      <WardRow
                        key={w.ward_code || w.ward_name}
                        name={w.ward_name}
                        sub={w.is_merger_match && w.matched_old_unit ? `trước đây: ${w.matched_old_unit}` : w.province_name || ''}
                        isSelected={state.currentLocation?.wardCode === w.ward_code}
                        onClick={() => handleSelectWard(w)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!isSearching && provinceResults.length === 0 && wardResults.length === 0 && (
                <EmptyState />
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════
              LAYOUT CHÍNH (khi không search)
          ════════════════════════════════════════════════════ */}
          {!showSearch && (
            <>
              {/* ── Vị trí hiện tại ──────────────────────────── */}
              {state.currentLocation && (
                <div>
                  <SectionTitle label="Vị trí hiện tại" />
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{state.currentLocation.name}</div>
                          <div className="text-sm text-gray-500">{state.currentLocation.city}</div>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">Đang chọn</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Vị trí gần đây = phường/xã của tỉnh đang chọn ── */}
              {currentProvinceCode && (
                <div>
                  <SectionTitle
                    icon={<Clock className="w-4 h-4" />}
                    label={
                      state.isLoadingWards
                        ? `Đang tải phường/xã ${shortName(state.currentLocation?.city || '')}...`
                        : `Phường/Xã tại ${shortName(state.currentLocation?.city || '')} (${nearbyWards.length})`
                    }
                  />
                  {state.isLoadingWards ? (
                    <LoadingRows />
                  ) : state.wardsError ? (
                    <p className="text-xs text-red-500 px-1">{state.wardsError}</p>
                  ) : nearbyWards.length === 0 ? (
                    <p className="text-xs text-gray-400 px-1">Không có dữ liệu</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {nearbyWards.map((w) => (
                        <WardRow
                          key={w.ward_code}
                          name={w.ward_name}
                          sub={shortName(state.currentLocation?.city || '')}
                          isSelected={state.currentLocation?.wardCode === w.ward_code}
                          onClick={() => handleSelectWard(w)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Tất cả khu vực = 34 tỉnh/thành ─────────────── */}
              <div>
                <SectionTitle
                  label={
                    state.isLoadingProvinces
                      ? 'Đang tải...'
                      : `Tất cả khu vực (${provinces.length} tỉnh/thành)`
                  }
                />
                {state.provincesError && (
                  <p className="text-xs text-red-500 mb-2 px-1">{state.provincesError}</p>
                )}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {state.isLoadingProvinces ? (
                    <LoadingRows />
                  ) : (
                    provinces.map((p) => (
                      <ProvinceRow
                        key={p.province_code}
                        name={shortName(p.name)}
                        sub={(p.name || '').startsWith('Thành phố') ? 'TP trực thuộc TW' : 'Tỉnh'}
                        isSelected={currentProvinceCode === p.province_code && !state.currentLocation?.wardCode}
                        onClick={() => handleSelectProvince(p)}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* Lỗi GPS */}
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {state.error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────

const SectionTitle = ({ label, icon }) => (
  <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-1.5">
    {icon}
    {label}
  </h4>
);

const ProvinceRow = ({ name, sub, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-colors ${
      isSelected ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50 border-gray-200'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-orange-100' : 'bg-gray-100'}`}>
          <MapPin className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{name}</div>
          <div className="text-xs text-gray-500">{sub}</div>
        </div>
      </div>
      {isSelected && <Badge className="bg-orange-100 text-orange-700 text-xs">Đang chọn</Badge>}
    </div>
  </button>
);

const WardRow = ({ name, sub, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-colors ${
      isSelected ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50 border-gray-200'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-orange-100' : 'bg-gray-100'}`}>
          <MapPin className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-gray-500'}`} />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{name}</div>
          {sub && <div className="text-xs text-gray-500">{sub}</div>}
        </div>
      </div>
      {isSelected && <Badge className="bg-orange-100 text-orange-700 text-xs">Đang chọn</Badge>}
    </div>
  </button>
);

const LoadingRows = () => (
  <div className="space-y-2">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8 text-gray-500">
    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
    <div className="font-medium text-sm">Không tìm thấy khu vực</div>
    <div className="text-xs mt-1 text-gray-400">Thử tên mới: vd "Khánh Hòa" thay vì "Ninh Thuận"</div>
  </div>
);