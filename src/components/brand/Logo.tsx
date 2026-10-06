import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  textColor?: string;
  accentColor?: string;
  size?: "sm" | "md" | "lg";
}

export const LogoMark = ({
  className = "w-7 h-7",
}: {
  className?: string;
  accentColor?: string;
  secondaryColor?: string;
}) => (
  <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
    <Image
      src="/brand/logo-icon.png"
      alt="Cure-Care Mark"
      width={64}
      height={64}
      className="w-full h-full object-contain"
      priority
    />
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "full",
  textColor = "text-[#045964] dark:text-zinc-100",
  size = "md",
}) => {
  const sizeClasses = {
    sm: { mark: "w-6 h-6", text: "text-lg tracking-tight" },
    md: { mark: "w-8 h-8", text: "text-xl tracking-tight" },
    lg: { mark: "w-10 h-10", text: "text-2xl tracking-tight" },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold transition-opacity hover:opacity-90 select-none ${className}`}
      aria-label="Cure-Care Homepage"
    >
      {variant !== "wordmark" && (
        <LogoMark className={sizeClasses.mark} />
      )}
      {variant !== "mark" && (
        <span
          className={`font-extrabold tracking-tight font-sans ${sizeClasses.text} ${textColor}`}
        >
          Cure-Care
        </span>
      )}
    </Link>
  );
};
