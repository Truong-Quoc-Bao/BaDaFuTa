import React from "react";
import { cn } from "./utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-[16px] text-xl ", // font cứng 16px → iOS không zoom + chữ thường
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-9 w-full min-w-0 px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "border-gray-200 hover:border-gray-300 focus:border-gray-300",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg bg-gray-100",
        className
      )}
      style={{
        WebkitTextSizeAdjust: "100%",
        lineHeight: "1.25rem", // trông chữ như 14px
      }}
      {...props}
    />
  );
}

export { Input };
