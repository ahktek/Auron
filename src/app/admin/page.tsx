"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductItem } from "@/lib/store/catalog";
import { StoredOrder } from "@/lib/store/productStore";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Package,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
      if (orderData.success && Array.isArray(orderData.orders)) {
        setOrders(orderData.orders);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled" && o.status !== "Refunded")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockProducts = products
    .filter((p) => {
      const totalInv = p.variants?.reduce((sum, v) => sum + (v.inventory || 0), 0) ?? 50;
      return totalInv <= 35;
    })
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Operations & Storefront Telemetry</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
              Live Store
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time sales revenue, inventory thresholds, and cash-on-delivery order queues across Bangladesh.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
          <Link href="/admin/products">
            <Button size="sm" className="bg-[#FF6857] hover:bg-[#e05646] text-white">
              Manage Products
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="text-white border-zinc-700 hover:bg-zinc-800">
              Orders Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Store Gross Volume</span>
            <span className="text-emerald-400 flex items-center text-[11px] font-bold">
              +18.4% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatPrice(totalRevenue, "BDT")}
          </p>
          <p className="text-[11px] text-zinc-500">Processed across orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Products</span>
            <span className="text-teal-400 flex items-center text-[11px] font-bold">
              Live
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{products.length}</p>
          <p className="text-[11px] text-zinc-500">Catalog items available</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Low Stock Alert</span>
            <span className="text-amber-400 flex items-center text-[11px] font-bold">
              Action Req.
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{lowStockProducts.length}</p>
          <p className="text-[11px] text-zinc-500">Items below threshold of 35</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Orders</span>
            <span className="text-emerald-400 flex items-center text-[11px] font-bold">
              +12% MoM
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
          <p className="text-[11px] text-zinc-500">Customer deliveries in queue</p>
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
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-800/30">
                    <td className="py-3 font-mono font-bold text-white">{o.id}</td>
                    <td className="py-3">{o.customerName}</td>
                    <td className="py-3 font-semibold text-white">
                      {formatPrice(o.total, "BDT")}
                    </td>
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
            {lowStockProducts.map((p) => {
              const inv = p.variants?.[0]?.inventory ?? 30;
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate font-mono">
                      {p.categoryName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-amber-400 text-sm">{inv}</span>
                    <span className="text-[10px] text-zinc-500 block">units left</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
