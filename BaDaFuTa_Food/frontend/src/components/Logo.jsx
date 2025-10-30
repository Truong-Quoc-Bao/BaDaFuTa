export const Logo = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Spoon on left */}
      <ellipse cx="15" cy="20" rx="3.5" ry="5" fill="#EA580C" />
      <rect x="13.5" y="25" width="3" height="35" rx="1.5" fill="#EA580C" />

      {/* Fork on right */}
      <rect x="83.5" y="25" width="3" height="35" rx="1.5" fill="#EA580C" />
      <rect x="81" y="15" width="2" height="12" rx="1" fill="#EA580C" />
      <rect x="84" y="15" width="2" height="12" rx="1" fill="#EA580C" />
      <rect x="87" y="15" width="2" height="12" rx="1" fill="#EA580C" />
      <rect x="90" y="15" width="2" height="12" rx="1" fill="#EA580C" />

      {/* Plate - outer ring */}
      <circle
        cx="50"
        cy="45"
        r="28"
        stroke="#EA580C"
        strokeWidth="3"
        fill="none"
      />

      {/* Plate - inner circle (food area) */}
      <circle cx="50" cy="45" r="20" fill="#EA580C" />

      {/* Inner plate details */}
      <circle cx="50" cy="45" r="16" fill="#FFFFFF" />
      <circle
        cx="50"
        cy="45"
        r="12"
        stroke="#EA580C"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};
