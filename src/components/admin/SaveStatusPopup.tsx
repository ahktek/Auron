"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, X, RefreshCw, Sparkles } from "lucide-react";

export type SaveStatus = "idle" | "saving" | "success" | "error";

interface SaveStatusPopupProps {
  status: SaveStatus;
  message?: string;
  timestamp?: string;
  onClose: () => void;
  onRetry?: () => void;
  duration?: number; // ms, default 4000
}

export const SaveStatusPopup: React.FC<SaveStatusPopupProps> = ({
  status,
  message,
  timestamp,
  onClose,
  onRetry,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown for success
  useEffect(() => {
    if (status !== "success") {
      setProgress(100);
      return;
    }

    const interval = 40; // update every 40ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [status, duration, onClose]);

  if (status === "idle") return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-6 right-6 z-50 max-w-sm sm:max-w-md w-full pointer-events-none"
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          status === "saving"
            ? "bg-zinc-950/95 border-[#FF6857]/50 shadow-[#FF6857]/10 animate-in fade-in zoom-in-95 slide-in-from-top-6"
            : status === "success"
            ? "bg-zinc-950/95 border-emerald-500/60 shadow-emerald-500/20 animate-in fade-in zoom-in-95 slide-in-from-top-6"
            : "bg-zinc-950/95 border-red-500/60 shadow-red-500/20 animate-in fade-in zoom-in-95 slide-in-from-top-6"
        }`}
      >
        {/* Glow ambient background aura */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 ${
            status === "saving"
              ? "bg-[#FF6857]"
              : status === "success"
              ? "bg-emerald-500"
              : "bg-red-500"
          }`}
        />

        <div className="relative flex items-start gap-3">
          {/* Animated Icon Avatar */}
          <div className="shrink-0 mt-0.5">
            {status === "saving" && (
              <div className="relative w-9 h-9 rounded-xl bg-[#FF6857]/15 border border-[#FF6857]/30 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#FF6857] animate-spin" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF6857] rounded-full animate-ping" />
              </div>
            )}

            {status === "success" && (
              <div className="relative w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center animate-in zoom-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
            )}

            {status === "error" && (
              <div className="relative w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center animate-in zoom-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {status === "saving" && <span>Saving Product Details...</span>}
                {status === "success" && (
                  <>
                    <span>Changes Saved Successfully!</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </>
                )}
                {status === "error" && <span>Save Failed!</span>}
              </h4>

              {timestamp && status === "success" && (
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline-block">
                  ({timestamp})
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {message ||
                (status === "saving"
                  ? "Writing changes to database and syncing storefront gallery..."
                  : status === "success"
                  ? "All fields, pricing, and 5-image gallery are now live."
                  : "An unexpected error occurred while communicating with the server.")}
            </p>

            {/* Error Actions */}
            {status === "error" && onRetry && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Animated Progress Line */}
        {status === "success" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {status === "saving" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 overflow-hidden">
            <div className="h-full bg-[#FF6857] animate-pulse w-full" />
          </div>
        )}

        {status === "error" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
        )}
      </div>
    </div>
  );
};
