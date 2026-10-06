"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Eye,
  Search,
} from "lucide-react";

interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Refunded";
  trackingNumber?: string;
  date: string;
  itemsCount: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([
    { id: "AUR-928104", customerName: "Alexander Hayes", email: "alexander@example.com", total: 199.0, status: "Delivered", trackingNumber: "1Z9999999999999999", date: "2026-10-05", itemsCount: 1 },
    { id: "AUR-928103", customerName: "Karin Lindqvist", email: "karin@example.com", total: 345.0, status: "Shipped", trackingNumber: "1Z8888888888888888", date: "2026-10-06", itemsCount: 2 },
    { id: "AUR-928102", customerName: "Julian Reed", email: "julian@example.com", total: 79.0, status: "Processing", date: "2026-10-06", itemsCount: 1 },
    { id: "AUR-928101", customerName: "Elena Rostova", email: "elena@example.com", total: 289.0, status: "Processing", date: "2026-10-06", itemsCount: 1 },
    { id: "AUR-928100", customerName: "Marcus Vance", email: "marcus@example.com", total: 99.0, status: "Delivered", trackingNumber: "1Z7777777777777777", date: "2026-10-04", itemsCount: 1 },
  ]);

  const [search, setSearch] = useState("");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTracking, setNewTracking] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = (id: string, newStatus: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (activeOrder && activeOrder.id === id) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder && newTracking) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeOrder.id ? { ...o, trackingNumber: newTracking, status: "Shipped" } : o
        )
      );
      setActiveOrder({ ...activeOrder, trackingNumber: newTracking, status: "Shipped" });
      setNewTracking("");
    }
  };

  const handleSimulateRefund = (id: string) => {
    if (confirm(`Execute immediate Stripe refund of $${activeOrder?.total.toFixed(2)} for ${id}?`)) {
      handleUpdateStatus(id, "Refunded");
      alert(`Stripe payment refunded for order ${id}. Restock event dispatched.`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Orders & Fulfillment Operations
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Fulfillment workflows, tracking numbers, packing slip generation, and Stripe refunds.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or customer name..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FC5A43]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Order Reference</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Total Paid</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Courier Tracking</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-800/30">
                <td className="py-3 px-4 font-mono font-bold text-white">{order.id}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white block">{order.customerName}</span>
                  <span className="text-[10px] text-zinc-500">{order.email}</span>
                </td>
                <td className="py-3 px-4 font-bold text-white">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === "Delivered"
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                        : order.status === "Shipped"
                        ? "bg-blue-950/60 text-blue-400 border-blue-800/40"
                        : order.status === "Refunded"
                        ? "bg-red-950/60 text-red-400 border-red-800/40"
                        : "bg-amber-950/60 text-amber-400 border-amber-800/40"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                  {order.trackingNumber || <span className="text-zinc-600">Unassigned</span>}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveOrder(order);
                      setIsModalOpen(true);
                    }}
                    className="text-xs h-7 px-2.5 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order Management: ${activeOrder.id}`}
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
              <div>
                <span className="text-zinc-500 block">Customer</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {activeOrder.customerName}
                </span>
                <span className="text-zinc-500 block">{activeOrder.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Amount Captured</span>
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  ${activeOrder.total.toFixed(2)} USD
                </span>
                <span className="text-emerald-600 block">Stripe Authorized</span>
              </div>
            </div>

            {/* Status Workflow Selector */}
            <div className="space-y-2">
              <span className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Workflow Status
              </span>
              <div className="flex flex-wrap gap-2">
                {(["Pending", "Processing", "Shipped", "Delivered"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(activeOrder.id, st)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      activeOrder.status === st
                        ? "bg-[#FC5A43] text-white border-[#FC5A43]"
                        : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Assign Tracking Number */}
            <form onSubmit={handleSaveTracking} className="space-y-2">
              <Input
                label="Assign Courier Tracking ID"
                value={newTracking}
                onChange={(e) => setNewTracking(e.target.value)}
                placeholder="1Z9999999999999999"
              />
              <Button type="submit" size="sm" className="w-full">
                Save Tracking & Notify Customer
              </Button>
            </form>

            {/* Refund Button */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-zinc-500">Stripe Refund Engine</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleSimulateRefund(activeOrder.id)}
              >
                Issue Full Refund
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
