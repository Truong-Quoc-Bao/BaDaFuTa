import * as React from "react";

interface HapticTabProps {
  label: string;
  onPress?: () => void;
}

export function HapticTab({ label, onPress }: HapticTabProps) {
  return (
    <button
      onClick={onPress}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      {label}
    </button>
  );
}
