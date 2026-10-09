"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/lib/store/catalog";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const lowStockProducts = PRODUCTS.flatMap((p) =>
    p.variants
      .filter((v) => v.inventory <= 25)
      .map((v) => ({ ...v, productName: p.name, productSlug: p.slug }))
  ).slice(0, 5);

  const recentOrders = [
    { id: "AUR-928104", customer: "Alexander Hayes", total: "$199.00", status: "Delivered", date: "Today, 10:15 AM" },
    { id: "AUR-928103", customer: "Karin Lindqvist", total: "$345.00", status: "Shipped", date: "Today, 09:20 AM" },
    { id: "AUR-928102", customer: "Julian Reed", total: "$79.00", status: "Processing", date: "Yesterday" },
    { id: "AUR-928101", customer: "Elena Rostova", total: "$289.00", status: "Processing", date: "Yesterday" },
    { id: "AUR-928100", customer: "Marcus Vance", total: "$99.00", status: "Delivered", date: "2 days ago" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Operations & Performance Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time sales telemetry, inventory threshold monitors, and fulfillment queues.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products">
            <Button size="sm">Manage Catalog</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="text-white border-zinc-700 hover:bg-zinc-800">
              View All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Monthly Revenue</span>
            <span className="text-emerald-400 flex items-center text-[11px] font-bold">
              +14.8% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white">$148,920.00</p>
          <p className="text-[11px] text-zinc-500">Gross processed through Stripe</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Orders Completed</span>
            <span className="text-emerald-400 flex items-center text-[11px] font-bold">
              +8.2% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white">1,248</p>
          <p className="text-[11px] text-zinc-500">Average order value: $119.32</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Low Stock Alerts</span>
            <span className="text-amber-400 flex items-center text-[11px] font-bold">
              Action Req.
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{lowStockProducts.length}</p>
          <p className="text-[11px] text-zinc-500">Variants below threshold of 25</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Store Conversion Rate</span>
            <span className="text-emerald-400 flex items-center text-[11px] font-bold">
              3.42%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">41,200</p>
          <p className="text-[11px] text-zinc-500">Unique monthly store visitors</p>
        </div>
      </div>

      {/* 2 Main Data Tables: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Recent Customer Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs text-[#FF6857] hover:underline flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-800/30">
                    <td className="py-3 font-mono font-bold text-white">{o.id}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3 font-semibold text-white">{o.total}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800/40">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/60 rounded-2xl border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Low Inventory Monitor</h3>
            </div>
            <Link href="/admin/products" className="text-xs text-zinc-400 hover:text-white">
              Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white line-clamp-1">{p.productName}</p>
                  <p className="text-[11px] text-zinc-500">
                    {p.colorName} · SKU: {p.sku}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400 text-sm">{p.inventory}</span>
                  <span className="text-[10px] text-zinc-500 block">units left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
