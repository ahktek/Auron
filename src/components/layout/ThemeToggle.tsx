"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "icon" | "pill" | "minimal";
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "icon",
  className = "",
  showLabel = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Determine initial state
    const checkIsDark = () => {
      const stored = localStorage.getItem("auren_theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const currentDark = checkIsDark();
    setIsDark(currentDark);
    setMounted(true);

    // Sync if other components or tabs change the theme
    const handleThemeChange = () => {
      const isDocDark = document.documentElement.classList.contains("dark");
      setIsDark(isDocDark);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("auren_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("auren_theme", "light");
    }

    // Notify other components
    window.dispatchEvent(new Event("themechange"));
  };

  // Prevent hydration mismatch render until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        className={`p-2 rounded-full text-zinc-500 opacity-60 cursor-default ${className}`}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4.5 w-4.5" />
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-700 active:scale-[0.98] cursor-pointer ${className}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <span className="flex items-center gap-2.5 text-xs font-medium">
          {isDark ? (
            <Moon className="h-4 w-4 text-amber-400" />
          ) : (
            <Sun className="h-4 w-4 text-[#C25E34]" />
          )}
          <span>{isDark ? "Night Mode" : "Day Mode"}</span>
        </span>
        <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 dark:bg-zinc-700 transition-colors duration-200 ease-in-out">
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isDark ? "translate-x-4 bg-amber-400" : "translate-x-0 bg-[#C25E34]"
            }`}
          />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white ${
        isDark
          ? "hover:bg-zinc-800/60 text-amber-400 hover:text-amber-300"
          : "hover:bg-zinc-100/80 text-zinc-700 hover:text-[#C25E34]"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "Day" : "Night"} mode`}
      title={isDark ? "Switch to Day mode" : "Switch to Night mode"}
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Sun
          className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
            isDark
              ? "opacity-0 rotate-90 scale-50 pointer-events-none"
              : "opacity-100 rotate-0 scale-100 text-[#C25E34]"
          }`}
        />
        <Moon
          className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
            isDark
              ? "opacity-100 rotate-0 scale-100 text-amber-400"
              : "opacity-0 -rotate-90 scale-50 pointer-events-none"
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium hidden sm:inline">
          {isDark ? "Night" : "Day"}
        </span>
      )}
    </button>
  );
};
