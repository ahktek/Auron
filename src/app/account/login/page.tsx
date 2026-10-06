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
import { Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login / authenticate customer
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("auren_customer_logged_in", "true");
      localStorage.setItem("auren_customer_email", email || "customer@example.com");
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                Customer Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Sign In to {BRAND.name}
              </h1>
              <p className="text-xs text-zinc-500">
                Access your order history, manage saved addresses, and view your carry wishlist.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button type="submit" isLoading={loading} size="lg" className="w-full font-bold">
                Sign In
              </Button>
            </form>

            <div className="text-center pt-2 text-xs text-zinc-500 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
              <p>
                Don&apos;t have an account yet?{" "}
                <Link href="/account/register" className="font-semibold text-[#C25E34] hover:underline">
                  Create an account
                </Link>
              </p>
              <p>
                Staff or Admin?{" "}
                <Link href="/admin" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
                  Go to Admin Portal
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
