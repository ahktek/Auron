"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, ArrowRight, Package, Truck, Mail } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "AUR-892401";
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auren_last_order");
      if (stored) setOrder(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-zinc-950 flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4">
        <Container className="flex items-center justify-between">
          <Logo size="md" />
          <Link href="/" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900">
            Return to Store
          </Link>
        </Container>
      </header>

      <main className="flex-1 py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                Order Confirmed
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Thank you for your order
              </h1>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Order confirmation and tracking information have been sent to{" "}
                <strong className="text-zinc-900 dark:text-zinc-100">
                  {order?.email || "your email address"}
                </strong>
                .
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-zinc-500">Order Reference:</span>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {orderNumber}
                </p>
              </div>
              <div>
                <span className="text-zinc-500">Estimated Dispatch:</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Within 24 Hours
                </p>
              </div>
              <Link href={`/orders/${orderNumber}`}>
                <Button variant="outline" size="sm">
                  Track Package
                </Button>
              </Link>
            </div>

            {/* Next Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <Mail className="h-4 w-4 text-[#C25E34]" />
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Receipt Emailed
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Check your inbox for line item invoice.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <Package className="h-4 w-4 text-[#C25E34]" />
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Hand-Checked
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Inspected & packed in FSC recyclable craft.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-1">
                <Truck className="h-4 w-4 text-[#C25E34]" />
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                  Courier Tracking
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Live tracking SMS/email on dispatch.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Go to Account Portal
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
