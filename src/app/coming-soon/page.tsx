"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Bell, CheckCircle2 } from "lucide-react";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setNotified(true);
    }
  };

  const upcoming = [
    {
      title: "Titanium Carabiner Key Anchor",
      subtitle: "Aerospace Grade 5 CNC-machined daily tether with magnetic latch.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      releaseDate: "Late Autumn 2026",
    },
    {
      title: "Vagabond Hardshell Carry-On 45L",
      subtitle: "Ultra-wide wheels, front-access office bay, and self-weighing ergonomic handle.",
      image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80",
      releaseDate: "Winter 2026",
    },
    {
      title: "Merino Wool Travel Blanket & Compression Pillow",
      subtitle: "Ultra-fine New Zealand merino wool packed inside an all-weather pouch.",
      image: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=800&q=80",
      releaseDate: "November 2026",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-3">
            <Badge variant="accent">In Development</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Future Studio Releases
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Silhouettes currently undergoing field trials and ergonomic stress testing. Enter your email to receive private pre-order access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcoming.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-zinc-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="350px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="neutral" size="sm">
                        {item.releaseDate}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {notified ? (
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>We will notify you on launch!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="flex-1 h-9 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 text-xs bg-transparent"
                      />
                      <Button type="submit" size="sm" className="h-9 gap-1">
                        <Bell className="h-3.5 w-3.5" />
                        <span>Notify</span>
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
