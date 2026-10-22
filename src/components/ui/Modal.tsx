"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  theme?: "dark" | "light" | "auto";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
  className,
  theme = "auto",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  const isDark =
    theme === "dark" ||
    (theme === "auto" &&
      typeof window !== "undefined" &&
      window.location.pathname.includes("curecare-internal"));

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto",
        isDark && "dark text-zinc-100"
      )}
      style={{ isolation: "isolate" }}
    >
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full my-auto rounded-2xl shadow-2xl transition-all max-h-[90vh] overflow-y-auto border animate-in zoom-in-95 duration-200",
          isDark
            ? "bg-zinc-900 border-zinc-800 text-zinc-100"
            : "bg-white border-zinc-200 text-zinc-900",
          maxWidthClasses,
          className
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between p-5 border-b sticky top-0 z-20",
            isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
          )}
        >
          {title ? (
            <h3
              className={cn(
                "text-base font-bold leading-6 truncate pr-4",
                isDark ? "text-white" : "text-zinc-900"
              )}
            >
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "ml-auto rounded-full p-1.5 transition-all active:scale-90 cursor-pointer shrink-0",
              isDark
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            )}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
