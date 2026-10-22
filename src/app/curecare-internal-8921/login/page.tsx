"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/curecare-internal-8921/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      // Success: redirect to secret admin dashboard
      router.push("/curecare-internal-8921");
    } catch {
      setError("Network or server connection failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B0D] flex items-center justify-center p-6 text-zinc-100 font-sans">
      <div className="w-full max-w-md bg-zinc-900/95 border border-zinc-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <Logo size="md" textColor="text-white" className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-[11px] font-semibold mt-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Enterprise Gateway · Restricted Access</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white pt-2">
            Cure-Care Management Portal
          </h1>
          <p className="text-xs text-zinc-400">
            Internal Operations & Catalog Fulfillment Center
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Authorized Email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@curecarebd.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-950 border-zinc-700 text-white"
          />

          <Input
            label="Master Security Passphrase"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-950 border-zinc-700 text-white"
          />

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            size="lg"
            className="w-full font-bold bg-[#FF6857] hover:bg-[#e05646] text-white shadow-lg shadow-[#FF6857]/20"
          >
            Authenticate & Access Portal
          </Button>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 space-y-1">
          <p>Protected by Cure-Care Cryptographic Session Security</p>
          <p className="text-[10px] text-zinc-600">Rate-limited & brute-force guarded</p>
        </div>
      </div>
    </div>
  );
}
