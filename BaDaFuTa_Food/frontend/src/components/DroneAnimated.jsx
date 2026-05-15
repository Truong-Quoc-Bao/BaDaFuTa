// ProDeliveryDrone_SmallProp.jsx - Cánh nhỏ xinh, thùng dính chặt, cực chất!
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ProDeliveryDrone = ({ size = 160, autoPlay = true }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!autoPlay) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.value = 480;
    osc2.type = "square";
    osc2.frequency.value = 960;
    gain.gain.value = 0.17;

    osc1.connect(gain).connect(ctx.destination);
    osc2.connect(gain);

    osc1.start();
    osc2.start();

    audioRef.current = { osc1, osc2, gain };

    return () => { osc1.stop(); osc2.stop(); };
  }, [autoPlay]);

  return (
    <motion.div
      style={{ width: size, height: size + 50, position: "relative" }}
      animate={{
        y: [0, -22, -10, 0],
        x: [0, 28, -22, 0],
        rotate: [0, 8, -7, 4, 0],
      }}
      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      onMouseEnter={() => audioRef.current?.gain.gain.setValueAtTime(0.34, 0)}
      onMouseLeave={() => audioRef.current?.gain.gain.setValueAtTime(0.17, 0)}
    >
      {/* 6 cánh quạt NHỎ LẠI – đẹp chuẩn thực tế */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: "24%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${a}deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.24, repeat: Infinity, ease: "linear" }}
        >
          <div style={{ position: "relative" }}>
            {/* Motor nhỏ hơn */}
            <div style={{
              width: 13,
              height: 13,
              background: "#1e293b",
              borderRadius: "50%",
              position: "absolute",
              top: -6.5,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "inset 0 2px 5px rgba(0,0,0,0.7)",
            }} />
            {/* Cánh quạt nhỏ lại (chỉ còn ~45px) */}
            <div style={{
              width: 45,        // ← Nhỏ lại từ 68 → 45
              height: 9,        // ← Mỏng hơn
              background: "linear-gradient(90deg, #1e293b 0%, #475569 100%)",
              borderRadius: 6,
              margin: "0 auto",
              boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
            }} />
          </div>
        </motion.div>
      ))}

      {/* Thân drone + thùng hàng dính chặt */}
      <svg width={size} height={size} viewBox="0 0 220 260" style={{ overflow: "visible" }}>
        {/* 6 tay đỡ (giữ nguyên đẹp) */}
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <path
            key={i}
            d={`M110,75 L${110 + 68 * Math.cos(a * Math.PI / 180)},${110 + 68 * Math.sin(a * Math.PI / 180)}`}
            stroke="#94a3b8"
            strokeWidth="17"
            strokeLinecap="round"
          />
        ))}

        <ellipse cx="110" cy="90" rx="54" ry="36" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="5"/>
        <circle cx="110" cy="62" r="16" fill="#1e293b"/>
        <circle cx="114" cy="58" r="6" fill="#60a5fa"/>
        <circle cx="86" cy="80" r="6" fill="#10b981"/>
        <circle cx="134" cy="80" r="6" fill="#ef4444"/>

        {/* Thùng hàng dính sát bụng – gọn đẹp */}
        <g transform="translate(110,142)">
          <rect x="-34" y="0" width="68" height="52" rx="11" fill="#f59e0b" stroke="#92400e" strokeWidth="4"/>
          <rect x="-34" y="18" width="68" height="12" fill="rgba(255,255,255,0.4)"/>
          <text x="0" y="17" fontSize="34" fontWeight="bold" fill="white" textAnchor="middle">E</text>
          <text x="0" y="48" fontSize="10" fontWeight="bold" fill="#1e40af" textAnchor="middle">Express Delivery</text>
        </g>
      </svg>

      {/* Ánh sáng dưới bụng */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          width: 48,
          height: 48,
          background: "#fbbf24",
          borderRadius: "50%",
          filter: "blur(22px)",
          opacity: 0.75,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default ProDeliveryDrone;