import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  textColor?: string;
  accentColor?: string;
  size?: "sm" | "md" | "lg";
}

export const LogoMark = ({
  className = "w-6 h-6",
  accentColor = "#C25E34",
  secondaryColor = "currentColor",
}: {
  className?: string;
  accentColor?: string;
  secondaryColor?: string;
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Architectural carry fold & apex wing */}
    <path
      d="M24 6L6 38H18L24 27L30 38H42L24 6Z"
      fill={secondaryColor}
      fillOpacity="0.12"
    />
    <path
      d="M24 6L11 32H19.5L24 23.5L28.5 32H37L24 6Z"
      fill={secondaryColor}
    />
    <path
      d="M24 16L18 29H30L24 16Z"
      fill={accentColor}
    />
    <circle cx="24" cy="38" r="3" fill={accentColor} />
  </svg>
);

export const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "full",
  textColor = "text-zinc-900",
  accentColor = "#C25E34",
  size = "md",
}) => {
  const sizeClasses = {
    sm: { mark: "w-5 h-5", text: "text-base tracking-[0.22em]" },
    md: { mark: "w-6 h-6", text: "text-lg tracking-[0.25em]" },
    lg: { mark: "w-8 h-8", text: "text-2xl tracking-[0.28em]" },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold transition-opacity hover:opacity-85 select-none ${className}`}
      aria-label="AUREN Carry Goods Homepage"
    >
      {variant !== "wordmark" && (
        <LogoMark className={sizeClasses.mark} accentColor={accentColor} />
      )}
      {variant !== "mark" && (
        <span
          className={`font-semibold uppercase font-sans ${sizeClasses.text} ${textColor}`}
        >
          AUREN
        </span>
      )}
    </Link>
  );
};
