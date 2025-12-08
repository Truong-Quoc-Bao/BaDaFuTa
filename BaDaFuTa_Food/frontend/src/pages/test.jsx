{/* --- HUD: LUÔN NẰM DƯỚI MAP (CHO CẢ MOBILE & PC) --- */}
{currentStep >= 2 && currentStep < 4 && (
  <div
    className="
      z-[400] font-mono text-xs rounded-xl border shadow-xl backdrop-blur-md transition-all
      
      /* Cấu hình chung (Mobile + Desktop): */
      /* Nằm dưới map (mt-3), Chiều rộng Full (w-full) */
      mt-3 w-full 
      
      /* Màu sắc: Nền tối (Slate 900), Chữ trắng */
      bg-slate-900 text-white border-slate-700 
      
      /* Bố cục: Xếp dọc (flex-col), khoảng cách 3, padding 4 */
      flex flex-col gap-3 p-4
    "
  >
    {/* Header */}
    <div className="flex justify-between items-center mb-1 pb-2 border-b border-white/20">
      <span className="font-bold text-orange-400 flex items-center gap-1">
        <Target className="w-3 h-3" /> DRONE-01
      </span>
      <span className="flex items-center gap-1 text-gray-400">
        <Wifi className="w-3 h-3" /> {Math.round(droneStats.signal)}%
      </span>
    </div>

    {/* Nhóm 1: Thông tin vị trí */}
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <MapIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">GPS</span>
        </div>
        <div className="text-white font-mono text-[11px] tracking-tighter tabular-nums">
          {droneStats.latLng}
        </div>
      </div>
      
      <div className="flex flex-col mt-2">
        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">
          <MapPin className="w-3 h-3" />
          Đang bay qua:
        </div>
        <div className="text-white text-xs font-medium leading-tight truncate">
          {droneStats.currentAddress}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Navigation className="w-3.5 h-3.5" /> DIST
        </div>
        <div className="font-bold text-orange-400">
          {droneStats.distanceRemaining} km
        </div>
      </div>
    </div>

    {/* Đường kẻ phân cách */}
    <div className="w-full h-[1px] bg-white/10 my-1"></div>

    {/* Nhóm 2: Thông số kỹ thuật */}
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Battery className="w-3.5 h-3.5" /> PIN
        </div>
        <div
          className={`font-bold ${
            droneStats.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'
          }`}
        >
          {Math.round(droneStats.battery)}%
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Zap className="w-3.5 h-3.5" /> SPD
        </div>
        <div className="font-bold text-blue-400">
          {Math.round(droneStats.speed)} km/h
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Wind className="w-3.5 h-3.5" /> ALT
        </div>
        <div className="font-bold text-yellow-400">
          {Math.round(droneStats.altitude)} m
        </div>
      </div>
    </div>
  </div>
)}