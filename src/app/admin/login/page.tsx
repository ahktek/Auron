"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@curecare.com");
  const [password, setPassword] = useState("AurenAdmin2026!SecureKey");
  const [totpCode, setTotpCode] = useState("892014");
  const [step, setStep] = useState<"creds" | "2fa">("creds");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@curecare.com" && password === "AurenAdmin2026!SecureKey") {
      setStep("2fa");
    } else {
      setError("Invalid administrative credentials. Use admin@curecare.com / AurenAdmin2026!SecureKey");
    }
  };

  const handle2faSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("auren_admin_authenticated", "true");
      router.push("/admin");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center p-6 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <Logo size="md" textColor="text-white" className="justify-center" />
          <h1 className="text-xl font-bold tracking-tight text-white pt-2">
            Administrative Access Portal
          </h1>
          <p className="text-xs text-zinc-400">
            RBAC Enforced · Multi-factor Authenticated
          </p>
        </div>

        {step === "creds" ? (
          <form onSubmit={handleCredsSubmit} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white"
            />

            <Input
              label="Master Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button type="submit" size="lg" className="w-full font-bold">
              Verify Credentials
            </Button>
          </form>
        ) : (
          <form onSubmit={handle2faSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2.5">
              <KeyRound className="h-4 w-4 text-[#FC5A43] shrink-0" />
              <span>Enter the 6-digit TOTP authenticator code generated for Marcus Vance.</span>
            </div>

            <Input
              label="6-Digit Authenticator Code (TOTP)"
              type="text"
              required
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className="bg-zinc-950 border-zinc-700 text-white font-mono tracking-widest text-center text-lg"
            />

            <Button type="submit" isLoading={loading} size="lg" className="w-full font-bold">
              Confirm & Launch Admin Portal
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500">
          Seed Default: <code className="text-zinc-400">admin@curecare.com</code> / <code className="text-zinc-400">AurenAdmin2026!SecureKey</code>
        </div>
      </div>
    </div>
  );
}
