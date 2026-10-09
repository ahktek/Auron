"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("auren_cookie_consent");
      if (!consent) {
        setShow(true);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    localStorage.setItem("auren_cookie_consent", "all");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("auren_cookie_consent", "essential");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="p-5 rounded-2xl bg-zinc-900/95 text-white backdrop-blur-md border border-zinc-800 shadow-2xl space-y-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldCheck className="h-4 w-4 text-[#FF6857]" />
          <span>Privacy & Cookie Preferences</span>
        </div>
        <p className="text-zinc-400 leading-relaxed">
          We use strictly necessary cookies to power your bag and checkout. We respect your privacy-by-default and do not track personal identifying information across external services. Read our{" "}
          <Link href="/cookies" className="underline hover:text-white">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            Essential Only
          </button>
          <Button onClick={handleAccept} size="sm" className="h-8">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};
