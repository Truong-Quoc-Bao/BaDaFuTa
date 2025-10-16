import React, { createContext, useContext } from "react";
import { Clock } from "lucide-react";

// Context lưu state chung để dùng cho cả Clock và Text
const OpeningContext = createContext(null);

function useOpenState(time_open) {
  const now = new Date();
  const dayKey = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();

  const dayVN = {
    sunday: "Chủ nhật",
    monday: "Thứ hai",
    tuesday: "Thứ ba",
    wednesday: "Thứ tư",
    thursday: "Thứ năm",
    friday: "Thứ sáu",
    saturday: "Thứ bảy",
  }[dayKey];

  const today = time_open?.[dayKey];
  if (!today)
    return { hasData: false, isOpen: false, dayVN, open: "", close: "" };

  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const nowMin = toMin(now.toTimeString().slice(0, 5));
  const openMin = toMin(today.open);
  const closeMin = toMin(today.close);

  const isOpen =
    closeMin < openMin
      ? nowMin >= openMin || nowMin < closeMin
      : nowMin >= openMin && nowMin < closeMin;

  return { hasData: true, isOpen, dayVN, open: today.open, close: today.close };
}

// --- 1️⃣ Component Text ---
function OpeningText() {
  const ctx = useContext(OpeningContext);
  if (!ctx?.hasData)
    return (
      <span className="text-gray-500 whitespace-nowrap">
        Chưa có dữ liệu giờ mở cửa
      </span>
    );

  const { isOpen, dayVN, open, close } = ctx;

  return (
    <span className="text-sm text-gray-700 whitespace-nowrap">
      {`${dayVN}: ${open} - ${close} `}
      <span
        className={
          isOpen
            ? "text-green-600 font-medium ml-1"
            : "text-red-600 font-medium ml-1"
        }
      >
        {isOpen ? "• Đang mở cửa" : "• Đã đóng cửa"}
      </span>
    </span>
  );
}

// --- 2️⃣ Component Clock ---
function OpeningClock({ size = 16 }) {
  const ctx = useContext(OpeningContext);
  if (!ctx?.hasData) return null;
  return (
    <Clock
      size={size}
      strokeWidth={2}
      className={ctx.isOpen ? "text-green-500" : "text-red-500"}
    />
  );
}

// --- 3️⃣ Component gốc: tạo context 1 lần ---
function OpeningStatus({ time_open, children }) {
  const ctxValue = useOpenState(time_open);
  return (
    <OpeningContext.Provider value={ctxValue}>
      {children}
    </OpeningContext.Provider>
  );
}

// --- Gán namespace tiện dụng ---
OpeningStatus.Clock = OpeningClock;
OpeningStatus.Text = OpeningText;

export default OpeningStatus;
