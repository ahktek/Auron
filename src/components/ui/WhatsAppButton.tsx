"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants/brand";
import { MessageCircle, X } from "lucide-react";

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);

  // Do not render on internal admin pages or checkout success
  if (pathname.startsWith("/curecare-internal-8921") || pathname.startsWith("/api")) {
    return null;
  }

  const cleanPhone = BRAND.contact.phone.replace(/[^0-9]/g, "");
  const waNumber = cleanPhone.startsWith("0") ? "88" + cleanPhone : cleanPhone;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hello Cure-Care Support! I have a question about authentic wellness balms and remedies."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Floating Prompt Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 animate-fade-in">
          <span>Chat with Concierge</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-1"
            aria-label="Close tooltip"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Cure-Care Concierge"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-emerald-500/40"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
        </span>
        <MessageCircle className="h-7 w-7 transition-transform group-hover:rotate-6" />
      </a>
    </div>
  );
};
