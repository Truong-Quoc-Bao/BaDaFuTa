{currentStep >= 2 && currentStep < 4 && (
  <div className="
    z-[400] font-mono text-xs rounded-xl border shadow-2xl backdrop-blur-md transition-all
    mt-3 w-full bg-slate-900/95 text-white border-slate-700
    flex flex-col p-4 gap-4
  ">
    {/* Header */}
    <div className="flex justify-between items-center pb-2 border-b border-white/10">
      <span className="font-bold text-orange-400 flex items-center gap-1.5">
        <Target className="w-4 h-4" />
        DRONE-01
      </span>
      <span className="flex items-center gap-1 text-green-400">
        <Wifi className="w-3.5 h-3.5" />
        {Math.round(droneStats.signal)}%
      </span>
    </div>

    {/* Nhóm 1: Vị trí */}
    <div className="space-y-2.5">
      {/* GPS */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-cyan-400">
          <MapIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">GPS</span>
        </div>
        <div className="font-mono text-[11px] tracking-tight text-right">
          {droneStats.latLng}
        </div>
      </div>

      {/* Địa chỉ */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wider">Đang bay qua</span>
        </div>
        <div className="text-xs text-right truncate max-w-[65%]">
          {droneStats.currentAddress}
        </div>
      </div>

      {/* Khoảng cách */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-orange-400">
          <Navigation className="w-4 h-4" />
          <span className="text-xs font-semibold">DIST</span>
        </div>
        <span className="font-bold text-orange-400">
          {droneStats.distanceRemaining} km
        </span>
      </div>
    </div>

    {/* Đường kẻ mỏng */}
    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    {/* Nhóm 2: Thông số bay – màu icon siêu đẹp & hợp lý */}
    <div className="space-y-2.5">
      {/* Pin */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <Battery className="w-4 h-4" />
          <span className="text-xs font-semibold">PIN</span>
        </div>
        <span className={`font-bold text-lg ${droneStats.battery < 20 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
          {Math.round(droneStats.battery)}%
        </span>
      </div>

      {/* Tốc độ */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-400">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-semibold">SPD</span>
        </div>
        <span className="font-bold text-blue-400">
          {Math.round(droneStats.speed)} km/h
        </span>
      </div>

      {/* Độ cao */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-yellow-400">
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-xs font-semibold">ALT</span>
        </div>
        <span className="font-bold text-yellow-400">
          {Math.round(droneStats.altitude)} m
        </span>
      </div>

      {/* Tốc độ gió */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-cyan-300">
          <Wind className="w-4 h-4" />
          <span className="text-xs font-semibold">WIND</span>
        </div>
        <span className="font-bold text-cyan-300">
          {droneStats.windSpeed} m/s
        </span>
      </div>
    </div>
  </div>
)}