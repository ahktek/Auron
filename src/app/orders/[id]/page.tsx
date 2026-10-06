"use client";

import React, { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  MapPin,
  FileText,
} from "lucide-react";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const milestones = [
    { title: "Order Placed", date: "Today, 10:15 AM", done: true, current: false },
    { title: "Payment Confirmed", date: "Today, 10:16 AM", done: true, current: false },
    { title: "Processing & Quality Inspection", date: "In Studio", done: true, current: true },
    { title: "Handed to Courier", date: "Pending Dispatch", done: false, current: false },
    { title: "Delivered", date: "Estimated 3-4 Days", done: false, current: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container size="md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Storefront</span>
          </Link>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                  Package Tracking
                </span>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  Order {orderId}
                </h1>
              </div>
              <Badge variant="accent" size="md">
                In Preparation
              </Badge>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Fulfillment Status
              </h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                        m.current
                          ? "bg-[#C25E34] text-white ring-4 ring-[#FDF5F0]"
                          : m.done
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {m.done ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-semibold ${
                          m.current
                            ? "text-[#C25E34]"
                            : m.done
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400"
                        }`}
                      >
                        {m.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing Slip simulation button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <FileText className="h-4 w-4" />
                <span>Packing Slip & Commercial Invoice (PDF)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("Downloading PDF Packing Slip for " + orderId)}
              >
                Download Slip
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
