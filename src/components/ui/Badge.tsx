import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "teal" | "success" | "warning" | "soldOut";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    neutral: "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
    accent: "bg-[#FFF0ED] text-[#FF6857] border-[#FFD8D3] font-semibold dark:bg-[#2C1814] dark:text-[#FF7E6F] dark:border-[#4A2019]",
    teal: "bg-[#EAF4F5] text-[#005A64] border-[#D1E5E8] font-semibold dark:bg-[#0D292F] dark:text-[#14A0B1] dark:border-[#133F48]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    soldOut: "bg-zinc-200/80 text-zinc-600 line-through border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  }[variant];

  const sizeStyles = {
    sm: "text-[10px] uppercase tracking-wider px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-0.5 font-medium",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors select-none",
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
