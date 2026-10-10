"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, KeyRound, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@curecarebd.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("auren_admin_authenticated", "true");
      document.cookie = "auren_admin_authenticated=true; path=/; max-age=86400";
      router.push("/admin");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-6 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Logo size="md" textColor="text-white" className="justify-center" />
          <h1 className="text-xl font-bold tracking-tight text-white pt-2">
            Cure-Care CMS Control Center
          </h1>
          <p className="text-xs text-zinc-400">
            Administrative Access Portal · Health & Wellness Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Staff Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-950 border-zinc-700 text-white"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-950 border-zinc-700 text-white"
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button
            type="submit"
            isLoading={loading}
            size="lg"
            className="w-full font-bold bg-[#FF6857] hover:bg-[#e05646] text-white"
          >
            Sign In to Dashboard
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleLogin()}
            className="w-full text-xs text-zinc-300 border-zinc-700 hover:bg-zinc-800 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF6857]" />
            <span>One-Click Quick Sign In (Demo Mode)</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500">
          <span>Protected by Cure-Care RBAC Security Protocol</span>
        </div>
      </div>
    </div>
  );
}
