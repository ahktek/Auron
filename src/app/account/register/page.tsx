"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("auren_customer_logged_in", "true");
      localStorage.setItem("auren_customer_email", email);
      router.push("/account");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16 flex items-center justify-center">
        <Container size="sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857]">
                New Membership
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Join {BRAND.name}
              </h1>
              <p className="text-xs text-zinc-500">
                Enjoy speedier checkouts, express order tracking, and private capsule invitations.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@example.com"
              />

              <Input
                label="Password (Minimum 8 Characters)"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              <Button type="submit" isLoading={loading} size="lg" className="w-full font-bold">
                Create Account
              </Button>
            </form>

            <div className="text-center pt-2 text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
              <p>
                Already have an account?{" "}
                <Link href="/account/login" className="font-semibold text-[#FF6857] hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
